// AlphaPulse 金融数据类型定义

/**
 * 涨停列表 - limit_list_ths
 */
export interface LimitStock {
  id?: string;
  trade_date: string;
  ts_code: string;
  name: string;
  price: number;
  pct_chg: number;
  limit_type: 'U' | 'D'; // U=涨停, D=跌停
  lu_desc: string; // 涨停原因
  status: string;
  first_time: string;
  last_time: string;
  open_times: number;
  fd_amount: number; // 封单额（万）
  up_stat: string;
}

/**
 * 连板天梯 - limit_step
 */
export interface LimitStep {
  id?: string;
  trade_date: string;
  ts_code: string;
  name: string;
  nums: number; // 连板数
  up_stat: string;
}

/**
 * 龙虎榜明细 - top_list
 */
export interface TopListItem {
  id?: string;
  trade_date: string;
  ts_code: string;
  name: string;
  close: number;
  pct_chg: number;
  net_amount: number; // 净买入额（万）
  buy_amount: number;
  sell_amount: number;
  reason: string;
}

/**
 * 龙虎榜机构明细 - top_inst
 */
export interface TopInstItem {
  id?: string;
  trade_date: string;
  ts_code: string;
  name?: string;
  exalter: string; // 席位名称
  buy?: number;
  buy_amount?: number;
  buy_rate?: number;
  sell?: number;
  sell_amount?: number;
  sell_rate?: number;
  net_buy: number;
  side?: 'buy' | 'sell';
  reason?: string;
}

/**
 * 板块概念 - limit_cpt_list
 */
export interface SectorItem {
  id?: string;
  name: string;
  ts_code: string;
  trade_date: string;
  z_num?: number; // 涨停家数
  z_amount?: number; // 总成交额
  pct_chg?: number; // 涨跌幅
}
  trade_date: string;
  ts_code: string;
  name: string;
  up_stat: string; // 涨停家数统计
  rank: number;
  pct_chg: number;
}

/**
 * 概念题材 - kpl_concept
 */
export interface ConceptItem {
  id?: string;
  trade_date: string;
  concept_name: string;
  pct_chg: number;
  stock_count: number;
  up_count: number;
  down_count: number;
}

/**
 * 市场情绪概览
 */
export interface MarketOverview {
  trade_date: string;
  limit_up_count: number; // 涨停家数
  limit_down_count: number; // 跌停家数
  top_list_count: number; // 龙虎榜家数
  total_amount: number; // 总成交额
  limitUpCount?: number; // 兼容旧字段
  limitDownCount?: number;
  blastRate?: number; // 炸板率
  avgPctChg?: number;
  topHeight?: number; // 最高连板
  yesterdayCompare?: number; // 较昨日涨跌停数变化
}

/**
 * AI 分析接口
 */
export interface AIAnalysisRequest {
  query: string;
  context?: {
    ts_code?: string;
    sector?: string;
    date?: string;
  };
}

export interface AIAnalysisResponse {
  analysis: string;
  suggestions?: string[];
  relatedStocks?: string[];
}

/**
 * AI 分析服务接口（预留）
 */
export interface AIAnalysisService {
  analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse>;
}
