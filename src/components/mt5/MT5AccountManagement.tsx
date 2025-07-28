import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Plus, 
  Search, 
  Filter, 
  Activity, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  CheckCircle,
  AlertCircle,
  Target,
  Users,
  BarChart3
} from 'lucide-react';

interface MT5Account {
  id: string;
  name: string;
  accountNumber: string;
  broker: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  profit: number;
  status: 'active' | 'inactive' | 'suspended';
  type: 'demo' | 'live' | 'cent';
  currency: string;
  leverage: number;
  lastLogin: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  openPositions: number;
  openProfit: number;
}

interface MT5Stats {
  totalAccounts: number;
  activeAccounts: number;
  totalBalance: number;
  totalEquity: number;
  totalProfit: number;
  totalOpenPositions: number;
  totalOpenProfit: number;
  averageWinRate: number;
  totalTrades: number;
  totalWinningTrades: number;
  totalLosingTrades: number;
}

const MT5AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<MT5Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<MT5Account | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState({
    name: '',
    accountNumber: '',
    broker: '',
    type: 'demo' as 'demo' | 'live' | 'cent',
    currency: 'USD',
    leverage: 100
  });
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockAccounts: MT5Account[] = [
      {
        id: '1',
        name: 'Main Trading Account',
        accountNumber: '12345678',
        broker: 'MetaQuotes',
        balance: 50000,
        equity: 52340,
        margin: 1250,
        freeMargin: 51090,
        profit: 2340,
        status: 'active',
        type: 'live',
        currency: 'USD',
        leverage: 100,
        lastLogin: '2024-01-15T10:30:00Z',
        totalTrades: 156,
        winningTrades: 98,
        losingTrades: 58,
        winRate: 62.8,
        totalProfit: 15200,
        openPositions: 3,
        openProfit: 2340
      },
      {
        id: '2',
        name: 'Demo Testing Account',
        accountNumber: '87654321',
        broker: 'MetaQuotes',
        balance: 10000,
        equity: 9870,
        margin: 0,
        freeMargin: 9870,
        profit: -130,
        status: 'active',
        type: 'demo',
        currency: 'USD',
        leverage: 500,
        lastLogin: '2024-01-14T15:45:00Z',
        totalTrades: 45,
        winningTrades: 28,
        losingTrades: 17,
        winRate: 62.2,
        totalProfit: 870,
        openPositions: 0,
        openProfit: 0
      },
      {
        id: '3',
        name: 'Cent Account',
        accountNumber: '11223344',
        broker: 'MetaQuotes',
        balance: 1000,
        equity: 1050,
        margin: 25,
        freeMargin: 1025,
        profit: 50,
        status: 'active',
        type: 'cent',
        currency: 'USD',
        leverage: 1000,
        lastLogin: '2024-01-13T09:20:00Z',
        totalTrades: 23,
        winningTrades: 15,
        losingTrades: 8,
        winRate: 65.2,
        totalProfit: 150,
        openPositions: 1,
        openProfit: 50
      }
    ];
    setAccounts(mockAccounts);
  }, []);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || account.status === selectedStatus;
    const matchesType = selectedType === 'all' || account.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats: MT5Stats = {
    totalAccounts: accounts.length,
    activeAccounts: accounts.filter(acc => acc.status === 'active').length,
    totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
    totalEquity: accounts.reduce((sum, acc) => sum + acc.equity, 0),
    totalProfit: accounts.reduce((sum, acc) => sum + acc.profit, 0),
    totalOpenPositions: accounts.reduce((sum, acc) => sum + acc.openPositions, 0),
    totalOpenProfit: accounts.reduce((sum, acc) => sum + acc.openProfit, 0),
    averageWinRate: accounts.length > 0 ? accounts.reduce((sum, acc) => sum + acc.winRate, 0) / accounts.length : 0,
    totalTrades: accounts.reduce((sum, acc) => sum + acc.totalTrades, 0),
    totalWinningTrades: accounts.reduce((sum, acc) => sum + acc.winningTrades, 0),
    totalLosingTrades: accounts.reduce((sum, acc) => sum + acc.losingTrades, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'suspended': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'live': return 'bg-primary/10 text-primary';
      case 'demo': return 'bg-warning/10 text-warning';
      case 'cent': return 'bg-secondary/10 text-secondary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleViewAccount = (account: MT5Account) => {
    setSelectedAccount(account);
    setIsViewDialogOpen(true);
  };

  const handleEditAccount = (account: MT5Account) => {
    setSelectedAccount(account);
    setEditingAccountId(account.id);
    setNewAccount({
      name: account.name,
      accountNumber: account.accountNumber,
      broker: account.broker,
      type: account.type as 'demo' | 'live' | 'cent',
      currency: account.currency,
      leverage: account.leverage
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAccount = (account: MT5Account) => {
    setSelectedAccount(account);
    setIsDeleteDialogOpen(true);
  };

  const handleAddAccount = () => {
    setNewAccount({
      name: '',
      accountNumber: '',
      broker: '',
      type: 'demo',
      currency: 'USD',
      leverage: 100
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveAccount = () => {
    if (!newAccount.name || !newAccount.accountNumber || !newAccount.broker) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newAccountData: MT5Account = {
      id: Date.now().toString(),
      name: newAccount.name,
      accountNumber: newAccount.accountNumber,
      broker: newAccount.broker,
      balance: 0,
      equity: 0,
      margin: 0,
      freeMargin: 0,
      profit: 0,
      status: 'active',
      type: newAccount.type,
      currency: newAccount.currency,
      leverage: newAccount.leverage,
      lastLogin: new Date().toISOString(),
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalProfit: 0,
      openPositions: 0,
      openProfit: 0
    };

    setAccounts([...accounts, newAccountData]);
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Account added successfully",
    });
  };

  const handleUpdateAccount = () => {
    if (!editingAccountId) return;

    const updatedAccounts = accounts.map(acc => 
      acc.id === editingAccountId 
        ? { ...acc, ...newAccount }
        : acc
    );

    setAccounts(updatedAccounts);
    setIsEditDialogOpen(false);
    setEditingAccountId(null);
    toast({
      title: "Success",
      description: "Account updated successfully",
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedAccount) return;

    setAccounts(accounts.filter(acc => acc.id !== selectedAccount.id));
    setIsDeleteDialogOpen(false);
    setSelectedAccount(null);
    toast({
      title: "Success",
      description: "Account deleted successfully",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
          <p className="text-muted-foreground">
            Manage your MT5 trading accounts and monitor performance
          </p>
        </div>
        <Button onClick={handleAddAccount}>
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAccounts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAccounts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Equity: {formatCurrency(stats.totalEquity)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            {stats.totalProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.totalProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalOpenPositions} open positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWinRate.toFixed(1)}%</div>
            <Progress value={stats.averageWinRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalWinningTrades} wins / {stats.totalTrades} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="cent">Cent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Equity</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">{account.accountNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(account.type)}>
                      {account.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(account.balance)}</TableCell>
                  <TableCell>{formatCurrency(account.equity)}</TableCell>
                  <TableCell className={account.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(account.profit)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{account.winRate.toFixed(1)}%</span>
                      <Progress value={account.winRate} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAccount(account)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAccount(account)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAccount(account)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Account Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected account
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Account Name</Label>
                  <p className="text-sm font-medium">{selectedAccount.name}</p>
                </div>
                <div>
                  <Label>Account Number</Label>
                  <p className="text-sm font-medium">{selectedAccount.accountNumber}</p>
                </div>
                <div>
                  <Label>Broker</Label>
                  <p className="text-sm font-medium">{selectedAccount.broker}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <Badge className={getTypeColor(selectedAccount.type)}>
                    {selectedAccount.type.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Balance</Label>
                  <p className="text-sm font-medium">{formatCurrency(selectedAccount.balance)}</p>
                </div>
                <div>
                  <Label>Equity</Label>
                  <p className="text-sm font-medium">{formatCurrency(selectedAccount.equity)}</p>
                </div>
                <div>
                  <Label>Profit</Label>
                  <p className={`text-sm font-medium ${selectedAccount.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(selectedAccount.profit)}
                  </p>
                </div>
                <div>
                  <Label>Win Rate</Label>
                  <p className="text-sm font-medium">{selectedAccount.winRate.toFixed(1)}%</p>
                </div>
                <div>
                  <Label>Total Trades</Label>
                  <p className="text-sm font-medium">{selectedAccount.totalTrades}</p>
                </div>
                <div>
                  <Label>Open Positions</Label>
                  <p className="text-sm font-medium">{selectedAccount.openPositions}</p>
                </div>
                <div>
                  <Label>Leverage</Label>
                  <p className="text-sm font-medium">1:{selectedAccount.leverage}</p>
                </div>
                <div>
                  <Label>Currency</Label>
                  <p className="text-sm font-medium">{selectedAccount.currency}</p>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <p className="text-sm font-medium">{formatDate(selectedAccount.lastLogin)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Account Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Add a new MT5 trading account to your portfolio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                placeholder="Enter account name"
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={newAccount.accountNumber}
                onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                placeholder="Enter account number"
              />
            </div>
            <div>
              <Label htmlFor="broker">Broker</Label>
              <Input
                id="broker"
                value={newAccount.broker}
                onChange={(e) => setNewAccount({ ...newAccount, broker: e.target.value })}
                placeholder="Enter broker name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Account Type</Label>
                <Select value={newAccount.type} onValueChange={(value: 'demo' | 'live' | 'cent') => setNewAccount({ ...newAccount, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="cent">Cent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={newAccount.currency} onValueChange={(value) => setNewAccount({ ...newAccount, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="leverage">Leverage</Label>
              <Input
                id="leverage"
                type="number"
                value={newAccount.leverage}
                onChange={(e) => setNewAccount({ ...newAccount, leverage: parseInt(e.target.value) })}
                placeholder="Enter leverage"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAccount}>
              <Save className="w-4 h-4 mr-2" />
              Save Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update account information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Account Name</Label>
              <Input
                id="edit-name"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                placeholder="Enter account name"
              />
            </div>
            <div>
              <Label htmlFor="edit-accountNumber">Account Number</Label>
              <Input
                id="edit-accountNumber"
                value={newAccount.accountNumber}
                onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                placeholder="Enter account number"
              />
            </div>
            <div>
              <Label htmlFor="edit-broker">Broker</Label>
              <Input
                id="edit-broker"
                value={newAccount.broker}
                onChange={(e) => setNewAccount({ ...newAccount, broker: e.target.value })}
                placeholder="Enter broker name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Account Type</Label>
                <Select value={newAccount.type} onValueChange={(value: 'demo' | 'live' | 'cent') => setNewAccount({ ...newAccount, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="cent">Cent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-currency">Currency</Label>
                <Select value={newAccount.currency} onValueChange={(value) => setNewAccount({ ...newAccount, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-leverage">Leverage</Label>
              <Input
                id="edit-leverage"
                type="number"
                value={newAccount.leverage}
                onChange={(e) => setNewAccount({ ...newAccount, leverage: parseInt(e.target.value) })}
                placeholder="Enter leverage"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAccount}>
              <Save className="w-4 h-4 mr-2" />
              Update Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedAccount.name}</p>
                <p className="text-sm text-muted-foreground">{selectedAccount.accountNumber}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MT5AccountManagement; 