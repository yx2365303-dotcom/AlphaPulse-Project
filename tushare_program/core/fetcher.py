"""
数据抓取核心逻辑
"""
import time
import pandas as pd

from utils import logger, clean_dataframe, clean_record
from .client import get_tushare_client, get_supabase_client


class DataFetcher:
    """数据抓取器"""
    
    def __init__(self):
        self.tushare = get_tushare_client().get_api()
        self.supabase = get_supabase_client().get_client()
        self.retry_count = 3
        self.retry_delay = 2
    
    def fetch_and_save(self, api_method_name, table_name, **kwargs):
        """
        通用抓取与写入函数
        
        Args:
            api_method_name: Tushare API 方法名
            table_name: Supabase 表名
            **kwargs: API 参数
            
        Returns:
            bool: 是否成功
        """
        logger.info(f"[{table_name}] 开始抓取 (API: {api_method_name})")
        logger.debug(f"  参数: {kwargs}")
        
        for attempt in range(self.retry_count):
            try:
                # 调用 Tushare API
                api_func = getattr(self.tushare, api_method_name)
                df = api_func(**kwargs)
                
                # 检查数据
                if df is None or df.empty:
                    logger.warning(f"  无数据 (尝试 {attempt + 1}/{self.retry_count})")
                    if attempt == self.retry_count - 1:
                        return False
                    time.sleep(self.retry_delay)
                    continue
                
                logger.info(f"  获取到 {len(df)} 条原始数据")
                
                # 数据清洗
                df = self._clean_data(df, api_method_name)
                
                # 转换为记录
                records = df.to_dict(orient="records")
                records = [clean_record(r) for r in records]
                
                # 写入数据库
                self.supabase.table(table_name).upsert(records).execute()
                logger.info(f"  [成功] 写入 {len(records)} 条到 {table_name}")
                return True
                
            except Exception as e:
                error_msg = str(e)
                logger.error(f"  错误: {error_msg}")
                
                # 字段不匹配错误不需要重试
                if 'Could not find' in error_msg or 'PGRST204' in error_msg:
                    logger.error(f"  数据库表 {table_name} 字段不匹配")
                    if df is not None and not df.empty:
                        logger.debug(f"  API返回字段: {list(df.columns)}")
                    return False
                
                # 唯一约束冲突
                if '21000' in error_msg or 'ON CONFLICT' in error_msg:
                    logger.error(f"  数据库唯一约束冲突，请检查主键设置")
                    return False
                
                # 其他错误重试
                if attempt < self.retry_count - 1:
                    logger.info(f"  等待 {self.retry_delay} 秒后重试...")
                    time.sleep(self.retry_delay)
                else:
                    logger.error(f"  跳过此任务")
                    return False
        
        return False
    
    def save_to_supabase(self, df, table_name):
        """
        直接保存DataFrame到Supabase（用于已处理的数据）
        
        Args:
            df: pandas DataFrame
            table_name: Supabase 表名
            
        Returns:
            bool: 是否成功
        """
        try:
            if df is None or df.empty:
                logger.warning(f"  [{table_name}] 无数据可保存")
                return False
            
            # 数据清洗
            df = clean_dataframe(df)
            
            # 转换为记录
            records = df.to_dict(orient="records")
            records = [clean_record(r) for r in records]
            
            # 写入数据库
            self.supabase.table(table_name).upsert(records).execute()
            logger.info(f"  [成功] 写入 {len(records)} 条到 {table_name}")
            return True
            
        except Exception as e:
            logger.error(f"  保存失败: {e}")
            return False
    
    def _clean_data(self, df, api_method_name):
        """数据清洗"""
        # 1. 处理日期格式
        if 'trade_date' in df.columns:
            df['trade_date'] = pd.to_datetime(df['trade_date']).dt.date.astype(str)
        
        # 2. 特殊字段重命名（SQL 关键字冲突）
        if api_method_name == 'limit_list_d' and 'limit' in df.columns:
            df.rename(columns={'limit': 'limit_flag'}, inplace=True)
        
        # 3. 类型转换：将 float 型的整数列转为 int（避免 "3.0" 问题）
        for col in df.columns:
            if df[col].dtype == 'float64':
                # 检查是否所有非空值都是整数
                non_null = df[col].dropna()
                if len(non_null) > 0 and (non_null == non_null.astype(int)).all():
                    df[col] = df[col].astype('Int64')  # 使用 nullable integer
        
        # 4. 清理 NaN/inf
        df = clean_dataframe(df)
        
        return df
