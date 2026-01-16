import os
import sys
import time
from datetime import date
import urllib3
import requests
import tushare as ts
import pandas as pd
from supabase import create_client

# ========== VPN 环境修复 ==========
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
_original_session_request = requests.Session.request
def _patched_session_request(self, method, url, **kwargs):
    kwargs['verify'] = False
    if 'timeout' not in kwargs: kwargs['timeout'] = 30
    return _original_session_request(self, method, url, **kwargs)
requests.Session.request = _patched_session_request

# ========== 配置加载 ==========
try:
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path): load_dotenv(env_path, encoding='utf-8-sig')
except ImportError:
    pass

def _require_env(name):
    val = os.getenv(name)
    if not val:
        print(f"❌ 缺少环境变量: {name}")
        sys.exit(1)
    return val.strip().strip('"').lstrip('\ufeff')

TUSHARE_TOKEN = _require_env("TUSHARE_TOKEN")
SUPABASE_URL = _require_env("SUPABASE_URL")
SUPABASE_KEY = _require_env("SUPABASE_KEY")

# ========== 初始化 ==========
print("正在初始化服务...")
ts.set_token(TUSHARE_TOKEN)
pro = ts.pro_api()

# 固定代码（你的 token 需要）
pro._DataApi__http_url = 'https://jiaoch.site' # VPN直连优化
pro._DataApi__token = TUSHARE_TOKEN

# VPN 环境下强制不使用代理（让 jiaoch.site 直连）
os.environ['NO_PROXY'] = 'jiaoch.site,*.jiaoch.site'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 使用历史交易日避免当日数据未出的问题（测试用）
# 建议设置为最近一个确定的交易日，如 20250110
trade_date = os.getenv("TRADE_DATE") or "20250110"  # 修改为历史日期便于测试
print(f"[日期] 目标日期: {trade_date}")
print(f"[提示] 当前使用历史日期 {trade_date}，确保数据可用性")

# ========== 核心逻辑函数 ==========

def fetch_and_save(api_method_name, table_name, **kwargs):
    """
    通用抓取与写入函数
    :param api_method_name: Tushare API 方法名 (字符串)
    :param table_name: Supabase 表名
    :param kwargs: 传递给 API 的参数 (如 trade_date)
    """
    print(f"\n[任务] {table_name} ({api_method_name})")
    print(f"  参数: {kwargs}")
    
    retry_count = 3
    for attempt in range(retry_count):
        try:
            # 动态调用 Tushare 接口
            api_func = getattr(pro, api_method_name)
            df = api_func(**kwargs)
            
            if df is None or df.empty:
                print(f"  ⚠ 无数据 (尝试 {attempt+1}/{retry_count})")
                if attempt == retry_count - 1: return
                time.sleep(1)
                continue
            
            print(f"  → 获取到 {len(df)} 条原始数据")
            
            # 数据清洗
            # 1. 处理日期格式 (如有)
            if 'trade_date' in df.columns:
                df['trade_date'] = pd.to_datetime(df['trade_date']).dt.date.astype(str)
            
            # 2. 特殊字段重命名 (映射 API 返回字段 -> 数据库字段)
            # 例如 limit_list_d 返回 limit 字段，但它是 SQL 关键字，我们映射为 limit_flag
            if api_method_name == 'limit_list_d' and 'limit' in df.columns:
                df.rename(columns={'limit': 'limit_flag'}, inplace=True)
            
            # 3. 严格的 NaN/inf/-inf 处理 (修复 JSON 序列化问题)
            import numpy as np
            import math
            
            # 调试：检查每列的 NaN 情况
            nan_cols = df.columns[df.isna().any()].tolist()
            if nan_cols:
                print(f"  [警告] 包含NaN的列: {nan_cols[:5]}")
            
            # 方法1：使用 fillna(value=None) 更彻底
            df = df.replace([np.inf, -np.inf], np.nan)  # 先统一为 NaN
            df = df.fillna(value=np.nan)  # 确保所有 NaN 统一
            
            # 4. 打印前10个字段信息用于调试
            print(f"  → 字段: {list(df.columns)[:10]}")
            
            # 转换为字典
            records = df.to_dict(orient="records")
            
            # 最后一道防线：递归清理 records 中的所有 NaN/inf
            def clean_record(obj):
                if isinstance(obj, dict):
                    return {k: clean_record(v) for k, v in obj.items()}
                elif isinstance(obj, list):
                    return [clean_record(v) for v in obj]
                elif isinstance(obj, float):
                    # 检查是否为 NaN 或 inf
                    if math.isnan(obj) or math.isinf(obj):
                        return None
                    return obj
                elif pd.isna(obj):  # pandas 的 NA 类型
                    return None
                return obj
            
            records = [clean_record(r) for r in records]
            
            # 写入 Supabase
            res = supabase.table(table_name).upsert(records).execute()
            print(f"  ✓ 成功写入 {len(records)} 条")
            break
            
        except Exception as e:
            error_msg = str(e)
            print(f"  ❌ 错误: {error_msg}")
            
            # 如果是数据库字段不匹配错误，给出建议
            if 'Could not find' in error_msg or 'PGRST204' in error_msg:
                print(f"  [提示] 数据库表 {table_name} 字段不匹配，请检查 Supabase 表结构")
                if df is not None and not df.empty:
                    print(f"  [字段] API返回字段: {list(df.columns)}")
                break  # 字段不匹配不需要重试
            
            if attempt < retry_count - 1:
                time.sleep(2)
            else:
                print("  ⚠ 跳过此任务")

