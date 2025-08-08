import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  Users,
  BarChart3,
  Globe,
  Shield,
  LogIn,
  LogOut,
  RefreshCw,
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  PieChart,
  LineChart,
  MapPin,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';
import { myfxbookApi, MyfxbookAccount, MyfxbookTrade, MyfxbookOrder, MyfxbookCommunityOutlook } from '@/lib/myfxbookApi';

const MyfxbookIntegration: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [accounts, setAccounts] = useState<MyfxbookAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<MyfxbookAccount | null>(null);
  const [openTrades, setOpenTrades] = useState<MyfxbookTrade[]>([]);
  const [openOrders, setOpenOrders] = useState<MyfxbookOrder[]>([]);
  const [communityOutlook, setCommunityOutlook] = useState<MyfxbookCommunityOutlook | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isSentimentDialogOpen, setIsSentimentDialogOpen] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setIsInitializing(true);
        // Check if already authenticated
        if (myfxbookApi.isAuthenticated()) {
          setIsAuthenticated(true);
          await loadAccounts();
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to initialize Myfxbook integration');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeComponent();
  }, []);

  const handleLogin = async () => {
    if (!loginCredentials.email || !loginCredentials.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting Myfxbook login...');
      const result = await myfxbookApi.login(loginCredentials.email, loginCredentials.password);
      
      console.log('Login result:', result);
      
      if (!result.error) {
        setIsAuthenticated(true);
        setIsLoginDialogOpen(false);
        setLoginCredentials({ email: '', password: '' });
        toast({
          title: "Login Successful",
          description: "Successfully connected to Myfxbook API.",
        });
        await loadAccounts();
      } else {
        // Handle specific Myfxbook error messages
        let errorMessage = result.message || 'Failed to authenticate with Myfxbook';
        let toastTitle = "Login Failed";
        
        if (result.message?.includes('Max login attempts reached')) {
          errorMessage = 'Login limit reached. Please wait 15-30 minutes or login via Myfxbook.com first.';
          toastTitle = "Login Limit Reached";
        } else if (result.message?.includes('Invalid credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
          toastTitle = "Invalid Credentials";
        }
        
        setError(errorMessage);
        toast({
          title: toastTitle,
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Myfxbook login error:', error);
      setError('Network error during login. Please check your internet connection.');
      toast({
        title: "Connection Error",
        description: "Failed to connect to Myfxbook API. Please check your internet connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await myfxbookApi.logout();
      setIsAuthenticated(false);
      setAccounts([]);
      setSelectedAccount(null);
      setOpenTrades([]);
      setOpenOrders([]);
      setCommunityOutlook(null);
      setError(null);
      toast({
        title: "Logged Out",
        description: "Successfully disconnected from Myfxbook API.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to logout from Myfxbook API.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const result = await myfxbookApi.getMyAccounts();
      if (!result.error) {
        setAccounts(result.accounts);
        if (result.accounts.length > 0) {
          setSelectedAccount(result.accounts[0]);
          await loadAccountData(result.accounts[0].id);
        }
      } else {
        setError(result.message || 'Failed to load accounts');
        toast({
          title: "Failed to Load Accounts",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Load accounts error:', error);
      setError('Failed to load accounts from Myfxbook API');
      toast({
        title: "Connection Error",
        description: "Failed to load accounts from Myfxbook API.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAccountData = async (accountId: string) => {
    setIsLoading(true);
    try {
      // Load open trades
      const tradesResult = await myfxbookApi.getOpenTrades(accountId);
      if (!tradesResult.error) {
        setOpenTrades(tradesResult.trades);
      }

      // Load open orders
      const ordersResult = await myfxbookApi.getOpenOrders(accountId);
      if (!ordersResult.error) {
        setOpenOrders(ordersResult.orders);
      }
    } catch (error) {
      console.error('Load account data error:', error);
      toast({
        title: "Data Loading Error",
        description: "Failed to load account data from Myfxbook API.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCommunitySentiment = async () => {
    setIsLoading(true);
    try {
      const result = await myfxbookApi.getCommunityOutlook();
      if (!result.error) {
        setCommunityOutlook(result.communityOutlook);
        setIsSentimentDialogOpen(true);
      } else {
        toast({
          title: "Failed to Load Sentiment",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Load sentiment error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to load community sentiment from Myfxbook API.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSelect = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setSelectedAccount(account);
      loadAccountData(accountId);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'live': return 'bg-red-100 text-red-800';
      case 'demo': return 'bg-blue-100 text-blue-800';
      case 'cent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSideColor = (side: string) => {
    return side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Initializing Myfxbook integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Account Data</h1>
          <p className="text-muted-foreground">
            Real-time trading account statistics and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!isAuthenticated ? (
            <Button onClick={() => setIsLoginDialogOpen(true)} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              <LogIn className="w-4 h-4 mr-2" />
              Connect Account
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="border-red-200 text-red-700 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          )}
          <Button variant="outline" onClick={loadCommunitySentiment} disabled={!isAuthenticated || isLoading} className="border-gray-200 hover:bg-gray-50">
            <Globe className="w-4 h-4 mr-2" />
            Market Sentiment
          </Button>
        </div>
      </div>

      {/* Authentication Status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Account Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Account data connected and synchronized</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-600 font-medium">Account data not connected</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Selection */}
      {isAuthenticated && accounts.length > 0 && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Trading Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedAccount?.id} onValueChange={handleAccountSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select trading account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} - {account.broker} ({account.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Account Overview */}
      {selectedAccount && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(selectedAccount.balance, selectedAccount.currency)}</div>
              <p className="text-xs text-muted-foreground">
                Available trading capital
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(selectedAccount.equity, selectedAccount.currency)}</div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(selectedAccount.profit)} total P&L
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedAccount.winRate ? selectedAccount.winRate.toFixed(1) : '0.0'}%
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedAccount.winningTrades || 0} winning trades
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedAccount.openPositions}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(selectedAccount.openProfit, selectedAccount.currency)} unrealized P&L
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Open Trades */}
      {selectedAccount && openTrades.length > 0 && (
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Active Positions ({openTrades.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Lots</TableHead>
                  <TableHead>Open Price</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Pips</TableHead>
                  <TableHead>Open Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge className={getSideColor(trade.side)}>
                        {trade.side.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{trade.lots}</TableCell>
                    <TableCell>{trade.openPrice}</TableCell>
                    <TableCell className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(trade.profit, selectedAccount.currency)}
                    </TableCell>
                    <TableCell className={trade.pips >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {trade.pips}
                    </TableCell>
                    <TableCell>{new Date(trade.openTime).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Open Orders */}
      {selectedAccount && openOrders.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Orders ({openOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Lots</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stop Loss</TableHead>
                  <TableHead>Take Profit</TableHead>
                  <TableHead>Expiration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.symbol}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.lots}</TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{order.stopLoss || '-'}</TableCell>
                    <TableCell>{order.takeProfit || '-'}</TableCell>
                    <TableCell>
                      {order.expiration ? new Date(order.expiration).toLocaleDateString() : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Trading Account</DialogTitle>
            <DialogDescription>
              Enter your account credentials to access real-time trading data and statistics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginCredentials.email}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                placeholder="Your password"
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleLogin} disabled={isLoading} className="flex-1">
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
                Connect
              </Button>
              <Button variant="outline" onClick={() => setIsLoginDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Community Sentiment Dialog */}
      <Dialog open={isSentimentDialogOpen} onOpenChange={setIsSentimentDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Market Sentiment Analysis</DialogTitle>
            <DialogDescription>
              Real-time market sentiment data and community trading insights.
            </DialogDescription>
          </DialogHeader>
          {communityOutlook && (
            <div className="space-y-6">
              {/* General Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>General Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{communityOutlook.general.profitablePercentage}%</div>
                      <div className="text-sm text-muted-foreground">Profitable</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{communityOutlook.general.nonProfitablePercentage}%</div>
                      <div className="text-sm text-muted-foreground">Non-Profitable</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{communityOutlook.general.realAccountsPercentage}%</div>
                      <div className="text-sm text-muted-foreground">Real Accounts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{communityOutlook.general.demoAccountsPercentage}%</div>
                      <div className="text-sm text-muted-foreground">Demo Accounts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Symbol Sentiment */}
              <Card>
                <CardHeader>
                  <CardTitle>Symbol Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Long %</TableHead>
                        <TableHead>Short %</TableHead>
                        <TableHead>Long Volume</TableHead>
                        <TableHead>Short Volume</TableHead>
                        <TableHead>Total Positions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {communityOutlook.symbols.slice(0, 10).map((symbol) => (
                        <TableRow key={symbol.name}>
                          <TableCell className="font-medium">{symbol.name}</TableCell>
                          <TableCell className="text-green-600">{symbol.longPercentage}%</TableCell>
                          <TableCell className="text-red-600">{symbol.shortPercentage}%</TableCell>
                          <TableCell>{symbol.longVolume.toFixed(2)}</TableCell>
                          <TableCell>{symbol.shortVolume.toFixed(2)}</TableCell>
                          <TableCell>{symbol.totalPositions}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyfxbookIntegration; 