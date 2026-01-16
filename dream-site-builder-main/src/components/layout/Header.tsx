import { useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar, ChevronDown, LogOut, User, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getDefaultDate, getDateStatusText, isDateInRange } from "@/lib/dateUtils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function Header({ selectedDate, onDateChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateInRange(date)) {
      onDateChange(date);
      setCalendarOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gradient">AlphaPulse</span>
            <span className="text-xs text-muted-foreground">金融智能终端</span>
          </div>
        </div>

        {/* 日期选择器 */}
        <div className="flex items-center gap-4">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[200px] justify-between gap-2 border-border bg-secondary/50 hover:bg-secondary"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{getDateStatusText(selectedDate)}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={zhCN}
                disabled={(date) => !isDateInRange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-secondary text-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-sm text-muted-foreground border-b border-border mb-1">
                {user?.email || '用户'}
              </div>
              <DropdownMenuItem className="text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                <span>个人设置</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive cursor-pointer"
                onClick={async () => {
                  await signOut();
                  toast({
                    title: '已退出登录',
                    description: '期待您的下次访问！',
                  });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
