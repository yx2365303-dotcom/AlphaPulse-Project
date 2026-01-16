import { Building2, Users, TrendingUp } from "lucide-react";
import { StockTable, StockCodeCell, PctChangeCell, AmountCell } from "@/components/common/StockTable";
import { Badge } from "@/components/ui/badge";
import { TopListItem, TopInstItem } from "@/types/finance";
import { cn } from "@/lib/utils";

interface TopListTabProps {
  topList: TopListItem[];
  topInst: TopInstItem[];
}

// 知名游资席位列表
const famousSeats = [
  "华泰证券",
  "中信证券",
  "国泰君安",
  "东方财富",
  "深股通",
  "机构专用"
];

function isFamousSeat(exalter: string): boolean {
  return famousSeats.some(seat => exalter.includes(seat));
}

export function TopListTab({ topList, topInst }: TopListTabProps) {
  const topListColumns = [
    {
      key: "name",
      header: "股票",
      render: (_: any, row: TopListItem) => (
        <StockCodeCell code={row.ts_code} name={row.name} />
      ),
    },
    {
      key: "close",
      header: "收盘价",
      className: "text-right font-mono",
      render: (value: number) => value.toFixed(2),
    },
    {
      key: "pct_chg",
      header: "涨跌幅",
      className: "text-right",
      render: (value: number) => <PctChangeCell value={value} />,
    },
    {
      key: "net_amount",
      header: "净买入",
      className: "text-right",
      render: (value: number) => <AmountCell value={value} />,
    },
    {
      key: "buy_amount",
      header: "买入额",
      className: "text-right font-mono text-muted-foreground",
      render: (value: number) => `${value.toFixed(0)}万`,
    },
    {
      key: "sell_amount",
      header: "卖出额",
      className: "text-right font-mono text-muted-foreground",
      render: (value: number) => `${value.toFixed(0)}万`,
    },
    {
      key: "reason",
      header: "上榜原因",
      className: "max-w-[250px] text-muted-foreground",
    },
  ];

  const instColumns = [
    {
      key: "name",
      header: "股票",
      render: (_: any, row: TopInstItem) => (
        <StockCodeCell code={row.ts_code} name={row.name} />
      ),
    },
    {
      key: "exalter",
      header: "席位名称",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <span className={cn(isFamousSeat(value) && "text-primary font-medium")}>
            {value}
          </span>
          {isFamousSeat(value) && (
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              知名
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "buy_amount",
      header: "买入额",
      className: "text-right",
      render: (value: number) => <AmountCell value={value} />,
    },
    {
      key: "sell_amount",
      header: "卖出额",
      className: "text-right font-mono text-muted-foreground",
      render: (value: number) => `${value.toFixed(0)}万`,
    },
    {
      key: "net_buy",
      header: "净买入",
      className: "text-right",
      render: (value: number) => <AmountCell value={value} />,
    },
    {
      key: "side",
      header: "方向",
      className: "text-center",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={cn(
            value === "buy" 
              ? "border-stock-up/30 text-stock-up bg-stock-up/10" 
              : "border-stock-down/30 text-stock-down bg-stock-down/10"
          )}
        >
          {value === "buy" ? "买入" : "卖出"}
        </Badge>
      ),
    },
  ];

  // 筛选机构净买入的股票
  const instNetBuy = topInst.filter(item => item.net_buy > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="finance-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">上榜个股</div>
            <div className="text-2xl font-bold">{topList.length}</div>
          </div>
        </div>
        <div className="finance-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
            <Building2 className="h-6 w-6 text-accent" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">机构净买入</div>
            <div className="text-2xl font-bold">{instNetBuy.length}</div>
          </div>
        </div>
        <div className="finance-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
            <Users className="h-6 w-6 text-warning" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">知名游资出没</div>
            <div className="text-2xl font-bold">
              {topInst.filter(item => isFamousSeat(item.exalter)).length}
            </div>
          </div>
        </div>
      </div>

      {/* 龙虎榜明细 */}
      <div className="finance-card">
        <h3 className="mb-4 text-lg font-semibold text-foreground">龙虎榜明细</h3>
        <StockTable data={topList} columns={topListColumns} />
      </div>

      {/* 机构席位明细 */}
      <div className="finance-card">
        <h3 className="mb-4 text-lg font-semibold text-foreground">机构/游资席位</h3>
        <StockTable data={topInst} columns={instColumns} />
      </div>
    </div>
  );
}
