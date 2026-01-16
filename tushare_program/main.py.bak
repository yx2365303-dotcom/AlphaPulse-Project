import os
import sys
from datetime import date
import urllib3

# ========== VPN 环境修复（必须在导入 tushare 之前） ==========
# 禁用 SSL 警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 简单补丁：直接禁用 SSL 验证
import requests

_original_session_request = requests.Session.request
def _patched_session_request(self, method, url, **kwargs):
    # 禁用 SSL 验证
    kwargs['verify'] = False
    # 设置超时
    if 'timeout' not in kwargs:
        kwargs['timeout'] = 30
    return _original_session_request(self, method, url, **kwargs)

requests.Session.request = _patched_session_request

print("✓ VPN 环境修复已激活（已禁用 SSL 验证）\n")

# ========== 导入其他库 ==========
import tushare as ts
import pandas as pd
from supabase import create_client

try:
    from dotenv import load_dotenv  # type: ignore[import-not-found]
except Exception:  # 允许不安装 python-dotenv（例如在生产环境只用系统环境变量）
    load_dotenv = None

# ===== 1. 配置 =====
if load_dotenv:
    # 显式指定 .env 文件路径，强制使用 UTF-8 编码
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        load_dotenv(env_path, encoding='utf-8-sig')  # utf-8-sig 自动去除 BOM
        print(f"✓ 已加载配置文件: {env_path}")
    else:
        print(f"⚠ 未找到 .env 文件: {env_path}")


def _require_env(name: str) -> str:
    # 尝试直接获取和处理 BOM 问题
    value = os.getenv(name)
    if not value:
        # 可能是 BOM 导致的问题，尝试遍历查找
        for key in os.environ.keys():
            clean_key = key.lstrip('\ufeff').strip()
            if clean_key == name:
                value = os.environ[key]
                print(f"⚠ 检测到 BOM 编码问题，已自动修复: {repr(key)} -> {name}")
                break
    
    if not value:
        print(f"\n❌ 错误：缺少环境变量 {name}")
        print(f"当前工作目录: {os.getcwd()}")
        print(f"脚本目录: {os.path.dirname(__file__)}")
        env_keys = [k for k in os.environ.keys() if 'TUSHARE' in k or 'SUPABASE' in k]
        print(f"相关环境变量: {env_keys}")
        print(f"环境变量详情: {[(repr(k), repr(os.environ[k][:20] + '...')) for k in env_keys]}")
        sys.exit(1)
    
    # 去除可能的前后空格、引号和 BOM
    return value.strip().strip('"').strip("'").lstrip('\ufeff')


print("正在加载配置...")
TUSHARE_TOKEN = _require_env("TUSHARE_TOKEN")
SUPABASE_URL = _require_env("SUPABASE_URL")
SUPABASE_KEY = _require_env("SUPABASE_KEY")
SUPABASE_TABLE = os.getenv("SUPABASE_TABLE", "equity_daily").strip().strip('"').strip("'")
print(f"✓ 配置加载完成 (Token: ...{TUSHARE_TOKEN[-8:]})")

# ===== 2. 初始化 =====
print("\n正在初始化 Tushare...")
ts.set_token(TUSHARE_TOKEN)
pro = ts.pro_api()

# 固定代码（你的 token 需要）
pro._DataApi__http_url = 'https://jiaoch.site'
pro._DataApi__token = TUSHARE_TOKEN

# VPN 环境下强制不使用代理（让 jiaoch.site 直连）
os.environ['NO_PROXY'] = 'jiaoch.site,*.jiaoch.site'
os.environ['no_proxy'] = 'jiaoch.site,*.jiaoch.site'

print(f"✓ Tushare 初始化完成 (接口: {pro._DataApi__http_url}, 已配置直连绕过 VPN)")



print("正在初始化 Supabase...")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
print("✓ Supabase 初始化完成")

# ===== 3. 拉取行情 =====
trade_date = os.getenv("TRADE_DATE") or date.today().strftime("%Y%m%d")
print(f"\n目标交易日期: {trade_date}")

# 带重试机制的数据拉取
max_retries = 3
df = pd.DataFrame()

for attempt in range(1, max_retries + 1):
    try:
        print(f"\n[尝试 {attempt}/{max_retries}] 正在从 Tushare 拉取数据...")
        df = pro.daily(trade_date=trade_date)
        if df is not None and not df.empty:
            print(f"✓ 成功拉取到 {len(df)} 条记录")
            break
        else:
            print(f"⚠ 接口返回空数据（可能不是交易日或权限不足）")
            if attempt < max_retries:
                print("  尝试使用前一个工作日...")
                # 往前推一天
                from datetime import datetime, timedelta
                dt = datetime.strptime(trade_date, "%Y%m%d")
                trade_date = (dt - timedelta(days=1)).strftime("%Y%m%d")
    except Exception as e:
        print(f"❌ 第 {attempt} 次尝试失败: {e}")
        if attempt < max_retries:
            import time
            print(f"  等待 2 秒后重试...")
            time.sleep(2)
        else:
            print("\n所有重试均失败，跳过数据写入。")
            df = pd.DataFrame()

# ===== 4. 写入逻辑（增加空值判断） =====
if not df.empty:
    print(f"\n正在处理 {len(df)} 条数据...")
    
    # 数据清洗
    df["trade_date"] = pd.to_datetime(df["trade_date"]).dt.date.astype(str)
    # 替换 NaN 为 None，因为 JSON 标准不支持 NaN
    df = df.where(pd.notnull(df), None)
    
    records = df.to_dict(orient="records")
    print(f"✓ 数据清洗完成")

    try:
        print(f"\n正在写入 Supabase 表 '{SUPABASE_TABLE}'...")
        response = supabase.table(SUPABASE_TABLE).upsert(records).execute()
        
        # 确认写入结果
        if hasattr(response, 'data') and response.data:
            print(f"✓ 成功写入 {len(response.data)} 条记录")
        else:
            print("✓ 写入完成（无返回数据）")
            
        print(f"\n========== 执行完成 ==========")
        print(f"交易日期: {trade_date}")
        print(f"数据条数: {len(df)}")
        print(f"目标表: {SUPABASE_TABLE}")
        print(f"==============================")
        
    except Exception as e:
        print(f"\n❌ Supabase 写入失败: {e}")
        print(f"错误类型: {type(e).__name__}")
        print("\n可能的解决方案：")
        print("1. 检查 SUPABASE_KEY 是否使用了 service_role key（非 anon key）")
        print("2. 确认 Supabase 表权限配置允许 upsert 操作")
        print("3. 检查表结构是否与数据字段匹配")
        sys.exit(1)
else:
    print("\n⚠ 没有获取到数据，跳过数据库写入")
    print("可能原因：")
    print("1. 指定的日期不是交易日")
    print("2. Tushare 账户权限不足（免费用户有延迟）")
    print("3. 网络连接问题")