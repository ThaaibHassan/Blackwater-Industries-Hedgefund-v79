import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  DollarSign,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Building,
  User,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const InvestorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Mock investor data
  const investors = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      type: 'individual',
      status: 'active',
      totalCommitment: 5000000,
      currentBalance: 4850000,
      inceptionDate: '2023-01-15',
      kycStatus: 'approved',
      assignedManager: 'Sarah Johnson',
      lastContact: '2024-01-20'
    },
    {
      id: '2',
      name: 'Acme Capital Partners',
      email: 'investments@acmecapital.com',
      phone: '+1 (555) 987-6543',
      type: 'institutional',
      status: 'active',
      totalCommitment: 25000000,
      currentBalance: 24250000,
      inceptionDate: '2022-06-10',
      kycStatus: 'approved',
      assignedManager: 'Mike Chen',
      lastContact: '2024-01-25'
    },
    {
      id: '3',
      name: 'Family Office XYZ',
      email: 'ci@familyofficexyz.com',
      phone: '+1 (555) 456-7890',
      type: 'family_office',
      status: 'prospect',
      totalCommitment: 0,
      currentBalance: 0,
      inceptionDate: null,
      kycStatus: 'pending',
      assignedManager: 'John Smith',
      lastContact: '2024-01-28'
    }
  ];

  const pipeline = [
    {
      id: '1',
      investorName: 'Tech Ventures Fund',
      stage: 'due_diligence',
      targetCommitment: 15000000,
      probability: 75,
      expectedCloseDate: '2024-03-15',
      assignedManager: 'Sarah Johnson',
      lastActivity: '2024-01-29'
    },
    {
      id: '2',
      investorName: 'Pension Fund ABC',
      stage: 'presentation',
      targetCommitment: 50000000,
      probability: 60,
      expectedCloseDate: '2024-04-30',
      assignedManager: 'Mike Chen',
      lastActivity: '2024-01-27'
    }
  ];

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || investor.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalCommitments = investors.reduce((sum, inv) => sum + inv.totalCommitment, 0);
  const activeInvestors = investors.filter(inv => inv.status === 'active').length;
  const prospects = investors.filter(inv => inv.status === 'prospect').length;
  const pipelineValue = pipeline.reduce((sum, p) => sum + p.targetCommitment, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'prospect': return 'bg-warning/10 text-warning';
      case 'inactive': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'closing': return 'bg-success/10 text-success';
      case 'due_diligence': return 'bg-warning/10 text-warning';
      case 'presentation': return 'bg-primary/10 text-primary';
      case 'qualification': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investor Management</h1>
          <p className="text-muted-foreground">
            Manage investor relationships and fundraising pipeline
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Investor
        </Button>
      </div>

      {/* Investor Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commitments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalCommitments / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              From {investors.length} investors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInvestors}</div>
            <p className="text-xs text-muted-foreground">
              Currently invested
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prospects}</div>
            <p className="text-xs text-muted-foreground">
              In pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(pipelineValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Potential commitments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Investors List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Investors</CardTitle>
              <CardDescription>All investor contacts and commitments</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="institutional">Institutional</option>
                <option value="family_office">Family Office</option>
                <option value="fund_of_funds">Fund of Funds</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvestors.map((investor) => (
              <div key={investor.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-lg">{investor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {investor.type.replace('_', ' ')} • {investor.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">${(investor.totalCommitment / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">Total Commitment</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">${(investor.currentBalance / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">Current Balance</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(investor.status)}`}>
                      {investor.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      investor.kycStatus === 'approved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {investor.kycStatus}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Manager: {investor.assignedManager}</span>
                    <span>Last Contact: {investor.lastContact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fundraising Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Fundraising Pipeline</CardTitle>
          <CardDescription>Active fundraising opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipeline.map((deal) => (
              <div key={deal.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-lg">{deal.investorName}</div>
                      <div className="text-sm text-muted-foreground">
                        Manager: {deal.assignedManager} • Last Activity: {deal.lastActivity}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">${(deal.targetCommitment / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">Target</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">{deal.probability}%</div>
                    <div className="text-sm text-muted-foreground">Probability</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">{deal.expectedCloseDate}</div>
                    <div className="text-sm text-muted-foreground">Expected Close</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStageColor(deal.stage)}`}>
                      {deal.stage.replace('_', ' ')}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
            <CardDescription>Fundraising pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Pipeline stage chart</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investor Distribution</CardTitle>
            <CardDescription>Investors by type and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Investor distribution chart</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorsPage; 