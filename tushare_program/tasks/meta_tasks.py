"""
元数据和静态数据抓取任务
"""
import time

from core import DataFetcher
from utils import logger


def run_meta_tasks():
    """
    执行元数据抓取任务
    
    包括：
    - 同花顺概念列表
    - 热门板块的成分股和日线数据
    """
    logger.info("=== 开始元数据抓取 ===")
    
    fetcher = DataFetcher()
    success_count = 0
    fail_count = 0
    
    # 1. 同花顺概念列表（静态数据，不常变）
    logger.info("[元数据] 同花顺概念列表")
    result = fetcher.fetch_and_save('ths_index', 'ths_index', exchange='A')
    if result:
        success_count += 1
    else:
        fail_count += 1
    
    logger.info(f"=== 元数据抓取完成 ===")
    logger.info(f"成功: {success_count}, 失败: {fail_count}")
    
    return success_count, fail_count


def run_hot_concepts(trade_date, top_n=5):
    """
    抓取热门板块的详细数据
    
    Args:
        trade_date: 交易日期
        top_n: 抓取前 N 个热门板块
    """
    logger.info(f"=== 开始热门板块详细数据抓取 (前 {top_n} 个) ===")
    
    fetcher = DataFetcher()
    success_count = 0
    fail_count = 0
    
    try:
        # 先获取最强板块列表
        hot_df = fetcher.tushare.limit_cpt_list(trade_date=trade_date)
        
        if hot_df is None or hot_df.empty:
            logger.warning("  当日无最强板块数据")
            return 0, 0
        
        hot_codes = hot_df.head(top_n)['ts_code'].tolist()
        logger.info(f"  今日最强前 {top_n} 板块: {hot_codes}")
        
        for code in hot_codes:
            logger.info(f"  处理板块: {code}")
            
            # 板块成分股 - API返回字段需要映射到数据库字段
            try:
                member_df = fetcher.tushare.ths_member(ts_code=code)
                if member_df is not None and not member_df.empty:
                    # API返回: ts_code, con_code, con_name
                    # 数据库需要: ts_code, code (映射自con_code), ...
                    
                    # 过滤掉con_code字段为空的记录
                    if 'con_code' in member_df.columns:
                        original_count = len(member_df)
                        member_df = member_df[member_df['con_code'].notna()]
                        filtered_count = len(member_df)
                        if original_count > filtered_count:
                            logger.info(f"    已过滤 {original_count - filtered_count} 条无效成分股记录")
                        
                        # 添加字段映射：数据库的code字段 = API的con_code字段
                        if 'code' not in member_df.columns:
                            member_df['code'] = member_df['con_code']
                    
                    # 保存过滤后的数据
                    if not member_df.empty:
                        result1 = fetcher.save_to_supabase(member_df, 'ths_member')
                        if result1:
                            success_count += 1
                        else:
                            fail_count += 1
                    else:
                        logger.warning("    过滤后无有效数据")
                        fail_count += 1
                else:
                    logger.warning("    未获取到成分股数据")
                    fail_count += 1
            except Exception as e:
                logger.error(f"    获取成分股数据异常: {e}")
                fail_count += 1
            
            # 板块指数日线
            result2 = fetcher.fetch_and_save(
                'ths_daily', 'ths_daily',
                ts_code=code, start_date=trade_date, end_date=trade_date
            )
            if result2:
                success_count += 1
            else:
                fail_count += 1
            
            time.sleep(0.5)  # 防止接口超频
        
        logger.info(f"=== 热门板块详细数据抓取完成 ===")
        logger.info(f"成功: {success_count}, 失败: {fail_count}")
        
    except Exception as e:
        logger.error(f"热门板块数据抓取异常: {e}")
        return success_count, fail_count
    
    return success_count, fail_count
