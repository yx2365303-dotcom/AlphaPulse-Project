import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { MarketMoodTab } from "@/components/tabs/MarketMoodTab";
import { TopListTab } from "@/components/tabs/TopListTab";
import { SectorsTab } from "@/components/tabs/SectorsTab";
import { AIAnalystTab } from "@/components/tabs/AIAnalystTab";
import { getDefaultDate } from "@/lib/dateUtils";
import { useStockDataBundle } from "@/hooks/useStockData";
import { TrendingUp, List, Layers, Bot, Loader2 } from "lucide-react";
import { format } from "date-fns";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(getDefaultDate());
  const [activeTab, setActiveTab] = useState("market-mood");
  
  // 格式化日期为 YYYYMMDD 格式
  const tradeDate = format(selectedDate, 'yyyyMMdd');
  
  // 使用 React Query 获取数据
  const { 
    limitStocks, 
    limitSteps, 
    topList, 
    sectors, 
    marketOverview,
    isLoading,
    isError 
  } = useStockDataBundle(tradeDate);

  return (
    <div className="min-h-screen bg-background">
      <Header selectedDate={selectedDate} onDateChange={setSelectedDate} />
      
      <main className="container py-6">
        {/* 加载状态 */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">加载数据中...</span>
          </div>
        )}

        {/* 错误状态 */}
        {isError && !isLoading && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-destructive">数据加载失败，请稍后重试</p>
          </div>
        )}

        {/* 主要内容 */}
        {!isLoading && !isError && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-secondary/50 p-1">
              <TabsTrigger
                value="market-mood"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">打板专题</span>
              </TabsTrigger>
              <TabsTrigger
                value="top-list"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">龙虎榜</span>
              </TabsTrigger>
              <TabsTrigger
                value="sectors"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">板块风口</span>
              </TabsTrigger>
              <TabsTrigger
                value="ai-analyst"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">AI投研</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="market-mood" className="mt-6">
              <MarketMoodTab
                overview={marketOverview.data}
                limitStocks={limitStocks.data || []}
                limitSteps={limitSteps.data || []}
              />
            </TabsContent>

            <TabsContent value="top-list" className="mt-6">
              <TopListTab 
                topList={topList.data || []} 
                topInst={[]} 
              />
            </TabsContent>

            <TabsContent value="sectors" className="mt-6">
              <SectorsTab sectors={sectors.data || []} />
            </TabsContent>

            <TabsContent value="ai-analyst" className="mt-6">
              <AIAnalystTab />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-border py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>AlphaPulse 金融智能终端 · 数据仅供参考，不构成投资建议</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
