# 🚀 快速修复指南（第二轮更新）

## 📋 当前状态

✅ **代码层面**: 100% 修复完成  
⚠️ **数据库层面**: 需要执行新的完整SQL脚本

---

## 🔍 本次修复内容

### 第一次SQL执行后发现的问题

| 表名 | 问题 | 解决方案 |
|------|------|---------|
| top_list | 缺少 pct_change, close, amount 等9个字段 | 添加完整字段 |
| top_inst | 主键约束导致重复记录无法插入 | 移除主键约束 |
| kpl_list | 缺少 last_time, lu_time, pct_chg 等13个字段 | 添加完整字段 |
| ths_daily | 缺少 pct_change, open, high, low 等10个字段 | 添加完整字段 |

---

## ✅ 立即执行（2步完成）

### 第1步：在 Supabase 执行新SQL

📄 **使用文件**: [supabase_update.sql](supabase_update.sql)  
或直接复制下方完整SQL：

```powershell
cd "c:\Users\Lenovo\Documents\Obsidian Vault\AlphaPulse Project\tushare_program"
python main.py
```

---

## 预期结果

执行 SQL 后再运行程序，应该看到：

- ✅ **15 个任务成功 / 0 个失败**
- ✅ 无 FutureWarning 警告
- ✅ ths_member 表写入成功（自动过滤无效记录）
- ✅ 所有字段匹配问题解决

---

## 当前数据库修复状态

| 表名 | 问题 | 状态 | SQL行号 |
|-----|------|------|---------|
| equity_daily | RLS 策略阻止写入 | ⚠️ 需执行 SQL | 第 8 行 |
| top_list | 缺少 net_rate 等字段 | ⚠️ 需执行 SQL | 第 15 行 |
| top_inst | 唯一约束冲突 | ⚠️ 需执行 SQL | 第 20-30 行 |
| kpl_list | 缺少 bid_amount 等字段 | ⚠️ 需执行 SQL | 第 33-44 行 |
| kpl_concept | 缺少 z_t_num 字段 | ⚠️ 需执行 SQL | 第 47 行 |
| ths_member | code 字段为 null | ✅ 代码已修复 | - |
| ths_daily | 缺少 change 等字段 | ⚠️ 需执行 SQL | 第 53-56 行 |

---

## 故障排查

### 如果仍有错误

1. **检查 SQL 是否执行成功**
   - 在 Supabase SQL Editor 中应该看到 "Success. No rows returned"
   - 如果有报错，记录具体错误信息

2. **检查表结构**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = '表名';
   ```

3. **查看详细日志**
   - 运行程序后会在终端显示详细错误信息
   - 记录错误代码（如 PGRST204, 23502, 42501）

4. **数据质量问题**
   - ths_member 表：自动过滤 code 为空的记录
   - 如果仍有问题，查看日志中"已过滤 X 条无效成分股记录"

---

## 快速测试单个功能

```powershell
# 只测试涨跌停数据（最快）
python main.py --concepts

# 只测试元数据
python main.py --meta

# 只测试热门板块
python main.py --hot
```

---

## 技术细节

### Pandas 警告修复原理
```python
# 旧代码
df = df.fillna(value=np.nan)  # 会触发 FutureWarning

# 新代码
df = df.fillna(value=np.nan)
object_cols = df.select_dtypes(include=['object']).columns
if len(object_cols) > 0:
    df[object_cols] = df[object_cols].infer_objects(copy=False)
```

### ths_member 数据过滤
```python
# 新增逻辑
member_df = fetcher.tushare.ths_member(ts_code=code)
member_df = member_df[member_df['code'].notna()]  # 过滤空值
```

---

**最后更新**: 2026-01-16 18:20
**状态**: ⚠️ 等待执行 SQL 脚本
