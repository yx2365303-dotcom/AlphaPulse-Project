# tushare_program

## 使用方法

1) 安装依赖

```bash
pip install -r requirements.txt
```

2) 配置环境变量

- 复制 `.env.example` 为 `.env` 并填入：`TUSHARE_TOKEN`、`SUPABASE_URL`、`SUPABASE_KEY`
- 注意：仓库已忽略 `.env`，不要把真实密钥提交到 Git

3) 运行

```bash
python main.py
```

## 可选配置

- `TRADE_DATE=YYYYMMDD`：手动指定交易日（默认取当天）
- `SUPABASE_TABLE`：默认 `equity_daily`

## 多接口批量抓取（main1.py）

`main1.py` 支持批量抓取龙虎榜、涨停、热门板块等多个接口数据。

**使用前必读：**
1. 查看 [API_FIELDS_MAPPING.md](API_FIELDS_MAPPING.md) 了解所有接口的字段列表
2. 根据文档在 Supabase 中创建对应的表和字段
3. 运行 `python main1.py` 执行批量抓取

**常见问题：**
- **"Could not find column"**: 数据库表缺少字段，参考 API_FIELDS_MAPPING.md 添加
- **"Out of range float values"**: 已自动处理 NaN/inf 值
- **"ON CONFLICT"**: 数据库唯一约束设置不当，参考文档调整主键
