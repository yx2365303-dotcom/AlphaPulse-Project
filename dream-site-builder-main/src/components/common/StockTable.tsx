import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface StockTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyText?: string;
}

export function StockTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  emptyText = "暂无数据",
}: StockTableProps<T>) {
  const getValue = (row: T, key: string) => {
    const keys = key.split(".");
    let value: any = row;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  };

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={cn("text-muted-foreground font-medium", column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index} className="table-row-hover">
                {columns.map((column) => {
                  const value = getValue(row, String(column.key));
                  return (
                    <TableCell
                      key={String(column.key)}
                      className={cn("py-3", column.className)}
                    >
                      {column.render ? column.render(value, row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// 辅助组件：股票代码单元格
export function StockCodeCell({ code, name }: { code: string; name: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium text-foreground">{name}</span>
      <span className="text-xs font-mono text-muted-foreground">{code}</span>
    </div>
  );
}

// 辅助组件：涨跌幅单元格
export function PctChangeCell({ value }: { value: number }) {
  const isUp = value > 0;
  const isDown = value < 0;
  return (
    <span
      className={cn(
        "font-mono font-medium",
        isUp && "stock-up",
        isDown && "stock-down",
        !isUp && !isDown && "stock-flat"
      )}
    >
      {isUp && "+"}
      {value.toFixed(2)}%
    </span>
  );
}

// 辅助组件：金额单元格
export function AmountCell({ value, unit = "万" }: { value: number; unit?: string }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const formatted = Math.abs(value) >= 10000 
    ? `${(value / 10000).toFixed(2)}亿` 
    : `${value.toFixed(0)}${unit}`;
  
  return (
    <span
      className={cn(
        "font-mono",
        isPositive && "stock-up",
        isNegative && "stock-down",
        !isPositive && !isNegative && "stock-flat"
      )}
    >
      {isPositive && "+"}
      {formatted}
    </span>
  );
}

// 辅助组件：状态徽章
export function StatusBadge({ status }: { status: string }) {
  const isSealed = status === "封板";
  return (
    <Badge
      variant={isSealed ? "default" : "secondary"}
      className={cn(
        isSealed && "bg-primary/20 text-primary border-primary/30",
        !isSealed && "bg-warning/20 text-warning border-warning/30"
      )}
    >
      {status}
    </Badge>
  );
}
