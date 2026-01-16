"""
数据清洗工具
"""
import math
import numpy as np
import pandas as pd


def clean_dataframe(df):
    """
    清理 DataFrame 中的 NaN/inf 值，使其可以安全序列化为 JSON
    
    Args:
        df: pandas DataFrame
        
    Returns:
        清理后的 DataFrame
    """
    # 替换 inf/-inf 为 NaN
    df = df.replace([np.inf, -np.inf], np.nan)
    
    # 统一处理所有 NaN
    df = df.fillna(value=np.nan)
    
    return df


def clean_record(obj):
    """
    递归清理字典/列表中的 NaN/inf 值
    
    Args:
        obj: 任意 Python 对象
        
    Returns:
        清理后的对象（NaN/inf 替换为 None）
    """
    if isinstance(obj, dict):
        return {k: clean_record(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_record(v) for v in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif pd.isna(obj):
        return None
    return obj