# ========== 1. 按日期抓取的数据列表 ==========
# 格式: (API方法名, 数据库表名, 参数字典)
DAILY_TASKS = [
    # 龙虎榜
    ('top_list', 'top_list', {'trade_date': trade_date}),
    ('top_inst', 'top_inst', {'trade_date': trade_date}),
    
    # 涨跌停专题
    # 注意：limit_list_ths 的 limit_type 参数可能因账户权限不同而需要调整
    # 可选值: '涨停池', '跌停池', '炸板池' 等，或不传该参数获取全部
    ('limit_list_ths', 'limit_list_ths', {'trade_date': trade_date}),  # 去掉 limit_type 获取全部
    ('limit_list_d', 'limit_list_d', {'trade_date': trade_date}), # 涨跌停炸板
    ('limit_step', 'limit_step', {'trade_date': trade_date}), # 连板天梯
    ('limit_cpt_list', 'limit_cpt_list', {'trade_date': trade_date}), # 最强板块
    
    # 开盘啦
    ('kpl_list', 'kpl_list', {'trade_date': trade_date}), 
    ('kpl_concept', 'kpl_concept', {'trade_date': trade_date}),
]

# 执行日度任务
print("\n>>> 开始执行日度数据抓取...")
for method, table, params in DAILY_TASKS:
    fetch_and_save(method, table, **params)

# ========== 2. 特殊处理：同花顺/开盘啦 概念成分与行情 ==========
# 这类数据量极大，或者是静态元数据，通常不需要每天全量跑，或者需要循环跑
# 下面演示如何抓取 "同花顺概念列表" 和 "最强板块的成分股"

print("\n>>> 正在更新同花顺概念列表 (Meta Data)...")
fetch_and_save('ths_index', 'ths_index', exchange='A')

# --- 进阶：抓取今日热门板块的成分股和行情 ---
# 逻辑：先获取今日"涨停最强板块"，然后循环获取这些板块的成分股
print("\n>>> 正在分析今日热门板块...")
try:
    hot_df = pro.limit_cpt_list(trade_date=trade_date)
    if not hot_df.empty:
        # 取前5个最强板块的代码
        hot_codes = hot_df.head(5)['ts_code'].tolist()
        print(f"  今日最强前5板块: {hot_codes}")
        
        for code in hot_codes:
            # 1. 获取该板块成分股 (ths_member)
            # 注意：ths_member 接口可能需要积分较高，且变动不大，可视情况运行
            # 如果 Supabase 表不存在或字段不匹配，会自动跳过
            print(f"\n  → 处理板块: {code}")
            fetch_and_save('ths_member', 'ths_member', ts_code=code)
            
            # 2. 获取该板块指数日线 (ths_daily)
            fetch_and_save('ths_daily', 'ths_daily', ts_code=code, start_date=trade_date, end_date=trade_date)
            
            # 3. 开盘啦题材成分 (kpl_concept_cons)
            # 开盘啦的ID体系和同花顺不同，这里仅作逻辑演示，需要传入对应的题材ID
            # fetch_and_save('kpl_concept_cons', 'kpl_concept_cons', trade_date=trade_date, ts_code='题材ID')
            
            time.sleep(0.5) # 防止超频
    else:
        print("  今日无最强板块数据，跳过详细抓取。")
except Exception as e:
    print(f"  ❌ 热门板块分析失败: {e}")

print("\n========== 全部完成 ==========")