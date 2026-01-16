"""
日度数据抓取任务
"""
from datetime import date

from config import TRADE_DATE
from core import DataFetcher
from utils import logger


def get_trade_date():
    """获取交易日期"""
    if TRADE_DATE and TRADE_DATE.strip():
        return TRADE_DATE
    return date.today().strftime("%Y%m%d")


def run_daily_tasks(trade_date=None):
    """
    执行日度数据抓取任务
    
    Args:
        trade_date: 交易日期 YYYYMMDD，如果为None则使用配置或当天
    
    包括：
    - 龙虎榜数据
    - 涨跌停数据
    - 开盘啦数据
    - 同花顺概念指数日线
    """
    if trade_date is None:
        trade_date = get_trade_date()
    logger.info(f"=== 开始日度数据抓取 (日期: {trade_date}) ===")
    
    fetcher = DataFetcher()
    
    # 任务列表：(API方法名, 表名, 参数字典)
    tasks = [
        # 龙虎榜
        ('top_list', 'top_list', {'trade_date': trade_date}),
        ('top_inst', 'top_inst', {'trade_date': trade_date}),
        
        # 涨跌停专题
        ('limit_list_ths', 'limit_list_ths', {'trade_date': trade_date}),
        ('limit_list_d', 'limit_list_d', {'trade_date': trade_date}),
        ('limit_step', 'limit_step', {'trade_date': trade_date}),
        ('limit_cpt_list', 'limit_cpt_list', {'trade_date': trade_date}),
        
        # 开盘啦
        ('kpl_list', 'kpl_list', {'trade_date': trade_date}),
        ('kpl_concept', 'kpl_concept', {'trade_date': trade_date}),
    ]
    
    success_count = 0
    fail_count = 0
    
    for method, table, params in tasks:
        result = fetcher.fetch_and_save(method, table, **params)
        if result:
            success_count += 1
        else:
            fail_count += 1
    
    logger.info(f"=== 日度数据抓取完成 ===")
    logger.info(f"成功: {success_count}, 失败: {fail_count}")
    
    return success_count, fail_count


def run_equity_daily():
    """
    执行个股日线数据抓取（原 main.py 的功能）
    """
    trade_date = get_trade_date()
    logger.info(f"=== 开始个股日线数据抓取 (日期: {trade_date}) ===")
    
    fetcher = DataFetcher()
    result = fetcher.fetch_and_save('daily', 'equity_daily', trade_date=trade_date)
    
    if result:
        logger.info("=== 个股日线数据抓取完成 ===")
        return 1, 0
    else:
        logger.error("=== 个股日线数据抓取失败 ===")
        return 0, 1
