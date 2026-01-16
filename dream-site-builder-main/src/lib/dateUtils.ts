import { format, subDays, isValid, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

/**
 * 7PM 规则 - 获取默认显示日期
 * 若当前时间 < 19:00: 显示昨天的数据
 * 若当前时间 >= 19:00: 显示今天的数据
 */
export function getDefaultDate(): Date {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (currentHour < 19) {
    return subDays(now, 1);
  }
  return now;
}

/**
 * 格式化日期为中文显示
 */
export function formatDateCN(date: Date): string {
  if (!isValid(date)) return "无效日期";
  return format(date, "yyyy年MM月dd日", { locale: zhCN });
}

/**
 * 格式化日期为 API 格式
 */
export function formatDateAPI(date: Date): string {
  if (!isValid(date)) return "";
  return format(date, "yyyy-MM-dd");
}

/**
 * 格式化日期为短格式
 */
export function formatDateShort(date: Date): string {
  if (!isValid(date)) return "";
  return format(date, "MM/dd");
}

/**
 * 获取日期状态文本
 */
export function getDateStatusText(date: Date): string {
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");
  const yesterday = format(subDays(now, 1), "yyyy-MM-dd");
  const dateStr = format(date, "yyyy-MM-dd");
  
  if (dateStr === today) return "今日";
  if (dateStr === yesterday) return "昨日";
  return formatDateCN(date);
}

/**
 * 解析日期字符串
 */
export function parseDateString(dateStr: string): Date | null {
  try {
    const date = parseISO(dateStr);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

/**
 * 检查日期是否在允许范围内（过去2年）
 */
export function isDateInRange(date: Date): boolean {
  const now = new Date();
  const twoYearsAgo = subDays(now, 730); // 大约2年
  return date >= twoYearsAgo && date <= now;
}
