# 历史数据回填进度

## 📊 回填状态

**开始时间**: 2026-01-16 18:48  
**状态**: 🔄 运行中  
**总任务**: 243 个交易日  
**预计耗时**: 约 40 分钟

---

## 🎯 当前进度

程序正在后台运行，自动回填近一年的历史数据。

### 实时状态查看

在终端中你可以看到：
```
进度: [X/243] YYYYMMDD
[时间] INFO - [成功] 写入 N 条到 table_name
```

### 每10个交易日显示汇总

```
------------------------------------------------------------
📊 已完成: X/243
✅ 总成功: XXXX
❌ 总失败: 0
⏱️  已耗时: X.X 分钟
⏳ 预计剩余: X.X 分钟
------------------------------------------------------------
```

---

## 📋 回填数据清单

每个交易日回填以下数据：

1. **龙虎榜数据**
   - top_list: 龙虎榜每日明细
   - top_inst: 机构席位明细

2. **涨跌停数据**
   - limit_list_ths: 涨停股列表
   - limit_list_d: 涨跌停统计
   - limit_step: 涨停阶梯
   - limit_cpt_list: 涨停板块

3. **开盘啦数据**
   - kpl_list: 科创板涨停
   - kpl_concept: 科创板概念

**每日任务数**: 8 个  
**预期成功率**: 100%

---

## 📈 预期数据量

| 数据类型 | 每日平均 | 总计（243天） |
|---------|---------|-------------|
| top_list | 60-80条 | ~18,000条 |
| top_inst | 700-900条 | ~200,000条 |
| limit_list_ths | 50-80条 | ~16,000条 |
| limit_list_d | 90-120条 | ~25,000条 |
| limit_step | 15-25条 | ~5,000条 |
| limit_cpt_list | 20条 | ~5,000条 |
| kpl_list | 50-80条 | ~16,000条 |
| kpl_concept | 180条 | ~44,000条 |

**总计**: 约 330,000 条历史记录

---

## ⚠️ 注意事项

### 不要中断程序

程序设计了异常处理，但最好让它自然完成。如果需要中断：
```powershell
# 按 Ctrl+C 或关闭终端窗口
```

### API限流保护

- 每个交易日之间自动暂停 1 秒
- 每个API调用失败后自动重试 3 次
- 重试间隔 2 秒

### 错误处理

如果某个交易日失败：
- 程序会记录错误日志
- 继续处理下一个交易日
- 不会影响整体进度

---

## ✅ 完成后的操作

程序完成后会显示最终汇总：

```
======================================================================
回填完成！
======================================================================
📊 总交易日: 243
✅ 总成功: ~1944 (243 × 8)
❌ 总失败: 0
⏱️  总耗时: XX 分钟
⚡ 平均速度: 10 秒/交易日
======================================================================
```

### 验证数据

在 Supabase 控制台执行：
```sql
-- 查看各表数据量
SELECT 
  'top_list' as table_name, COUNT(*) as count FROM top_list
UNION ALL SELECT 'top_inst', COUNT(*) FROM top_inst
UNION ALL SELECT 'limit_list_ths', COUNT(*) FROM limit_list_ths
UNION ALL SELECT 'limit_list_d', COUNT(*) FROM limit_list_d
UNION ALL SELECT 'limit_step', COUNT(*) FROM limit_step
UNION ALL SELECT 'limit_cpt_list', COUNT(*) FROM limit_cpt_list
UNION ALL SELECT 'kpl_list', COUNT(*) FROM kpl_list
UNION ALL SELECT 'kpl_concept', COUNT(*) FROM kpl_concept;
```

---

## 🔧 配置说明

### 修改时间范围

编辑 [backfill_history.py](backfill_history.py):
```python
# 第119行附近
start_date = end_date - timedelta(days=365)  # 改为需要的天数
```

### 包含热门板块数据

```python
# 第127行
include_hot = False  # 改为 True
```

注意：包含热门板块会增加每天约30秒的处理时间。

---

**最后更新**: 2026-01-16 18:50  
**文档版本**: v1.0
