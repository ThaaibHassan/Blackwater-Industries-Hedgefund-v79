import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Users,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  FileText,
  CreditCard,
  Shield,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useData } from '@/context/DataContext';

const fundPerformance = [
  { name: 'Blackwater Alpha Fund', nav: 125.50, dailyChange: 0.8, monthlyReturn: 3.2, ytdReturn: 12.5 },
  { name: 'Blackwater Macro Fund', nav: 98.75, dailyChange: -0.3, monthlyReturn: 1.8, ytdReturn: 6.8 },
  { name: 'Blackwater Credit Fund', nav: 104.20, dailyChange: 0.2, monthlyReturn: 1.2, ytdReturn: 4.2 }
];

const InvestorPortalPage = () => {
  const { investors } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || investor.status === selectedStatus;
    const matchesType = selectedType === 'all' || investor.type === selectedType;
    const matchesRisk = selectedRisk === 'all' || investor.riskProfile === selectedRisk;
    
    return matchesSearch && matchesStatus && matchesType && matchesRisk;
  });

  const sortedInvestors = [...filteredInvestors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'investment':
        return b.totalInvestment - a.totalInvestment;
      case 'return':
        return b.totalReturn - a.totalReturn;
      case 'date':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      default:
        return 0;
    }
  });

  const totalInvestors = investors.length;
  const activeInvestors = investors.filter(i => i.status === 'active').length;
  const totalAum = investors.reduce((sum, i) => sum + i.currentValue, 0);
  const avgReturn = investors.reduce((sum, i) => sum + i.totalReturn, 0) / totalInvestors;

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <User className="w-4 h-4" />;
      case 'institutional': return <Building className="w-4 h-4" />;
      case 'family_office': return <Users className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'conservative': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'aggressive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewInvestor = (investor: any) => {
    setSelectedInvestor(investor);
    setIsViewDialogOpen(true);
  };

  const handleDeleteInvestor = (investor: any) => {
    setSelectedInvestor(investor);
    setIsDeleteDialogOpen(true);
  };

  const handleSendEmail = (investor: any) => {
    toast({
      title: "Email Sent",
      description: `Email sent to ${investor.name} at ${investor.email}`,
    });
  };

  const handleCallInvestor = (investor: any) => {
    toast({
      title: "Call Initiated",
      description: `Calling ${investor.name} at ${investor.phone}`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Investor data export has been initiated. You will receive an email when ready.",
    });
  };

  const handleAddInvestor = () => {
    toast({
      title: "Add Investor",
      description: "Add investor functionality will be implemented here.",
    });
  };

  const confirmDelete = () => {
    if (selectedInvestor) {
      toast({
        title: "Investor Deleted",
        description: `${selectedInvestor.name} has been removed from the system.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedInvestor(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investor Portal</h1>
          <p className="text-muted-foreground">
            Manage investor relationships and portfolio performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddInvestor}>
            <Plus className="w-4 h-4 mr-2" />
            Add Investor
          </Button>
        </div>
      </div>

      {/* Investor Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvestors}</div>
            <p className="text-xs text-muted-foreground">
              {activeInvestors} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAum)}</div>
            <p className="text-xs text-muted-foreground">
              Under management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(avgReturn)}</div>
            <p className="text-xs text-muted-foreground">
              All time average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              New investors onboarded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Investor Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="institutional">Institutional</SelectItem>
                  <SelectItem value="family_office">Family Office</SelectItem>
                  <SelectItem value="hnwi">High-Net-Worth Individual (HNWI)</SelectItem>
                  <SelectItem value="uhnwi">Ultra-High-Net-Worth Individual (UHNWI)</SelectItem>
                  <SelectItem value="founder_entrepreneur">Founder & Entrepreneur</SelectItem>
                  <SelectItem value="corporate">Corporate Client</SelectItem>
                  <SelectItem value="institutional_investor">Institutional Investor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="risk">Risk Profile</Label>
              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger id="risk" className="w-full">
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort" className="w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="date">Join Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Investor Directory</CardTitle>
          <CardDescription>
            {filteredInvestors.length} of {investors.length} investors shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Investor</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-right p-2">Investment</th>
                  <th className="text-right p-2">Current Value</th>
                  <th className="text-right p-2">Total Return</th>
                  <th className="text-left p-2">Risk Profile</th>
                  <th className="text-left p-2">KYC Status</th>
                  <th className="text-left p-2">Join Date</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedInvestors.map((investor) => (
                  <tr key={investor.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{investor.name}</div>
                        <div className="text-sm text-muted-foreground">{investor.email}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(investor.type)}
                        <Badge variant="outline">
                          {investor.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(investor.status)}>
                        {investor.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-right">{formatCurrency(investor.totalInvestment)}</td>
                    <td className="p-2 text-right">{formatCurrency(investor.currentValue)}</td>
                    <td className="p-2 text-right">
                      <div className={`font-medium ${investor.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(investor.totalReturn)}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={getRiskColor(investor.riskProfile)}>
                        {investor.riskProfile}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={investor.kycStatus === 'verified' ? 'default' : 'secondary'}>
                        {investor.kycStatus}
                      </Badge>
                    </td>
                    <td className="p-2">{formatDate(investor.joinDate)}</td>
                    <td className="p-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewInvestor(investor)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSendEmail(investor)}
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCallInvestor(investor)}
                          title="Call Investor"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteInvestor(investor)}
                          title="Delete Investor"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Fund Performance and Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fund Performance</CardTitle>
            <CardDescription>Current NAV and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fundPerformance.map((fund) => (
                <div key={fund.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{fund.name}</div>
                    <div className="text-sm text-muted-foreground">
                      NAV: ${fund.nav}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${fund.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(fund.dailyChange)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      YTD: {formatPercentage(fund.ytdReturn)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investor Analytics</CardTitle>
            <CardDescription>Key metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Avg Investment Size</span>
                <span className="text-sm font-medium">{formatCurrency(totalAum / totalInvestors)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Investor Retention Rate</span>
                <span className="text-sm font-medium text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Time to Onboard</span>
                <span className="text-sm font-medium">5.3 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">KYC Completion Rate</span>
                <span className="text-sm font-medium text-green-600">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Client Satisfaction</span>
                <span className="text-sm font-medium text-green-600">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Investor Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Investor Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedInvestor?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedInvestor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium">{selectedInvestor.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedInvestor.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="font-medium">{selectedInvestor.phone}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="font-medium">{selectedInvestor.type}</p>
                </div>
                <div>
                  <Label>Total Investment</Label>
                  <p className="font-medium">{formatCurrency(selectedInvestor.totalInvestment)}</p>
                </div>
                <div>
                  <Label>Current Value</Label>
                  <p className="font-medium">{formatCurrency(selectedInvestor.currentValue)}</p>
                </div>
                <div>
                  <Label>Total Return</Label>
                  <p className="font-medium">{formatPercentage(selectedInvestor.totalReturn)}</p>
                </div>
                <div>
                  <Label>Risk Profile</Label>
                  <p className="font-medium">{selectedInvestor.riskProfile}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Investor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedInvestor?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorPortalPage; 