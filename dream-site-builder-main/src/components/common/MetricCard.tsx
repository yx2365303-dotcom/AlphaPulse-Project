import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className,
  valueClassName,
}: MetricCardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <div className={cn("metric-card", className)}>
      <div className="flex items-center justify-between">
        <span className="metric-label">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="flex items-end justify-between">
        <span className={cn("metric-value", valueClassName)}>{value}</span>
        {trend !== undefined && (
          <span
            className={cn(
              "text-sm font-medium",
              isPositive && "stock-up",
              isNegative && "stock-down",
              !isPositive && !isNegative && "stock-flat"
            )}
          >
            {isPositive && "+"}
            {trend}
            {trendLabel || "%"}
          </span>
        )}
      </div>
    </div>
  );
}
