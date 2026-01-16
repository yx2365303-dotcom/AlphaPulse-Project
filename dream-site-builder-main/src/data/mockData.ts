import { 
  LimitStock, 
  LimitStep, 
  TopListItem, 
  TopInstItem, 
  SectorItem, 
  MarketOverview 
} from "@/types/finance";

// 模拟涨停列表数据
export const mockLimitStocks: LimitStock[] = [
  {
    ts_code: "000001.SZ",
    trade_date: "2024-01-15",
    name: "平安银行",
    price: 12.56,
    pct_chg: 10.02,
    limit_type: 'U',
    lu_desc: "金融改革",
    status: "封板",
    first_time: "09:35:12",
    last_time: "14:58:00",
    open_times: 0,
    fd_amount: 125600,
    up_stat: "1/1"
  },
  {
    ts_code: "600519.SH",
    trade_date: "2024-01-15",
    name: "贵州茅台",
    price: 1680.00,
    pct_chg: 10.01,
    limit_type: 'U',
    lu_desc: "白酒龙头",
    status: "封板",
    first_time: "10:15:00",
    last_time: "14:55:00",
    open_times: 1,
    fd_amount: 986500,
    up_stat: "2/2"
  },
  {
    ts_code: "300750.SZ",
    trade_date: "2024-01-15",
    name: "宁德时代",
    price: 185.60,
    pct_chg: 20.00,
    limit_type: 'U',
    lu_desc: "新能源车",
    status: "封板",
    first_time: "09:30:05",
    last_time: "15:00:00",
    open_times: 0,
    fd_amount: 568000,
    up_stat: "5/5"
  },
  {
    ts_code: "002594.SZ",
    trade_date: "2024-01-15",
    name: "比亚迪",
    price: 268.50,
    pct_chg: 10.00,
    limit_type: 'U',
    lu_desc: "新能源汽车",
    status: "封板",
    first_time: "09:45:30",
    last_time: "14:30:00",
    open_times: 2,
    fd_amount: 325000,
    up_stat: "3/3"
  },
  {
    ts_code: "000858.SZ",
    trade_date: "2024-01-15",
    name: "五粮液",
    price: 158.80,
    pct_chg: 10.00,
    limit_type: 'U',
    lu_desc: "白酒概念",
    status: "炸板",
    first_time: "10:30:00",
    last_time: "13:45:00",
    open_times: 3,
    fd_amount: 45000,
    up_stat: "1/1"
  },
  {
    ts_code: "601318.SH",
    trade_date: "2024-01-15",
    name: "中国平安",
    price: 48.90,
    pct_chg: 10.01,
    limit_type: 'U',
    lu_desc: "保险龙头",
    status: "封板",
    first_time: "11:00:00",
    last_time: "15:00:00",
    open_times: 0,
    fd_amount: 258000,
    up_stat: "1/1"
  },
];

// 模拟连板天梯数据
export const mockLimitSteps: LimitStep[] = [
  { ts_code: "300750.SZ", trade_date: "2024-01-15", name: "宁德时代", nums: 7, up_stat: "7/7" },
  { ts_code: "002594.SZ", trade_date: "2024-01-15", name: "比亚迪", nums: 5, up_stat: "5/5" },
  { ts_code: "600519.SH", trade_date: "2024-01-15", name: "贵州茅台", nums: 4, up_stat: "4/4" },
  { ts_code: "000001.SZ", trade_date: "2024-01-15", name: "平安银行", nums: 3, up_stat: "3/3" },
  { ts_code: "601318.SH", trade_date: "2024-01-15", name: "中国平安", nums: 3, up_stat: "3/3" },
  { ts_code: "000858.SZ", trade_date: "2024-01-15", name: "五粮液", nums: 2, up_stat: "2/2" },
  { ts_code: "600036.SH", trade_date: "2024-01-15", name: "招商银行", nums: 2, up_stat: "2/2" },
  { ts_code: "002475.SZ", trade_date: "2024-01-15", name: "立讯精密", nums: 1, up_stat: "1/1" },
];

