import { TrendingUp, TrendingDown, Zap, Target, BarChart3 } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { StockTable, StockCodeCell, PctChangeCell, AmountCell, StatusBadge } from "@/components/common/StockTable";
import { LadderChart } from "@/components/charts/LadderChart";
import { LimitStock, LimitStep, MarketOverview } from "@/types/finance";

interface MarketMoodTabProps {
  overview?: MarketOverview;
  limitStocks: LimitStock[];
  limitSteps: LimitStep[];
}

export function MarketMoodTab({ overview, limitStocks, limitSteps }: MarketMoodTabProps) {
  const columns = [
    {
      key: "name",
      header: "股票",
      render: (_: any, row: LimitStock) => (
        <StockCodeCell code={row.ts_code} name={row.name} />
      ),
    },
    {
      key: "price",
      header: "现价",
      className: "text-right font-mono",
      render: (value: number) => value.toFixed(2),
    },
    {
      key: "pct_chg",
      header: "涨幅",
      className: "text-right",
      render: (value: number) => <PctChangeCell value={value} />,
    },
    {
      key: "lu_desc",
      header: "涨停原因",
      className: "max-w-[200px] truncate",
    },
    {
      key: "first_time",
      header: "首封时间",
      className: "font-mono text-muted-foreground",
    },
    {
      key: "open_times",
      header: "开板次数",
      className: "text-center",
    },
    {
      key: "fd_amount",
      header: "封单额",
      className: "text-right",
      render: (value: number) => <AmountCell value={value} />,
    },
    {
      key: "status",
      header: "状态",
      className: "text-center",
      render: (value: string) => <StatusBadge status={value} />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 市场概览指标 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="涨停家数"
          value={overview?.limit_up_count || overview?.limitUpCount || 0}
          icon={TrendingUp}
          trend={overview?.yesterdayCompare}
          trendLabel="家"
          valueClassName="stock-up"
        />
        <MetricCard
          label="跌停家数"
          value={overview?.limit_down_count || overview?.limitDownCount || 0}
          icon={TrendingDown}
          valueClassName="stock-down"
        />
        <MetricCard
          label="炸板率"
          value={`${overview?.blastRate || 0}%`}
          icon={Zap}
        />
        <MetricCard
          label="最高连板"
          value={`${overview?.topHeight || 0}板`}
          icon={Target}
          valueClassName="text-primary"
        />
        <MetricCard
          label="平均涨幅"
          value={`${overview?.avgPctChg || 0}%`}
          icon={BarChart3}
        />
        <MetricCard
          label="封板成功率"
          value={`${overview?.blastRate ? (100 - overview.blastRate).toFixed(1) : 0}%`}
          valueClassName="text-success"
        />
      </div>

      {/* 连板天梯 */}
      <div className="finance-card">
        <h3 className="mb-4 text-lg font-semibold text-foreground">连板梯队</h3>
        <LadderChart data={limitSteps} />
      </div>

      {/* 涨停明细表 */}
      <div className="finance-card">
        <h3 className="mb-4 text-lg font-semibold text-foreground">涨停明细</h3>
        <StockTable data={limitStocks} columns={columns} />
      </div>
    </div>
  );
}
