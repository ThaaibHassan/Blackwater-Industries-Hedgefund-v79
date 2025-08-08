import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  FileText,
  Activity,
  DollarSign,
  Globe,
  Layers,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Settings,
  Clock,
  Zap,
  Target,
  ArrowUpDown,
  Play,
  Pause,
  RefreshCw,
  Send,
  CheckSquare,
  Square,
  AlertOctagon,
  Info,
  Timer,
  Users,
  Building2,
  Route,
  Gauge,
  TrendingUpIcon,
  TrendingDownIcon,
  User as UserIcon,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Key,
  Shield as ShieldIcon,
  Activity as ActivityIcon,
  LogOut,
  LogIn,
  Monitor,
  Smartphone,
  Globe as GlobeIcon,
  Database,
  FileText as FileTextIcon,
  Settings as SettingsIcon,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserPermission, Role, User } from '@/types';

// Mock user management data
const mockUsers: User[] = [
  {
    uid: '1',
    email: 'john.smith@blackwater.com',
    displayName: 'John Smith',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'manager',
    permissions: ['portfolio:view', 'portfolio:edit', 'trades:view', 'trades:edit', 'reports:view'],
    createdAt: new Date('2023-01-15T00:00:00Z'),
    lastLoginAt: new Date('2024-01-15T09:30:00Z'),
    isActive: true,
    twoFactorEnabled: true
  },
  {
    uid: '2',
    email: 'sarah.johnson@blackwater.com',
    displayName: 'Sarah Johnson',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'analyst',
    permissions: ['portfolio:view', 'research:view', 'research:edit', 'reports:view'],
    createdAt: new Date('2023-03-20T00:00:00Z'),
    lastLoginAt: new Date('2024-01-15T08:45:00Z'),
    isActive: true,
    twoFactorEnabled: false
  },
  {
    uid: '3',
    email: 'mike.chen@blackwater.com',
    displayName: 'Mike Chen',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'investor',
    permissions: ['portfolio:view', 'reports:view'],
    createdAt: new Date('2023-06-10T00:00:00Z'),
    lastLoginAt: new Date('2024-01-14T16:20:00Z'),
    isActive: true,
    twoFactorEnabled: true
  },
  {
    uid: '4',
    email: 'lisa.garcia@blackwater.com',
    displayName: 'Lisa Garcia',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'compliance',
    permissions: ['compliance:view', 'compliance:edit', 'reports:view', 'users:view'],
    createdAt: new Date('2023-02-05T00:00:00Z'),
    lastLoginAt: new Date('2024-01-15T07:15:00Z'),
    isActive: true,
    twoFactorEnabled: true
  },
  {
    uid: '5',
    email: 'david.brown@blackwater.com',
    displayName: 'David Brown',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    permissions: ['portfolio:view', 'portfolio:edit', 'portfolio:delete', 'trades:view', 'trades:edit', 'trades:delete', 'users:view', 'users:edit', 'users:delete', 'settings:view', 'settings:edit'],
    createdAt: new Date('2022-11-15T00:00:00Z'),
    lastLoginAt: new Date('2024-01-15T10:00:00Z'),
    isActive: true,
    twoFactorEnabled: true
  }
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access and control',
    permissions: ['portfolio:view', 'portfolio:edit', 'portfolio:delete', 'trades:view', 'trades:edit', 'trades:delete', 'users:view', 'users:edit', 'users:delete', 'settings:view', 'settings:edit'],
    isSystem: true,
    createdAt: new Date('2022-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '2',
    name: 'Portfolio Manager',
    description: 'Portfolio management and trading access',
    permissions: ['portfolio:view', 'portfolio:edit', 'trades:view', 'trades:edit', 'reports:view', 'reports:generate'],
    isSystem: true,
    createdAt: new Date('2022-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '3',
    name: 'Research Analyst',
    description: 'Research and analysis access',
    permissions: ['portfolio:view', 'research:view', 'research:edit', 'reports:view'],
    isSystem: true,
    createdAt: new Date('2022-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '4',
    name: 'Investor',
    description: 'Read-only access to portfolio and reports',
    permissions: ['portfolio:view', 'reports:view'],
    isSystem: true,
    createdAt: new Date('2022-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '5',
    name: 'Compliance Officer',
    description: 'Compliance monitoring and reporting access',
    permissions: ['compliance:view', 'compliance:edit', 'reports:view', 'users:view'],
    isSystem: true,
    createdAt: new Date('2022-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  }
];

const mockUserPermissions: UserPermission[] = [
  {
    id: '1',
    userId: '1',
    resource: 'portfolio',
    action: 'edit',
    conditions: {
      portfolioIds: ['tech-fund', 'growth-fund'],
      maxAmount: 1000000
    },
    scope: {
      portfolios: ['tech-fund', 'growth-fund'],
      assetClasses: ['equity', 'fixed_income']
    },
    expiresAt: new Date('2024-12-31T23:59:59Z'),
    createdAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '2',
    userId: '2',
    resource: 'research',
    action: 'edit',
    conditions: {
      maxFileSize: 10485760, // 10MB
      allowedFileTypes: ['pdf', 'docx', 'xlsx']
    },
    scope: {
      assetClasses: ['equity', 'fixed_income', 'commodities']
    },
    expiresAt: new Date('2024-06-30T23:59:59Z'),
    createdAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '3',
    userId: '3',
    resource: 'portfolio',
    action: 'view',
    conditions: {
      portfolioIds: ['investor-portfolio-123']
    },
    scope: {
      portfolios: ['investor-portfolio-123']
    },
    expiresAt: new Date('2024-12-31T23:59:59Z'),
    createdAt: new Date('2024-01-01T00:00:00Z')
  }
];

const AdvancedUserManagementPage = () => {
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { toast } = useToast();

  const filteredUsers = mockUsers.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && user.isActive) ||
      (selectedStatus === 'inactive' && !user.isActive);
    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'analyst': return 'bg-green-100 text-green-800';
      case 'investor': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getPermissionIcon = (permission: string) => {
    if (permission.includes('portfolio')) return <BarChart3 className="h-3 w-3" />;
    if (permission.includes('trades')) return <Activity className="h-3 w-3" />;
    if (permission.includes('research')) return <FileText className="h-3 w-3" />;
    if (permission.includes('users')) return <Users className="h-3 w-3" />;
    if (permission.includes('reports')) return <FileTextIcon className="h-3 w-3" />;
    if (permission.includes('settings')) return <SettingsIcon className="h-3 w-3" />;
    if (permission.includes('compliance')) return <ShieldIcon className="h-3 w-3" />;
    return <Key className="h-3 w-3" />;
  };

  const handleActivateUser = (userId: string) => {
    toast({
      title: 'User Activated',
      description: `User ${userId} has been activated successfully.`,
    });
  };

  const handleDeactivateUser = (userId: string) => {
    toast({
      title: 'User Deactivated',
      description: `User ${userId} has been deactivated.`,
    });
  };

  const handleResetPassword = (userId: string) => {
    toast({
      title: 'Password Reset',
      description: `Password reset email sent to user ${userId}.`,
    });
  };

  const handleExportReport = () => {
    toast({
      title: 'Report Exported',
      description: 'User management report has been exported successfully.',
    });
  };

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.isActive).length;
  const usersWith2FA = mockUsers.filter(u => u.twoFactorEnabled).length;
  const recentLogins = mockUsers.filter(u => {
    const lastLogin = new Date(u.lastLoginAt);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return lastLogin > oneDayAgo;
  }).length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced User Management</h1>
          <p className="text-muted-foreground">
            Role-based access control and user session management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <UserIcon className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* User Management Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((activeUsers / totalUsers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2FA Enabled</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersWith2FA}</div>
            <p className="text-xs text-muted-foreground">
              {((usersWith2FA / totalUsers) * 100).toFixed(1)}% security rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Logins</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentLogins}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.uid} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'} 
                          alt={user.displayName || 'User'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold">{user.displayName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(user.isActive)}>
                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                      {user.twoFactorEnabled && (
                        <Badge className="bg-blue-100 text-blue-800">
                          2FA
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                      <Eye className="mr-1 h-3 w-3" />
                      Details
                    </Button>
                    {user.isActive ? (
                      <Button size="sm" variant="destructive" onClick={() => handleDeactivateUser(user.uid)}>
                        <UserX className="mr-1 h-3 w-3" />
                        Deactivate
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleActivateUser(user.uid)}>
                        <UserCheck className="mr-1 h-3 w-3" />
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Last Login:</span>
                    <span className="ml-2 font-medium">{formatDate(user.lastLoginAt)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2 font-medium">{formatDate(user.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Permissions:</span>
                    <span className="ml-2 font-medium">{user.permissions.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium">{user.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {user.permissions.slice(0, 5).map((permission, index) => (
                    <div key={index} className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded">
                      {getPermissionIcon(permission)}
                      <span>{permission}</span>
                    </div>
                  ))}
                  {user.permissions.length > 5 && (
                    <div className="text-xs text-muted-foreground px-2 py-1">
                      +{user.permissions.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles Management */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>
            System roles and their associated permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRoles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-semibold">{role.name}</div>
                      <div className="text-sm text-muted-foreground">{role.description}</div>
                    </div>
                    <Badge className={role.isSystem ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                      {role.isSystem ? 'SYSTEM' : 'CUSTOM'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {role.permissions.length} permissions
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {role.permissions.slice(0, 8).map((permission, index) => (
                    <div key={index} className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded">
                      {getPermissionIcon(permission)}
                      <span>{permission}</span>
                    </div>
                  ))}
                  {role.permissions.length > 8 && (
                    <div className="text-xs text-muted-foreground px-2 py-1">
                      +{role.permissions.length - 8} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Monitor user activity and session management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.slice(0, 3).map((user) => (
              <div key={user.uid} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'} 
                        alt={user.displayName || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Monitor className="h-3 w-3" />
                        <span>Desktop</span>
                      </div>
                      <div className="text-xs">Last active: {formatDate(user.lastLoginAt)}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        ONLINE
                      </Badge>
                      <Button size="sm" variant="outline">
                        <LogOut className="mr-1 h-3 w-3" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
          <CardDescription>
            System security metrics and compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">2FA Adoption</span>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{((usersWith2FA / totalUsers) * 100).toFixed(1)}%</div>
              <Progress value={(usersWith2FA / totalUsers) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">{usersWith2FA} of {totalUsers} users</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Failed Logins</span>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-muted-foreground">Last 24 hours</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password Expiry</span>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">2</div>
              <div className="text-xs text-muted-foreground">Users need password reset</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Suspicious Activity</span>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground">No alerts today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedUserManagementPage; 