// 模拟龙虎榜数据
export const mockTopList: TopListItem[] = [
  {
    ts_code: "300750.SZ",
    trade_date: "2024-01-15",
    name: "宁德时代",
    close: 185.60,
    pct_chg: 20.00,
    net_amount: 25600,
    buy_amount: 35600,
    sell_amount: 10000,
    reason: "涨幅偏离值达7%"
  },
  {
    ts_code: "002594.SZ",
    trade_date: "2024-01-15",
    name: "比亚迪",
    close: 268.50,
    pct_chg: 10.00,
    net_amount: 18500,
    buy_amount: 28500,
    sell_amount: 10000,
    reason: "连续三个交易日涨幅偏离值累计达20%"
  },
  {
    ts_code: "600519.SH",
    trade_date: "2024-01-15",
    name: "贵州茅台",
    close: 1680.00,
    pct_chg: 10.01,
    net_amount: 12800,
    buy_amount: 22800,
    sell_amount: 10000,
    reason: "涨幅偏离值达7%"
  },
  {
    ts_code: "000858.SZ",
    trade_date: "2024-01-15",
    name: "五粮液",
    close: 158.80,
    pct_chg: 8.50,
    net_amount: -5600,
    buy_amount: 8600,
    sell_amount: 14200,
    reason: "换手率达20%"
  },
];

// 模拟机构席位数据
export const mockTopInst: TopInstItem[] = [
  {
    ts_code: "300750.SZ",
    trade_date: "2024-01-15",
    name: "宁德时代",
    exalter: "机构专用",
    buy_amount: 15600,
    sell_amount: 2000,
    net_buy: 13600,
    side: 'buy'
  },
  {
    ts_code: "300750.SZ",
    trade_date: "2024-01-15",
    name: "宁德时代",
    exalter: "深股通专用",
    buy_amount: 8500,
    sell_amount: 1500,
    net_buy: 7000,
    side: 'buy'
  },
  {
    ts_code: "002594.SZ",
    trade_date: "2024-01-15",
    name: "比亚迪",
    exalter: "华泰证券上海分公司",
    buy_amount: 12500,
    sell_amount: 0,
    net_buy: 12500,
    side: 'buy'
  },
  {
    ts_code: "600519.SH",
    trade_date: "2024-01-15",
    name: "贵州茅台",
    exalter: "中信证券总部",
    buy_amount: 9800,
    sell_amount: 0,
    net_buy: 9800,
    side: 'buy'
  },
];

// 模拟板块数据
export const mockSectors: SectorItem[] = [
  { ts_code: "BK0001", trade_date: "2024-01-15", name: "新能源汽车", up_stat: "25/30", rank: 1, pct_chg: 5.68 },
  { ts_code: "BK0002", trade_date: "2024-01-15", name: "锂电池", up_stat: "18/22", rank: 2, pct_chg: 4.85 },
  { ts_code: "BK0003", trade_date: "2024-01-15", name: "人工智能", up_stat: "15/35", rank: 3, pct_chg: 3.92 },
  { ts_code: "BK0004", trade_date: "2024-01-15", name: "白酒", up_stat: "12/18", rank: 4, pct_chg: 3.45 },
  { ts_code: "BK0005", trade_date: "2024-01-15", name: "光伏", up_stat: "10/25", rank: 5, pct_chg: 2.88 },
  { ts_code: "BK0006", trade_date: "2024-01-15", name: "芯片半导体", up_stat: "8/40", rank: 6, pct_chg: 2.15 },
  { ts_code: "BK0007", trade_date: "2024-01-15", name: "军工", up_stat: "6/28", rank: 7, pct_chg: 1.85 },
  { ts_code: "BK0008", trade_date: "2024-01-15", name: "医药生物", up_stat: "5/45", rank: 8, pct_chg: 1.25 },
];

// 模拟市场概览数据
export const mockMarketOverview: MarketOverview = {
  limitUpCount: 68,
  limitDownCount: 12,
  blastRate: 15.5,
  avgPctChg: 2.35,
  topHeight: 7,
  yesterdayCompare: 12
};
