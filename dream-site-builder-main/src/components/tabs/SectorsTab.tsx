import { Flame, BarChart3, TrendingUp } from "lucide-react";
import { SectorHeatmap } from "@/components/charts/SectorHeatmap";
import { StockTable, PctChangeCell } from "@/components/common/StockTable";
import { SectorItem } from "@/types/finance";
import { Badge } from "@/components/ui/badge";

interface SectorsTabProps {
  sectors: SectorItem[];
}

export function SectorsTab({ sectors }: SectorsTabProps) {
  // 取前3名热门板块
  const topSectors = sectors.slice(0, 3);
  
  const columns = [
    {
      key: "rank",
      header: "排名",
      className: "w-16 text-center",
      render: (value: number) => (
        <Badge
          variant="outline"
          className={`
            ${value <= 3 ? "bg-primary/20 text-primary border-primary/30" : ""}
          `}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "name",
      header: "板块名称",
      className: "font-medium",
    },
    {
      key: "pct_chg",
      header: "涨跌幅",
      className: "text-right",
      render: (value: number) => <PctChangeCell value={value} />,
    },
    {
      key: "up_stat",
      header: "涨停家数",
      className: "text-center",
      render: (value: string) => (
        <span className="text-primary font-medium">{value}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 今日最强板块 */}
      <div className="finance-card">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-semibold text-foreground">今日最强板块</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topSectors.map((sector, index) => (
            <div
              key={sector.ts_code}
              className="relative rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-5"
            >
              {/* 排名 */}
              <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>
              
              <div className="pt-2">
                <div className="text-xl font-bold text-foreground mb-2">
                  {sector.name}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-stock-up" />
                    <span className="stock-up font-mono font-bold text-lg">
                      +{sector.pct_chg.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    涨停 <span className="text-primary font-medium">{sector.up_stat}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 板块热力图 */}
      <div className="finance-card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">板块热力图</h3>
        </div>
        <SectorHeatmap data={sectors} />
      </div>

      {/* 板块排行榜 */}
      <div className="finance-card">
        <h3 className="mb-4 text-lg font-semibold text-foreground">板块排行榜</h3>
        <StockTable data={sectors} columns={columns} />
      </div>
    </div>
  );
}
