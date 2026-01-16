"""配置模块"""
from .settings import (
    TUSHARE_TOKEN,
    SUPABASE_URL,
    SUPABASE_KEY,
    TRADE_DATE,
    LOG_LEVEL,
    TUSHARE_HTTP_URL,
    NO_PROXY_HOSTS
)

__all__ = [
    'TUSHARE_TOKEN',
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'TRADE_DATE',
    'LOG_LEVEL',
    'TUSHARE_HTTP_URL',
    'NO_PROXY_HOSTS'
]
