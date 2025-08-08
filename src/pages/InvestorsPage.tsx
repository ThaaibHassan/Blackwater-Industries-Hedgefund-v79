import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  Target,
  AlertTriangle
} from 'lucide-react';
import { useData } from '@/context/DataContext';

const InvestorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddingInvestor, setIsAddingInvestor] = useState(false);
  const [editingInvestorId, setEditingInvestorId] = useState<string | null>(null);
  const [newInvestor, setNewInvestor] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'individual',
    totalCommitment: 0,
    assignedManager: ''
  });
  const { toast } = useToast();
  const { investors, addInvestor, updateInvestor, deleteInvestor } = useData();

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = (investor.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (investor.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || investor.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalCommitments = investors.reduce((sum, inv) => sum + inv.totalCommitment, 0);
  const activeInvestors = investors.filter(inv => inv.status === 'active').length;

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

  const handleViewInvestor = (investor: any) => {
    setSelectedInvestor(selectedInvestor?.id === investor.id ? null : investor);
  };

  const handleSendEmail = (investor: any) => {
    const subject = encodeURIComponent('Investment Update - Blackwater Industries');
    const body = encodeURIComponent(`Dear ${investor.name},\n\nThank you for your investment with Blackwater Industries.\n\nCurrent Balance: $${investor.currentBalance.toLocaleString()}\nTotal Commitment: $${investor.totalCommitment.toLocaleString()}\n\nBest regards,\nBlackwater Industries Team`);
    window.open(`mailto:${investor.email}?subject=${subject}&body=${body}`);
    toast({
      title: "Email Client Opened",
      description: `Email client opened for ${investor.name}`,
    });
  };

  const handleCallInvestor = (investor: any) => {
    window.open(`tel:${investor.phone}`);
    toast({
      title: "Call Initiated",
      description: `Calling ${investor.name} at ${investor.phone}`,
    });
  };

  const handleDeleteInvestor = (investor: any) => {
    if (confirm(`Are you sure you want to delete ${investor.name}? This action cannot be undone.`)) {
      toast({
        title: "Investor Deleted",
        description: `${investor.name} has been removed from the system.`,
      });
    }
  };

  const handleScheduleMeeting = (deal: any) => {
    const eventTitle = encodeURIComponent(`Meeting - ${deal.investorName}`);
    const eventDetails = encodeURIComponent(`Investment discussion with ${deal.investorName}\nTarget Commitment: $${deal.targetCommitment.toLocaleString()}\nStage: ${deal.stage.replace('_', ' ')}`);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
    
    window.open(googleCalendarUrl, '_blank');
    toast({
      title: "Calendar Event Created",
      description: `Meeting scheduled with ${deal.investorName}`,
    });
  };

  const handleAddInvestor = () => {
    setIsAddingInvestor(true);
    setEditingInvestorId(null);
    setNewInvestor({
      name: '',
      email: '',
      phone: '',
      type: 'individual',
      totalCommitment: 0,
      assignedManager: ''
    });
  };

  const handleSaveInvestor = () => {
    if (newInvestor.name && newInvestor.email && newInvestor.phone) {
      const investorData = {
        name: newInvestor.name,
        email: newInvestor.email,
        phone: newInvestor.phone,
        type: newInvestor.type as 'individual' | 'institutional' | 'family_office' | 'fund_of_funds',
        status: 'prospect' as const,
        totalCommitment: newInvestor.totalCommitment,
        totalInvestment: 0,
        currentValue: 0,
        totalReturn: 0,
        riskProfile: 'moderate' as const,
        joinDate: new Date(),
        inceptionDate: new Date(),
        kycStatus: 'pending' as const,
        documents: [],
        assignedManager: newInvestor.assignedManager,
        updatedAt: new Date()
      };
      
      addInvestor(investorData);
      toast({
        title: "Investor Added",
        description: `${newInvestor.name} has been added to the system.`,
      });
      setIsAddingInvestor(false);
      setNewInvestor({
        name: '',
        email: '',
        phone: '',
        type: 'individual',
        totalCommitment: 0,
        assignedManager: ''
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleEditInvestor = (investor: any) => {
    setNewInvestor({
      name: investor.name,
      email: investor.email,
      phone: investor.phone,
      type: investor.type,
      totalCommitment: investor.totalCommitment,
      assignedManager: investor.assignedManager
    });
    setEditingInvestorId(investor.id.toString());
    setIsAddingInvestor(true);
  };

  const handleUpdateInvestor = () => {
    if (newInvestor.name && newInvestor.email && newInvestor.phone) {
      // In a real app, this would call an API
      toast({
        title: "Investor Updated",
        description: `${newInvestor.name} has been updated.`,
      });
      setIsAddingInvestor(false);
      setEditingInvestorId(null);
      setNewInvestor({
        name: '',
        email: '',
        phone: '',
        type: 'individual',
        totalCommitment: 0,
        assignedManager: ''
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleCancelForm = () => {
    setIsAddingInvestor(false);
    setEditingInvestorId(null);
    setNewInvestor({
      name: '',
      email: '',
      phone: '',
      type: 'individual',
      totalCommitment: 0,
      assignedManager: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investor Management</h1>
          <p className="text-muted-foreground">
            Manage investor relationships and pipeline
          </p>
        </div>
        <Button onClick={handleAddInvestor} disabled={isAddingInvestor}>
          <Plus className="mr-2 h-4 w-4" />
          Add Investor
        </Button>
      </div>

      {/* INLINE INVESTOR FORM */}
      {isAddingInvestor && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingInvestorId ? 'Edit Investor' : 'Add New Investor'}
              <Button variant="ghost" size="sm" onClick={handleCancelForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Investor Name *</Label>
                  <Input
                    id="name"
                    value={newInvestor.name}
                    onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                    placeholder="Enter investor name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newInvestor.email}
                    onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })}
                    placeholder="Enter email address"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={newInvestor.phone}
                    onChange={(e) => setNewInvestor({ ...newInvestor, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Investor Type</Label>
                  <Select value={newInvestor.type} onValueChange={(value) => setNewInvestor({ ...newInvestor, type: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="commitment">Total Commitment</Label>
                  <Input
                    id="commitment"
                    type="number"
                    value={newInvestor.totalCommitment}
                    onChange={(e) => setNewInvestor({ ...newInvestor, totalCommitment: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter amount"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="manager">Assigned Manager</Label>
                <Input
                  id="manager"
                  value={newInvestor.assignedManager}
                  onChange={(e) => setNewInvestor({ ...newInvestor, assignedManager: e.target.value })}
                  placeholder="Enter assigned manager"
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button onClick={editingInvestorId ? handleUpdateInvestor : handleSaveInvestor} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {editingInvestorId ? 'Update Investor' : 'Add Investor'}
                </Button>
                <Button variant="outline" onClick={handleCancelForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <CardTitle className="text-sm font-medium">Allocated Funds</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(investors.reduce((sum, inv) => sum + (inv.allocatedAmount || 0), 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              In active investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unallocated Funds</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${(investors.reduce((sum, inv) => sum + (inv.unallocatedAmount || 0), 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Pending allocation
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="px-3 py-2 border rounded-md text-sm w-48">
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
                    <div className="text-xs text-muted-foreground">
                      ${((investor.allocatedAmount || 0) / 1000000).toFixed(1)}M allocated
                    </div>
                    {(investor.unallocatedAmount || 0) > 0 && (
                      <div className="text-xs text-orange-600">
                        ${((investor.unallocatedAmount || 0) / 1000000).toFixed(1)}M unallocated
                      </div>
                    )}
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSendEmail(investor)}
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCallInvestor(investor)}
                      title="Call Investor"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewInvestor(investor)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteInvestor(investor)}
                      title="Delete Investor"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
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
            {investors.map((deal: any) => (
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
                    <div className="font-medium">${(deal.totalCommitment / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">Total Commitment</div>
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
                    {deal.stage ? (
                      <span className={`px-2 py-1 rounded text-xs ${getStageColor(deal.stage)}`}>
                        {deal.stage.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground">N/A</span>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleScheduleMeeting(deal)}
                      title="Schedule Meeting"
                    >
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
                  <Label>Type</Label>
                  <p className="font-medium">{selectedInvestor.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="font-medium">{selectedInvestor.status}</p>
                </div>
                <div>
                  <Label>Total Commitment</Label>
                  <p className="font-medium">${(selectedInvestor.totalCommitment / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <Label>Current Balance</Label>
                  <p className="font-medium">${(selectedInvestor.currentBalance / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <Label>KYC Status</Label>
                  <p className="font-medium">{selectedInvestor.kycStatus}</p>
                </div>
                <div>
                  <Label>Assigned Manager</Label>
                  <p className="font-medium">{selectedInvestor.assignedManager}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Investor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Investor</DialogTitle>
            <DialogDescription>
              Edit investor details and commitments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Add investor editing form here */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Investor Dialog */}
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
            <Button variant="destructive" onClick={handleDeleteInvestor}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorsPage; 