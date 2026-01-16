#!/usr/bin/env python3
"""
Tushare 数据采集程序 - 统一入口
 
支持的运行模式：
1. 全量模式（默认）：抓取所有数据
2. 仅日线：只抓取个股日线数据
3. 仅日度：只抓取龙虎榜/涨停等日度数据
4. 仅元数据：只抓取概念列表等静态数据

用法：
    python main.py              # 全量抓取
    python main.py --daily      # 仅个股日线
    python main.py --concepts   # 仅日度数据
    python main.py --meta       # 仅元数据
"""
import sys
import argparse
from datetime import datetime

# 必须最先执行网络修复
from utils import patch_ssl_and_timeout, logger
patch_ssl_and_timeout()

from tasks import (
    run_equity_daily,
    run_daily_tasks,
    run_meta_tasks,
    run_hot_concepts,
    get_trade_date
)


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='Tushare 数据采集程序')
    parser.add_argument('--daily', action='store_true', help='仅抓取个股日线数据')
    parser.add_argument('--concepts', action='store_true', help='仅抓取龙虎榜/涨停等日度数据')
    parser.add_argument('--meta', action='store_true', help='仅抓取元数据（概念列表等）')
    parser.add_argument('--hot', action='store_true', help='抓取热门板块详细数据')
    parser.add_argument('--top-n', type=int, default=5, help='热门板块数量（默认5）')
    
    args = parser.parse_args()
    
    # 记录开始时间
    start_time = datetime.now()
    trade_date = get_trade_date()
    
    logger.info("=" * 60)
    logger.info("Tushare 数据采集程序启动")
    logger.info(f"交易日期: {trade_date}")
    logger.info(f"运行时间: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 60)
    
    total_success = 0
    total_fail = 0
    
    try:
        # 根据参数决定运行哪些任务
        if args.daily:
            # 仅个股日线
            s, f = run_equity_daily()
            total_success += s
            total_fail += f
            
        elif args.concepts:
            # 仅日度数据
            s, f = run_daily_tasks()
            total_success += s
            total_fail += f
            
        elif args.meta:
            # 仅元数据
            s, f = run_meta_tasks()
            total_success += s
            total_fail += f
            
        elif args.hot:
            # 仅热门板块
            s, f = run_hot_concepts(trade_date, args.top_n)
            total_success += s
            total_fail += f
            
        else:
            # 全量模式（默认）
            logger.info("\n[模式] 全量抓取\n")
            
            # 1. 个股日线
            s, f = run_equity_daily()
            total_success += s
            total_fail += f
            
            # 2. 日度数据
            s, f = run_daily_tasks()
            total_success += s
            total_fail += f
            
            # 3. 元数据（不常变，可按需执行）
            s, f = run_meta_tasks()
            total_success += s
            total_fail += f
            
            # 4. 热门板块详细数据
            s, f = run_hot_concepts(trade_date, top_n=5)
            total_success += s
            total_fail += f
        
        # 统计
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        logger.info("=" * 60)
        logger.info("数据采集完成")
        logger.info(f"总成功: {total_success}, 总失败: {total_fail}")
        logger.info(f"耗时: {duration:.2f} 秒")
        logger.info("=" * 60)
        
        # 返回状态码
        return 0 if total_fail == 0 else 1
        
    except KeyboardInterrupt:
        logger.warning("\n用户中断")
        return 2
    except Exception as e:
        logger.error(f"\n程序异常: {e}", exc_info=True)
        return 3


if __name__ == "__main__":
    sys.exit(main())
