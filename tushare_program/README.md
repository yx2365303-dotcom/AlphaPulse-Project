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
