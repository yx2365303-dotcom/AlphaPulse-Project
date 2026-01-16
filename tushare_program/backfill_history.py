"""
历史数据回填脚本
用途: 一次性获取近一年的历史数据
时间范围: 2025-01-16 至 2026-01-16
"""
import sys
sys.path.insert(0, '.')

import time
from datetime import datetime, timedelta
from utils.network import patch_ssl_and_timeout
from utils.logger import logger
from core import get_tushare_client, DataFetcher
from tasks.daily_tasks import run_daily_tasks
from tasks.meta_tasks import run_hot_concepts

# 应用网络补丁
patch_ssl_and_timeout()


def get_trade_dates(start_date, end_date):
    """
    获取指定日期范围内的所有交易日
    
    Args:
        start_date: 开始日期 YYYYMMDD
        end_date: 结束日期 YYYYMMDD
        
    Returns:
        交易日列表（倒序，从最新到最旧）
    """
    logger.info(f"正在获取交易日历: {start_date} 至 {end_date}")
    
    client = get_tushare_client()
    api = client.get_api()
    
    # 获取交易日历
    df = api.trade_cal(exchange='SSE', start_date=start_date, end_date=end_date, is_open='1')
    
    if df is None or df.empty:
        logger.error("获取交易日历失败")
        return []
    
    trade_dates = df['cal_date'].tolist()
    trade_dates.reverse()  # 倒序，从最新到最旧
    
    logger.info(f"共获取到 {len(trade_dates)} 个交易日")
    return trade_dates


def backfill_one_day(trade_date, include_hot=False):
    """
    回填单个交易日的数据
    
    Args:
        trade_date: 交易日期 YYYYMMDD
        include_hot: 是否包含热门板块数据（耗时较长）
        
    Returns:
        (success_count, fail_count)
    """
    logger.info(f"\n{'='*60}")
    logger.info(f"开始回填: {trade_date}")
    logger.info(f"{'='*60}")
    
    total_success = 0
    total_fail = 0
    
    try:
        # 1. 日度数据（涨跌停、龙虎榜等）
        success, fail = run_daily_tasks(trade_date)
        total_success += success
        total_fail += fail
        
        # 2. 热门板块数据（可选，因为耗时较长）
        if include_hot:
            success, fail = run_hot_concepts(trade_date, top_n=3)  # 只取前3个板块
            total_success += success
            total_fail += fail
        
        logger.info(f"[{trade_date}] 完成 - 成功: {total_success}, 失败: {total_fail}")
        
        return total_success, total_fail
        
    except Exception as e:
        logger.error(f"[{trade_date}] 回填失败: {e}")
        return total_success, total_fail


def main():
    """主函数"""
    print("\n" + "="*70)
    print("历史数据回填工具")
    print("="*70)
    
    # 计算日期范围（近一年）
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    
    start_date_str = start_date.strftime('%Y%m%d')
    end_date_str = end_date.strftime('%Y%m%d')
    
    print(f"\n📅 时间范围: {start_date_str} 至 {end_date_str}")
    
    # 自动设置为不包含热门板块（速度快）
    include_hot = False
    print(f"\n⚙️  热门板块数据: {'包含' if include_hot else '不包含'} (可在脚本中修改 include_hot 变量)")
    
    # 获取交易日列表
    print("\n正在获取交易日历...")
    trade_dates = get_trade_dates(start_date_str, end_date_str)
    
    if not trade_dates:
        print("❌ 无法获取交易日历，退出")
        return
    
    print(f"\n📊 共需回填 {len(trade_dates)} 个交易日")
    print(f"⏱️  预计耗时: {len(trade_dates) * 10 / 60:.0f} 分钟")
    
    # 等待5秒后自动开始
    print("\n⏳ 5秒后自动开始回填...")
    for i in range(5, 0, -1):
        print(f"   {i}...", end='', flush=True)
        time.sleep(1)
    print(" 开始！\n")
    
    # 开始回填
    print("\n" + "="*70)
    print("开始回填历史数据...")
    print("="*70)
    
    start_time = time.time()
    total_success = 0
    total_fail = 0
    completed = 0
    
    for i, trade_date in enumerate(trade_dates, 1):
        print(f"\n进度: [{i}/{len(trade_dates)}] {trade_date}")
        
        success, fail = backfill_one_day(trade_date, include_hot)
        total_success += success
        total_fail += fail
        completed += 1
        
        # 每10个交易日输出一次汇总
        if i % 10 == 0:
            elapsed = time.time() - start_time
            avg_time = elapsed / completed
            remaining = (len(trade_dates) - completed) * avg_time
            
            print("\n" + "-"*60)
            print(f"📊 已完成: {completed}/{len(trade_dates)}")
            print(f"✅ 总成功: {total_success}")
            print(f"❌ 总失败: {total_fail}")
            print(f"⏱️  已耗时: {elapsed/60:.1f} 分钟")
            print(f"⏳ 预计剩余: {remaining/60:.1f} 分钟")
            print("-"*60)
        
        # API限流：每个交易日之间暂停1秒
        time.sleep(1)
    
    # 最终汇总
    total_time = time.time() - start_time
    
    print("\n" + "="*70)
    print("回填完成！")
    print("="*70)
    print(f"📊 总交易日: {len(trade_dates)}")
    print(f"✅ 总成功: {total_success}")
    print(f"❌ 总失败: {total_fail}")
    print(f"⏱️  总耗时: {total_time/60:.1f} 分钟")
    print(f"⚡ 平均速度: {total_time/len(trade_dates):.1f} 秒/交易日")
    print("="*70)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  用户中断，已停止回填")
    except Exception as e:
        print(f"\n\n❌ 发生错误: {e}")
        import traceback
        traceback.print_exc()
