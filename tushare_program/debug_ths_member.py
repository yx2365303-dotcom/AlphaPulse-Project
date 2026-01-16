"""
调试 ths_member API 返回的字段
"""
import sys
sys.path.insert(0, '.')

from utils.network import patch_ssl_and_timeout
patch_ssl_and_timeout()

from core import get_tushare_client

# 初始化客户端
client = get_tushare_client()
api = client.get_api()

# 测试查询
print("查询板块成分股: 885431.TI")
df = api.ths_member(ts_code='885431.TI')

if df is not None and not df.empty:
    print(f"\n数据行数: {len(df)}")
    print(f"\n字段列表: {list(df.columns)}")
    print(f"\n前5行数据:")
    print(df.head())
    print(f"\n数据类型:")
    print(df.dtypes)
else:
    print("无数据返回")
