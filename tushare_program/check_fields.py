"""
检查数据库表字段
"""
from supabase import create_client
import os
from dotenv import load_dotenv
import json

load_dotenv()
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase = create_client(url, key)

tables = ['limit_list_ths', 'top_list', 'limit_step', 'limit_cpt_list', 'limit_list_d']

for table in tables:
    try:
        result = supabase.table(table).select('*').limit(1).execute()
        if result.data:
            print(f'\n{table} 字段:')
            print(json.dumps(list(result.data[0].keys()), indent=2, ensure_ascii=False))
        else:
            print(f'\n{table}: 无数据')
    except Exception as e:
        print(f'\n{table}: 错误 - {e}')
