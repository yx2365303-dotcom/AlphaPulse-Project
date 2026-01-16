"""
调试各个API返回的字段
"""
import sys
sys.path.insert(0, '.')

from utils.network import patch_ssl_and_timeout
patch_ssl_and_timeout()

from core import get_tushare_client

# 初始化客户端
client = get_tushare_client()
api = client.get_api()

print("="*60)
print("1. top_list API 字段")
print("="*60)
df1 = api.top_list(trade_date='20250110')
if df1 is not None and not df1.empty:
    print(f"字段列表: {list(df1.columns)}")
    print(f"示例数据:")
    print(df1.head(2))
else:
    print("无数据")

print("\n" + "="*60)
print("2. top_inst API 字段")
print("="*60)
df2 = api.top_inst(trade_date='20250110')
if df2 is not None and not df2.empty:
    print(f"字段列表: {list(df2.columns)}")
    print(f"数据行数: {len(df2)}")
    print(f"示例数据:")
    print(df2.head(2))
    # 检查是否有重复
    dup = df2[df2.duplicated(subset=['trade_date', 'ts_code', 'exalter'], keep=False)]
    if not dup.empty:
        print(f"\n⚠️ 发现重复记录 (按trade_date, ts_code, exalter分组):")
        print(dup.head(10))
else:
    print("无数据")

print("\n" + "="*60)
print("3. kpl_list API 字段")
print("="*60)
df3 = api.kpl_list(trade_date='20250110')
if df3 is not None and not df3.empty:
    print(f"字段列表: {list(df3.columns)}")
    print(f"示例数据:")
    print(df3.head(2))
else:
    print("无数据")
