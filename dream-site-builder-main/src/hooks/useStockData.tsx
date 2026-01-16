/**
 * React Query hooks for stock data fetching
 * 使用 TanStack Query 管理数据缓存和自动刷新
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  fetchLimitStocks,
  fetchLimitSteps,
  fetchTopList,
  fetchTopInst,
  fetchSectors,
  fetchKplList,
  fetchAvailableDates,
  fetchMarketOverview,
} from '@/services/dataService';
import type {
  LimitStock,
  LimitStep,
  TopListItem,
  TopInstItem,
  SectorItem,
} from '@/types/finance';

/**
 * 获取涨停股票列表
 */
export function useLimitStocks(tradeDate?: string, limit: number = 100) {
  return useQuery({
    queryKey: ['limitStocks', tradeDate, limit],
    queryFn: () => fetchLimitStocks(tradeDate, limit),
    staleTime: 5 * 60 * 1000, // 5分钟内数据认为是新鲜的
    refetchInterval: 10 * 60 * 1000, // 每10分钟自动刷新
  });
}

/**
 * 获取连板天梯
 */
export function useLimitSteps(tradeDate?: string) {
  return useQuery({
    queryKey: ['limitSteps', tradeDate],
    queryFn: () => fetchLimitSteps(tradeDate),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

/**
 * 获取龙虎榜明细
 */
export function useTopList(tradeDate?: string, limit: number = 50) {
  return useQuery({
    queryKey: ['topList', tradeDate, limit],
    queryFn: () => fetchTopList(tradeDate, limit),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

/**
 * 获取机构席位明细
 */
export function useTopInst(tradeDate?: string, limit: number = 50) {
  return useQuery({
    queryKey: ['topInst', tradeDate, limit],
    queryFn: () => fetchTopInst(tradeDate, limit),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

/**
 * 获取板块数据
 */
export function useSectors(tradeDate?: string) {
  return useQuery({
    queryKey: ['sectors', tradeDate],
    queryFn: () => fetchSectors(tradeDate),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

/**
 * 获取开盘啦数据
 */
export function useKplList(tradeDate?: string, limit: number = 50) {
  return useQuery({
    queryKey: ['kplList', tradeDate, limit],
    queryFn: () => fetchKplList(tradeDate, limit),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

/**
 * 获取可用交易日期
 */
export function useAvailableDates(limit: number = 30) {
  return useQuery({
    queryKey: ['availableDates', limit],
    queryFn: () => fetchAvailableDates(limit),
    staleTime: 30 * 60 * 1000, // 30分钟
    refetchInterval: 60 * 60 * 1000, // 每小时刷新
  });
}

/**
 * 获取市场概览
 */
export function useMarketOverview(tradeDate?: string) {
  return useQuery({
    queryKey: ['marketOverview', tradeDate],
    queryFn: () => fetchMarketOverview(tradeDate),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

/**
 * 综合数据hook - 一次性获取多个数据
 */
export function useStockDataBundle(tradeDate?: string) {
  const limitStocks = useLimitStocks(tradeDate, 100);
  const limitSteps = useLimitSteps(tradeDate);
  const topList = useTopList(tradeDate, 50);
  const sectors = useSectors(tradeDate);
  const marketOverview = useMarketOverview(tradeDate);

  return {
    limitStocks,
    limitSteps,
    topList,
    sectors,
    marketOverview,
    isLoading:
      limitStocks.isLoading ||
      limitSteps.isLoading ||
      topList.isLoading ||
      sectors.isLoading ||
      marketOverview.isLoading,
    isError:
      limitStocks.isError ||
      limitSteps.isError ||
      topList.isError ||
      sectors.isError ||
      marketOverview.isError,
  };
}
