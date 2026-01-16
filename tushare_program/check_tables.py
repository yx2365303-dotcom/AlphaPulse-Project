"""
检查 Supabase 数据表状态
"""
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')

print(f"Supabase URL: {url}")
print(f"Supabase Key: {key[:20]}...")
print()

client = create_client(url, key)

tables = [
    'limit_list_ths',
    'top_list', 
    'limit_step',
    'limit_cpt_list',
    'limit_list_d'
]

print("检查数据表状态:")
print("-" * 50)

for table in tables:
    try:
        result = client.table(table).select('*', count='exact').limit(1).execute()
        count = result.count if hasattr(result, 'count') else len(result.data) if result.data else 0
        status = "✓" if count > 0 else "○"
        print(f"{status} {table:20} {count} 条记录")
    except Exception as e:
        print(f"✗ {table:20} 错误: {str(e)[:50]}")

print("-" * 50)
