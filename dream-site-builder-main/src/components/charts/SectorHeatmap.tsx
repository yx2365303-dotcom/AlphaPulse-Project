import { SectorItem } from "@/types/finance";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SectorHeatmapProps {
  data: SectorItem[];
  className?: string;
}

export function SectorHeatmap({ data, className }: SectorHeatmapProps) {
  // 根据涨跌幅获取背景色
  const getHeatColor = (pctChg: number) => {
    if (pctChg >= 5) return "bg-stock-up/30 border-stock-up/50";
    if (pctChg >= 3) return "bg-stock-up/20 border-stock-up/30";
    if (pctChg >= 1) return "bg-stock-up/10 border-stock-up/20";
    if (pctChg >= 0) return "bg-secondary border-border";
    if (pctChg >= -1) return "bg-stock-down/10 border-stock-down/20";
    if (pctChg >= -3) return "bg-stock-down/20 border-stock-down/30";
    return "bg-stock-down/30 border-stock-down/50";
  };

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", className)}>
      {data.map((sector, index) => (
        <div
          key={sector.ts_code}
          className={cn(
            "relative rounded-lg border p-4 transition-all hover:scale-[1.02] cursor-pointer",
            getHeatColor(sector.pct_chg)
          )}
        >
          {/* 排名徽章 */}
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {sector.rank}
          </div>

          {/* 板块名称 */}
          <div className="mb-2 font-semibold text-foreground">{sector.name}</div>

          {/* 涨跌幅 */}
          <div className="flex items-center gap-1.5 mb-2">
            {sector.pct_chg >= 0 ? (
              <TrendingUp className="h-4 w-4 text-stock-up" />
            ) : (
              <TrendingDown className="h-4 w-4 text-stock-down" />
            )}
            <span
              className={cn(
                "text-lg font-bold font-mono",
                sector.pct_chg >= 0 ? "stock-up" : "stock-down"
              )}
            >
              {sector.pct_chg >= 0 && "+"}
              {sector.pct_chg.toFixed(2)}%
            </span>
          </div>

          {/* 涨停统计 */}
          <div className="text-sm text-muted-foreground">
            涨停：<span className="font-medium text-primary">{sector.up_stat}</span>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="col-span-full flex h-32 items-center justify-center text-muted-foreground">
          暂无板块数据
        </div>
      )}
    </div>
  );
}
