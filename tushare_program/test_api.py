import os
import sys
import urllib3
import requests
import tushare as ts
import pandas as pd

# VPN 环境修复
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
_original_session_request = requests.Session.request
def _patched_session_request(self, method, url, **kwargs):
    kwargs['verify'] = False
    if 'timeout' not in kwargs: kwargs['timeout'] = 30
    return _original_session_request(self, method, url, **kwargs)
requests.Session.request = _patched_session_request

# 配置加载
try:
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path): load_dotenv(env_path, encoding='utf-8-sig')
except ImportError:
    pass

TUSHARE_TOKEN = os.getenv("TUSHARE_TOKEN").strip().strip('"').lstrip('\ufeff')

# 初始化
ts.set_token(TUSHARE_TOKEN)
pro = ts.pro_api()
pro._DataApi__http_url = 'https://jiaoch.site'
pro._DataApi__token = TUSHARE_TOKEN
os.environ['NO_PROXY'] = 'jiaoch.site,*.jiaoch.site'

# 测试接口
print("测试 top_list 接口...")
df = pro.top_list(trade_date='20250110')

print(f"数据量: {len(df)}")
print(f"列名: {df.columns.tolist()}")
print(f"\nNaN 统计:")
print(df.isnull().sum())

print(f"\n数据类型:")
print(df.dtypes)

print(f"\n第一行数据:")
print(df.iloc[0].to_dict())

# 测试清理
import numpy as np
import math

df_clean = df.replace([np.inf, -np.inf], None)
df_clean = df_clean.where(pd.notnull(df_clean), None)
records = df_clean.to_dict(orient="records")

# 递归清理
def clean_record(obj):
    if isinstance(obj, dict):
        return {k: clean_record(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_record(v) for v in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    return obj

records_clean = [clean_record(r) for r in records]

print(f"\n清理后第一条记录:")
print(records_clean[0])

# 尝试序列化
import json
try:
    json_str = json.dumps(records_clean[0], ensure_ascii=False)
    print("\n✓ JSON 序列化成功")
except Exception as e:
    print(f"\n❌ JSON 序列化失败: {e}")
