import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Target,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface MT5Stats {
  account: {
    balance: number;
    equity: number;
    margin: number;
    free_margin: number;
    profit: number;
  };
  statistics: {
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    win_rate: number;
    total_profit: number;
    total_swap: number;
    net_profit: number;
    open_positions: number;
    open_profit: number;
  };
  performance: {
    profit_factor: number;
    average_win: number;
    average_loss: number;
    largest_win: number;
    largest_loss: number;
  };
}

interface Trade {
  ticket: number;
  symbol: string;
  type: string;
  volume: number;
  price_open: number;
  price_current: number;
  profit: number;
  swap: number;
  time: string;
  magic: number;
  comment: string;
}

const MT5Dashboard: React.FC = () => {
  const [stats, setStats] = useState<MT5Stats | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_MT5_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check connection
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        const healthData = await healthResponse.json();
        setConnected(healthData.mt5_connected);

        if (healthData.mt5_connected) {
          // Fetch stats
          const statsResponse = await fetch(`${API_BASE_URL}/stats`);
          const statsData = await statsResponse.json();
          setStats(statsData);

          // Fetch trades
          const tradesResponse = await fetch(`${API_BASE_URL}/trades`);
          const tradesData = await tradesResponse.json();
          setTrades(tradesData);
        } else {
          setError('MT5 not connected. Please check your MetaTrader 5 connection.');
        }
      } catch (err) {
        setError('Failed to connect to MT5 API. Make sure the API is running.');
        console.error('Error fetching MT5 data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  const closeTrade = async (ticket: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trade/${ticket}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast({
          title: "Trade Closed",
          description: `Successfully closed trade #${ticket}`,
        });
        // Refresh data
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.detail || "Failed to close trade",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to close trade",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-700">
            MetaTrader 5 is not connected. Please check your connection settings.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="text-sm font-medium text-green-700">Connected to MetaTrader 5</span>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.account.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Equity: ${stats?.account.equity.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
            {stats?.account.profit && stats.account.profit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats?.account.profit && stats.account.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats?.account.profit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Margin: ${stats?.account.margin.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.statistics.win_rate.toFixed(1)}%</div>
            <Progress value={stats?.statistics.win_rate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.statistics.winning_trades} wins / {stats?.statistics.total_trades} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.statistics.open_positions}</div>
            <p className="text-xs text-muted-foreground">
              P&L: ${stats?.statistics.open_profit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trading Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Profit</span>
                <span className={`font-medium ${stats?.statistics.total_profit && stats.statistics.total_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${stats?.statistics.total_profit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Net Profit</span>
                <span className={`font-medium ${stats?.statistics.net_profit && stats.statistics.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${stats?.statistics.net_profit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Swap</span>
                <span className="font-medium">${stats?.statistics.total_swap.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Profit Factor</span>
                <span className="font-medium">{stats?.performance.profit_factor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Win</span>
                <span className="text-green-600 font-medium">${stats?.performance.average_win.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Loss</span>
                <span className="text-red-600 font-medium">${stats?.performance.average_loss.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Largest Win</span>
                <span className="text-green-600 font-medium">${stats?.performance.largest_win.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Largest Loss</span>
                <span className="text-red-600 font-medium">${stats?.performance.largest_loss.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Trades</span>
                <span className="font-medium">{stats?.statistics.total_trades}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Open Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No open trades</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Open Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.ticket}>
                    <TableCell>{trade.ticket}</TableCell>
                    <TableCell>{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                        {trade.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{trade.volume}</TableCell>
                    <TableCell>${trade.price_open.toFixed(5)}</TableCell>
                    <TableCell>${trade.price_current.toFixed(5)}</TableCell>
                    <TableCell className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${trade.profit.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => closeTrade(trade.ticket)}
                      >
                        Close
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MT5Dashboard; 