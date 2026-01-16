/**
 * Supabase 数据服务层
 * 用于从数据库获取股票数据
 */

// @ts-nocheck - Supabase 类型未完全定义所有表，运行时正常
import { supabase } from '@/integrations/supabase/client';
import { 
  LimitStock, 
  LimitStep, 
  TopListItem, 
  TopInstItem, 
  SectorItem 
} from '@/types/finance';

/**
 * 获取涨停股票列表
 */
export async function fetchLimitStocks(tradeDate?: string, limit: number = 100) {
  let query = supabase
    .from('limit_list_ths')
    .select('*')
    .order('trade_date', { ascending: false })
    .limit(limit);

  if (tradeDate) {
    query = query.eq('trade_date', tradeDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取涨停列表失败:', error);
    throw error;
  }

  // 数据映射
  return (data || []).map((item: any): LimitStock => ({
    id: item.id,
    trade_date: item.trade_date,
    ts_code: item.ts_code,
    name: item.name || '',
    price: item.price || 0,
    pct_chg: item.pct_chg || 0,
    limit_type: item.limit_type || 'U',
    lu_desc: item.lu_desc || '',
    status: item.status || '封板',
    first_time: item.first_lu_time || '',
    last_time: item.last_lu_time || '',
    open_times: item.open_num || 0,
    fd_amount: item.limit_amount || 0,
    up_stat: item.tag || ''
  }));
}

/**
 * 获取连板天梯数据
 */
export async function fetchLimitSteps(tradeDate?: string) {
  let query = supabase
    .from('limit_step')
    .select('*')
    .order('nums', { ascending: false });

  if (tradeDate) {
    query = query.eq('trade_date', tradeDate);
  } else {
    // 获取最新交易日
    query = query.limit(50);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取连板天梯失败:', error);
    throw error;
  }

  return (data || []).map((item: any): LimitStep => ({
    id: item.id,
    trade_date: item.trade_date,
    ts_code: item.ts_code,
    name: item.name || '',
    nums: item.nums || 0,
    up_stat: '' // limit_step 表没有 up_stat 字段
  }));
}

/**
 * 获取龙虎榜明细
 */
export async function fetchTopList(tradeDate?: string, limit: number = 50) {
  let query = supabase
    .from('top_list')
    .select('*')
    .order('net_amount', { ascending: false })
    .limit(limit);

  if (tradeDate) {
    query = query.eq('trade_date', tradeDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取龙虎榜失败:', error);
    throw error;
  }

  return (data || []).map((item: any): TopListItem => ({
    id: item.id,
    trade_date: item.trade_date,
    ts_code: item.ts_code,
    name: item.name || '',
    close: item.close || 0,
    pct_chg: item.pct_chg || 0,
    net_amount: item.net_amount || 0,
    buy_amount: item.l_buy || 0,
    sell_amount: item.l_sell || 0,
    reason: item.reason || ''
  }));
}

/**
 * 获取机构席位明细
 */
export async function fetchTopInst(tradeDate?: string, limit: number = 50) {
  let query = supabase
    .from('top_inst')
    .select('*')
    .order('net_buy', { ascending: false })
    .limit(limit);

  if (tradeDate) {
    query = query.eq('trade_date', tradeDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取机构席位失败:', error);
    throw error;
  }

  return (data || []).map((item: any): TopInstItem => ({
    id: item.id,
    trade_date: item.trade_date,
    ts_code: item.ts_code,
    exalter: item.exalter || '',
    buy: item.buy || 0,
    buy_rate: item.buy_rate || 0,
    sell: item.sell || 0,
    sell_rate: item.sell_rate || 0,
    net_buy: item.net_buy || 0,
    reason: item.reason || ''
  }));
}

/**
 * 获取板块数据（涨停板块）
 */
export async function fetchSectors(tradeDate?: string) {
  let query = supabase
    .from('limit_cpt_list')
    .select('*')
    .order('up_nums', { ascending: false })
    .limit(20);

  if (tradeDate) {
    query = query.eq('trade_date', tradeDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取板块数据失败:', error);
    throw error;
  }

  return (data || []).map((item: any): SectorItem => ({
    id: item.id,
    name: item.name || '',
    ts_code: item.ts_code,
    trade_date: item.trade_date,
    z_num: item.up_nums || 0,
    z_amount: item.cons_nums || 0,
    pct_chg: item.pct_chg || 0
  }));
}

/**
 * 获取开盘啦数据（科创板涨停）
 */
export async function fetchKplList(tradeDate?: string, limit: number = 50) {
  let query = supabase
    .from('kpl_list')
    .select('*')
    .order('pct_chg', { ascending: false })
    .limit(limit);

  if (tradeDate) {
    query = query.eq('trade_date', tradeDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取开盘啦数据失败:', error);
    throw error;
  }

  return data || [];
}

/**
 * 获取可用的交易日期列表
 */
export async function fetchAvailableDates(limit: number = 30) {
  const { data, error } = await supabase
    .from('limit_list_d')
    .select('trade_date')
    .order('trade_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('获取交易日期失败:', error);
    throw error;
  }

  // 去重
  const uniqueDates = [...new Set(data?.map(item => item.trade_date) || [])];
  return uniqueDates;
}

/**
 * 获取市场概览统计
 */
export async function fetchMarketOverview(tradeDate?: string) {
  try {
    // 并行获取多个数据源 - 统计涨停、跌停和龙虎榜数量
    const [limitUpResult, limitDownResult, topListResult, amountSum] = await Promise.all([
      // 统计涨停数量 (limit_flag = 'U')
      supabase
        .from('limit_list_d')
        .select('ts_code', { count: 'exact', head: false })
        .eq('trade_date', tradeDate || '')
        .eq('limit_flag', 'U'),
      // 统计跌停数量 (limit_flag = 'D')
      supabase
        .from('limit_list_d')
        .select('ts_code', { count: 'exact', head: false })
        .eq('trade_date', tradeDate || '')
        .eq('limit_flag', 'D'),
      // 统计龙虎榜数量
      supabase
        .from('top_list')
        .select('ts_code', { count: 'exact', head: false })
        .eq('trade_date', tradeDate || ''),
      // 获取总成交额
      supabase
        .from('limit_list_d')
        .select('amount')
        .eq('trade_date', tradeDate || '')
        .limit(100)
    ]);

    // 计算总成交额
    const totalAmount = amountSum.data?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

    return {
      trade_date: tradeDate || '',
      limit_up_count: limitUpResult.count || 0,
      limit_down_count: limitDownResult.count || 0,
      top_list_count: topListResult.count || 0,
      total_amount: totalAmount
    };
  } catch (error) {
    console.error('获取市场概览失败:', error);
    return {
      trade_date: tradeDate || '',
      limit_up_count: 0,
      limit_down_count: 0,
      top_list_count: 0,
      total_amount: 0
    };
  }
}

/**
 * 验证用户是否存在
 */
export async function verifyUserExists(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('验证用户失败:', error);
    return false;
  }

  return !!data;
}

/**
 * 获取用户信息
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }

  return data;
}

/**
 * 更新用户信息
 */
export async function updateUserProfile(userId: string, updates: {
  username?: string;
  full_name?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }

  return data;
}

/**
 * 记录用户活动日志
 */
export async function logUserActivity(
  userId: string,
  action: string,
  description?: string
) {
  const { error } = await supabase
    .from('user_activity_logs')
    .insert({
      user_id: userId,
      action,
      description,
      ip_address: null, // 可以从请求中获取
      user_agent: navigator.userAgent
    });

  if (error) {
    console.error('记录用户活动失败:', error);
  }
}
