import { LimitStep } from "@/types/finance";
import { cn } from "@/lib/utils";

interface LadderChartProps {
  data: LimitStep[];
  className?: string;
}

export function LadderChart({ data, className }: LadderChartProps) {
  // 按连板数分组
  const grouped = data.reduce((acc, item) => {
    const nums = item.nums;
    if (!acc[nums]) {
      acc[nums] = [];
    }
    acc[nums].push(item);
    return acc;
  }, {} as Record<number, LimitStep[]>);

  // 获取所有连板层级并排序（从高到低）
  const levels = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  // 颜色梯度：连板越高颜色越亮
  const getBarColor = (level: number, maxLevel: number) => {
    const intensity = level / maxLevel;
    if (intensity >= 0.8) return "bg-primary";
    if (intensity >= 0.6) return "bg-primary/80";
    if (intensity >= 0.4) return "bg-accent/70";
    if (intensity >= 0.2) return "bg-accent/50";
    return "bg-secondary";
  };

  const maxLevel = Math.max(...levels, 1);

  return (
    <div className={cn("space-y-3", className)}>
      {levels.map((level) => {
        const stocks = grouped[level];
        return (
          <div key={level} className="flex items-center gap-4">
            {/* 连板数标签 */}
            <div className="flex h-8 w-12 items-center justify-center rounded-md bg-secondary text-sm font-semibold">
              {level}板
            </div>
            
            {/* 股票列表 */}
            <div className="flex flex-1 flex-wrap gap-2">
              {stocks.map((stock) => (
                <div
                  key={stock.ts_code}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-all hover:scale-105",
                    getBarColor(level, maxLevel)
                  )}
                >
                  <span className="font-medium">{stock.name}</span>
                  <span className="text-xs opacity-70">({stock.up_stat})</span>
                </div>
              ))}
            </div>

            {/* 数量 */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/50 text-xs font-medium text-muted-foreground">
              {stocks.length}
            </div>
          </div>
        );
      })}

      {levels.length === 0 && (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          暂无连板数据
        </div>
      )}
    </div>
  );
}
