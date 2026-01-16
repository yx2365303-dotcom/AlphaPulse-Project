# 数据库 vs API 字段对比

## ths_member 表问题分析

### 错误信息
```
null value in column "code" of relation "ths_member" violates not-null constraint
Failing row contains (885431.TI, null, null, null, 000009.SZ, 中国宝安)
```

### API 实际返回字段
```python
['ts_code', 'con_code', 'con_name']
```

### 数据分析
从错误信息 `(885431.TI, null, null, null, 000009.SZ, 中国宝安)` 来看：
- 字段1: 885431.TI → ts_code (板块代码)
- 字段2-4: null, null, null → **数据库有3个额外字段（可能是code, ?, ?）**
- 字段5: 000009.SZ → con_code (成分股代码)
- 字段6: 中国宝安 → con_name (成分股名称)

### 问题根本原因
**数据库表的字段顺序与API返回字段不匹配！**

数据库表可能定义为：
```sql
CREATE TABLE ths_member (
    ts_code VARCHAR,
    code VARCHAR NOT NULL,    -- ⚠️ 这个字段不在API返回中
    ...其他字段...,
    con_code VARCHAR,
    con_name VARCHAR
);
```

API返回字段只有3个：
```python
ts_code, con_code, con_name
```

当插入时，Supabase尝试按顺序填充：
- ts_code ← 885431.TI ✅
- code ← con_code (000009.SZ) → 但实际写到了后面的字段
- 中间字段 ← null
- ...

### 解决方案

需要确认数据库表结构，然后有两个选择：

**方案1：修改数据库表**（推荐）
- 确保数据库字段与API返回一致
- 只保留: ts_code, con_code, con_name

**方案2：在代码中重命名字段**
```python
# 如果数据库字段确实不同，需要重命名
if 'con_code' in member_df.columns and 'code' not in member_df.columns:
    member_df['code'] = member_df['con_code']
```

### 建议执行

1. 登录 Supabase
2. 执行以下SQL查看表结构：
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'ths_member'
ORDER BY ordinal_position;
```

3. 根据结果决定：
   - 如果数据库有code字段 → 在代码中添加字段映射
   - 如果数据库字段混乱 → 删除表重新创建

### 临时解决方案

在 `meta_tasks.py` 中添加字段映射：
```python
# 如果API字段与数据库不匹配，添加映射
if 'con_code' in member_df.columns:
    # 检查数据库是否需要code字段
    member_df['code'] = member_df['con_code']  # 映射关系
```
