"""
验证前端代码中使用的所有数据库字段是否存在
"""
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

# 定义前端代码中使用的字段
field_checks = {
    'limit_list_ths': {
        'select': ['price', 'pct_chg', 'limit_type', 'lu_desc', 'status', 
                   'first_lu_time', 'last_lu_time', 'open_num', 'limit_amount', 'tag'],
        'order': ['trade_date']
    },
    'top_list': {
        'select': ['close', 'pct_chg', 'net_amount', 'l_buy', 'l_sell', 'reason'],
        'order': ['net_amount']
    },
    'limit_step': {
        'select': ['nums'],
        'order': ['nums']
    },
    'limit_cpt_list': {
        'select': ['up_nums', 'cons_nums', 'pct_chg', 'rank'],
        'order': ['up_nums']
    },
    'limit_list_d': {
        'select': ['limit_flag', 'amount'],
        'order': ['trade_date']
    },
    'top_inst': {
        'select': ['exalter', 'buy', 'buy_rate', 'sell', 'sell_rate', 'net_buy', 'reason'],
        'order': ['net_buy']
    },
    'kpl_list': {
        'select': ['pct_chg'],
        'order': ['pct_chg']
    }
}

print("=" * 60)
print("验证数据库表字段")
print("=" * 60)

all_ok = True
for table_name, checks in field_checks.items():
    print(f"\n检查表: {table_name}")
    try:
        # 获取表的所有字段
        result = supabase.table(table_name).select('*').limit(1).execute()
        if not result.data:
            print(f"  ⚠️  警告: 表 {table_name} 没有数据")
            continue
        
        actual_fields = set(result.data[0].keys())
        
        # 检查 SELECT 字段
        missing_select = [f for f in checks['select'] if f not in actual_fields]
        if missing_select:
            print(f"  ❌ 缺失 SELECT 字段: {', '.join(missing_select)}")
            all_ok = False
        else:
            print(f"  ✅ SELECT 字段全部存在")
        
        # 检查 ORDER 字段
        missing_order = [f for f in checks['order'] if f not in actual_fields]
        if missing_order:
            print(f"  ❌ 缺失 ORDER 字段: {', '.join(missing_order)}")
            all_ok = False
        else:
            print(f"  ✅ ORDER 字段全部存在")
            
    except Exception as e:
        print(f"  ❌ 错误: {e}")
        all_ok = False

print("\n" + "=" * 60)
if all_ok:
    print("✅ 所有字段验证通过！")
else:
    print("❌ 发现字段问题，请查看上方详情")
print("=" * 60)
