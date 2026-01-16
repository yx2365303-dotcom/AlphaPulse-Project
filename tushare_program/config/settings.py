"""
配置管理 - 从环境变量加载配置
"""
import os
import sys
from pathlib import Path


def load_env_file():
    """加载 .env 文件"""
    try:
        from dotenv import load_dotenv
        env_path = Path(__file__).parent.parent / ".env"
        if env_path.exists():
            load_dotenv(env_path, encoding='utf-8-sig')
            return True
    except ImportError:
        pass
    return False


def require_env(name):
    """获取必需的环境变量"""
    val = os.getenv(name)
    if not val:
        print(f"[错误] 缺少环境变量: {name}")
        sys.exit(1)
    return val.strip().strip('"').lstrip('\ufeff')


# 加载环境变量
load_env_file()

# 配置项
TUSHARE_TOKEN = require_env("TUSHARE_TOKEN")
SUPABASE_URL = require_env("SUPABASE_URL")
SUPABASE_KEY = require_env("SUPABASE_KEY")

# 可选配置
TRADE_DATE = os.getenv("TRADE_DATE", "20250110")  # 默认使用历史日期便于测试
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Tushare 配置
TUSHARE_HTTP_URL = 'https://jiaoch.site'
NO_PROXY_HOSTS = 'jiaoch.site,*.jiaoch.site'
