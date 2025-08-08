import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MT5AccountManagement from '@/components/mt5/MT5AccountManagement';
import MyfxbookIntegration from '@/components/mt5/MyfxbookIntegration';
import { Activity, Globe, Settings, BarChart3, TrendingUp, Shield, RefreshCw } from 'lucide-react';
import { myfxbookApi } from '@/lib/myfxbookApi';

const MT5Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mt5');
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [isLoadingSentiment, setIsLoadingSentiment] = useState(false);
  const [sentimentError, setSentimentError] = useState<string | null>(null);

  // Fetch live sentiment data
  const fetchSentimentData = async () => {
    setIsLoadingSentiment(true);
    setSentimentError(null);
    
    try {
      const result = await myfxbookApi.getCommunityOutlook();
      if (!result.error) {
        setSentimentData(result.communityOutlook);
      } else {
        setSentimentError(result.message || 'Failed to load sentiment data');
      }
    } catch (error) {
      setSentimentError('Failed to connect to sentiment service');
    } finally {
      setIsLoadingSentiment(false);
    }
  };

  // Load sentiment data on component mount
  useEffect(() => {
    fetchSentimentData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Account Management</h1>
          <p className="text-muted-foreground">
            View and manage your trading account statistics across multiple platforms
          </p>
        </div>
      </div>

      {/* Combined Account Data Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,847,392</div>
            <p className="text-xs text-muted-foreground">
              +12.4% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,124,156</div>
            <p className="text-xs text-muted-foreground">
              +8.7% total return
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              $892,450 unrealized P&L
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Globe className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <p className="text-xs text-muted-foreground">
              1,247 winning trades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Market Sentiment Overview */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                Market Sentiment Overview
              </CardTitle>
              <CardDescription>
                Real-time community sentiment and market outlook from Myfxbook
              </CardDescription>
            </div>
            <button
              onClick={fetchSentimentData}
              disabled={isLoadingSentiment}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingSentiment ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {sentimentError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">{sentimentError}</p>
              <button
                onClick={fetchSentimentData}
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                Try again
              </button>
            </div>
          ) : isLoadingSentiment ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-indigo-600" />
              <p className="text-muted-foreground">Loading live sentiment data...</p>
            </div>
          ) : sentimentData ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {(() => {
                  // Try to find our preferred symbols first
                  const preferredSymbols = ['XAUUSD', 'US500', 'EURUSD', 'USTECH', 'NAS100', 'SPX500', 'NASDAQ', 'SP500'];
                  const filteredSymbols = sentimentData.symbols.filter((symbol: any) => 
                    preferredSymbols.includes(symbol.name)
                  );
                  
                  // If we don't have enough preferred symbols, add some popular ones
                  const additionalSymbols = sentimentData.symbols
                    .filter((symbol: any) => !preferredSymbols.includes(symbol.name))
                    .slice(0, 4 - filteredSymbols.length);
                  
                  const displaySymbols = [...filteredSymbols, ...additionalSymbols].slice(0, 4);
                  
                  return displaySymbols.map((symbol: any) => {
                    const longPercentage = symbol.longPercentage || 50;
                    const shortPercentage = symbol.shortPercentage || 50;
                    const sentiment = longPercentage > shortPercentage ? 'Bullish' : 
                                   longPercentage < shortPercentage ? 'Bearish' : 'Neutral';
                    const color = sentiment === 'Bullish' ? 'bg-green-600' : 
                                sentiment === 'Bearish' ? 'bg-red-600' : 'bg-blue-600';
                    
                    return (
                      <div key={symbol.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{symbol.name}</span>
                          <span className="text-sm text-muted-foreground">{sentiment}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${color} h-2 rounded-full`} style={{ width: `${longPercentage}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{longPercentage.toFixed(0)}% Long</span>
                          <span>{shortPercentage.toFixed(0)}% Short</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Overall Market Sentiment</span>
                  <span className="text-green-600 font-medium">
                    {sentimentData.general.profitablePercentage > 50 ? 'Bullish' : 'Bearish'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full" 
                      style={{ width: `${sentimentData.general.profitablePercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {sentimentData.general.profitablePercentage.toFixed(0)}% Profitable
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No sentiment data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mt5" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            MetaTrader 5
          </TabsTrigger>
          <TabsTrigger value="myfxbook" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Myfxbook
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mt5" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                MetaTrader 5 Account Management
              </CardTitle>
              <CardDescription>
                Manage your MT5 trading accounts, view positions, and monitor performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MT5AccountManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="myfxbook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Myfxbook Integration
              </CardTitle>
              <CardDescription>
                Connect to Myfxbook API to access community sentiment, account analytics, and social trading data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyfxbookIntegration />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MT5Page; 