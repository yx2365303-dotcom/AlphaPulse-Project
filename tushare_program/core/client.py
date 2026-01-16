"""
客户端初始化 - Tushare 和 Supabase
"""
import os
import tushare as ts
from supabase import create_client

from config import TUSHARE_TOKEN, SUPABASE_URL, SUPABASE_KEY, TUSHARE_HTTP_URL, NO_PROXY_HOSTS
from utils import logger


class TushareClient:
    """Tushare API 客户端"""
    
    def __init__(self):
        logger.info("初始化 Tushare 客户端...")
        ts.set_token(TUSHARE_TOKEN)
        self.pro = ts.pro_api()
        
        # VPN 环境优化
        self.pro._DataApi__http_url = TUSHARE_HTTP_URL
        self.pro._DataApi__token = TUSHARE_TOKEN
        
        # 配置代理绕过
        os.environ['NO_PROXY'] = NO_PROXY_HOSTS
        os.environ['no_proxy'] = NO_PROXY_HOSTS
        
        logger.info(f"Tushare 客户端初始化完成 (接口: {TUSHARE_HTTP_URL})")
    
    def get_api(self):
        """获取 Tushare Pro API 对象"""
        return self.pro


class SupabaseClient:
    """Supabase 客户端"""
    
    def __init__(self):
        logger.info("初始化 Supabase 客户端...")
        self.client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase 客户端初始化完成")
    
    def get_client(self):
        """获取 Supabase 客户端对象"""
        return self.client


# 全局单例
_tushare_client = None
_supabase_client = None


def get_tushare_client():
    """获取 Tushare 客户端单例"""
    global _tushare_client
    if _tushare_client is None:
        _tushare_client = TushareClient()
    return _tushare_client


def get_supabase_client():
    """获取 Supabase 客户端单例"""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = SupabaseClient()
    return _supabase_client
