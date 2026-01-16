import { useState } from "react";
import { Bot, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIAnalysisRequest, AIAnalysisResponse } from "@/types/finance";

// 模拟 AI 分析服务
const mockAIAnalysisService = {
  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    console.log("[AIAnalysisService] 收到分析请求:", request);
    
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      analysis: `收到您的分析请求："${request.query}"。\n\n目前 AI 分析功能正在开发中，敬请期待。后续将接入大模型 API，提供专业的投研分析服务。`,
      suggestions: ["查看相关板块走势", "分析龙虎榜数据", "对比历史涨停情况"],
      relatedStocks: ["300750.SZ", "002594.SZ", "600519.SH"]
    };
  }
};

export function AIAnalystTab() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIAnalysisResponse | null>(null);

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await mockAIAnalysisService.analyze({ query });
      setResponse(result);
    } catch (error) {
      console.error("[AIAnalyst] 分析失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI 助手介绍 */}
      <div className="finance-card text-center py-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI 投研助手</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          基于大模型的智能投研分析，帮助您快速解读市场动态、分析个股走势、挖掘投资机会。
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Sparkles className="h-4 w-4 text-warning animate-pulse-soft" />
          <span className="text-sm text-muted-foreground">功能开发中，敬请期待</span>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="finance-card min-h-[300px] flex flex-col">
        {/* 消息显示区 */}
        <div className="flex-1 mb-4">
          {response ? (
            <div className="space-y-4">
              {/* 用户问题 */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg bg-primary/20 px-4 py-3 text-foreground">
                  {query}
                </div>
              </div>
              
              {/* AI 回答 */}
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <div className="rounded-lg bg-secondary px-4 py-3">
                  <p className="whitespace-pre-wrap text-foreground">{response.analysis}</p>
                  
                  {response.suggestions && response.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">相关建议：</p>
                      <div className="flex flex-wrap gap-2">
                        {response.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setQuery(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>请输入您想分析的股票或板块...</p>
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="flex gap-3">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例如：分析今日新能源板块走势，或者 宁德时代近期走势如何..."
            className="min-h-[60px] resize-none bg-secondary/50 border-border"
            disabled={isLoading}
          />
          <Button
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 快捷问题 */}
      <div className="finance-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">快捷问题</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "今日市场情绪如何？",
            "分析连板龙头股",
            "哪些板块资金流入最多？",
            "机构重点买入了哪些股票？",
          ].map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => setQuery(question)}
              className="text-sm"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
