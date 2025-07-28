// User and Authentication Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
  twoFactorEnabled: boolean;
}

export type UserRole = 'admin' | 'manager' | 'analyst' | 'investor' | 'compliance';

export type Permission = 
  | 'portfolio:view' | 'portfolio:edit' | 'portfolio:delete'
  | 'trades:view' | 'trades:edit' | 'trades:delete'
  | 'research:view' | 'research:edit' | 'research:delete'
  | 'investors:view' | 'investors:edit' | 'investors:delete'
  | 'reports:view' | 'reports:generate' | 'reports:export'
  | 'users:view' | 'users:edit' | 'users:delete'
  | 'settings:view' | 'settings:edit';

// Portfolio Types
export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  managerName: string;
  inceptionDate: Date;
  strategy: InvestmentStrategy;
  riskProfile: RiskProfile;
  targetReturn: number;
  maxDrawdown: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  nav: number;
  totalValue: number;
  cashBalance: number;
  leverage: number;
  fees: FeeStructure;
  performance: PerformanceMetrics;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  name: string;
  side: 'long' | 'short';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  pnlPercent: number;
  weight: number;
  sector: string;
  risk: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt?: Date;
}

export type InvestmentStrategy = 
  | 'long_short_equity'
  | 'global_macro'
  | 'event_driven'
  | 'relative_value'
  | 'managed_futures'
  | 'multi_strategy'
  | 'credit'
  | 'quantitative';

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive' | 'very_aggressive';

export interface FeeStructure {
  managementFee: number; // Annual percentage
  performanceFee: number; // Percentage of profits
  hurdleRate?: number; // Minimum return before performance fee
  highWaterMark: boolean;
  lockupPeriod?: number; // Days
  redemptionNotice?: number; // Days
}

export interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  calmarRatio: number;
  sortinoRatio: number;
  treynorRatio: number;
  trackingError: number;
}

// Trade Types
export interface Trade {
  id: string;
  portfolioId: string;
  symbol: string;
  assetClass: AssetClass;
  side: 'buy' | 'sell' | 'short' | 'cover';
  quantity: number;
  price: number;
  totalValue: number;
  commission: number;
  timestamp: Date;
  status: TradeStatus;
  tags: string[];
  notes?: string;
  screenshots?: string[]; // Firebase Storage URLs
  riskMetrics: TradeRiskMetrics;
  exitTradeId?: string; // For closing trades
  pnl?: number;
  rMultiple?: number;
  strategy?: string;
  analyst?: string;
  type?: 'market' | 'limit' | 'stop';
}

export type AssetClass = 
  | 'equity'
  | 'fixed_income'
  | 'commodities'
  | 'currencies'
  | 'real_estate'
  | 'private_equity'
  | 'cryptocurrency'
  | 'derivatives';

export type TradeStatus = 'pending' | 'executed' | 'cancelled' | 'partial' | 'closed';

export interface TradeRiskMetrics {
  positionSize: number; // Percentage of portfolio
  stopLoss?: number;
  takeProfit?: number;
  riskRewardRatio?: number;
  maxRisk: number; // Dollar amount
}

// Research Types
export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  analystId: string;
  analystName: string;
  assetClass: AssetClass;
  symbol: string;
  symbols: string[];
  tags: string[];
  status: ResearchStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  attachments: Attachment[];
  version: number;
  isPublic: boolean;
  recommendation?: 'buy' | 'sell' | 'hold';
}

export type ResearchStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'excel' | 'word' | 'presentation';
  size: number;
  uploadedAt: Date;
}

// Investor Types
export interface Investor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: InvestorType;
  status: InvestorStatus;
  totalCommitment: number;
  currentBalance: number;
  totalInvestment: number;
  currentValue: number;
  totalReturn: number;
  riskProfile: RiskProfile;
  joinDate: Date;
  inceptionDate: Date;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'verified';
  documents: InvestorDocument[];
  notes?: string;
  assignedManager: string;
  createdAt: Date;
  updatedAt: Date;
  allocatedAmount?: number;
  unallocatedAmount?: number;
  lastContact?: string;
}

export type InvestorType = 'individual' | 'institutional' | 'family_office' | 'fund_of_funds';
export type InvestorStatus = 'prospect' | 'qualified' | 'committed' | 'active' | 'inactive';

export interface InvestorDocument {
  id: string;
  name: string;
  type: 'kyc' | 'subscription' | 'k1' | 'statement' | 'other';
  url: string;
  uploadedAt: Date;
  expiresAt?: Date;
}

// Fundraising Types
export interface FundraisingPipeline {
  id: string;
  investorId: string;
  investorName: string;
  stage: FundraisingStage;
  targetCommitment: number;
  probability: number; // 0-100
  expectedCloseDate: Date;
  assignedManager: string;
  notes?: string;
  activities: FundraisingActivity[];
  createdAt: Date;
  updatedAt: Date;
}

export type FundraisingStage = 
  | 'initial_contact'
  | 'qualification'
  | 'presentation'
  | 'due_diligence'
  | 'negotiation'
  | 'closing'
  | 'closed_won'
  | 'closed_lost';

export interface FundraisingActivity {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'presentation' | 'document_sent';
  description: string;
  date: Date;
  outcome?: string;
  nextSteps?: string;
}

// Reporting Types
export interface Report {
  id: string;
  name: string;
  type: ReportType;
  portfolioId?: string;
  investorId?: string;
  template: ReportTemplate;
  data: Record<string, any>;
  status: ReportStatus;
  generatedAt: Date;
  expiresAt?: Date;
  downloadUrl?: string;
  recipients: string[];
}

export type ReportType = 
  | 'monthly_statement'
  | 'quarterly_report'
  | 'annual_report'
  | 'k1_tax_document'
  | 'performance_attribution'
  | 'risk_report'
  | 'custom';

export type ReportStatus = 'draft' | 'generating' | 'completed' | 'sent' | 'failed';

export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  sections: ReportSection[];
  styling: ReportStyling;
}

export interface ReportSection {
  id: string;
  name: string;
  type: 'text' | 'chart' | 'table' | 'metrics' | 'image';
  dataSource?: string;
  content?: string;
  order: number;
}

export interface ReportStyling {
  theme: 'light' | 'dark' | 'corporate';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
}

// Compliance Types
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  type: ComplianceRuleType;
  conditions: ComplianceCondition[];
  actions: ComplianceAction[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ComplianceRuleType = 
  | 'position_limit'
  | 'concentration_limit'
  | 'risk_limit'
  | 'trading_restriction'
  | 'document_requirement';

export interface ComplianceCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: any;
}

export interface ComplianceAction {
  type: 'alert' | 'block' | 'require_approval' | 'auto_sell';
  message: string;
  recipients: string[];
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: WorkflowType;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkflowType = 
  | 'trade_approval'
  | 'research_review'
  | 'investor_onboarding'
  | 'compliance_check'
  | 'report_generation';

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'automation' | 'condition';
  assignee?: string;
  assigneeRole?: UserRole;
  order: number;
  isRequired: boolean;
  timeout?: number; // Hours
  actions: WorkflowAction[];
}

export interface WorkflowAction {
  type: 'approve' | 'reject' | 'notify' | 'escalate' | 'auto_approve';
  conditions?: Record<string, any>;
  recipients?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId: string;
  assigneeName: string;
  dueDate: Date;
  completedAt?: Date;
  relatedEntity?: {
    type: 'portfolio' | 'trade' | 'investor' | 'research' | 'report';
    id: string;
  };
  checklist: TaskItem[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskType = 
  | 'trade_review'
  | 'research_analysis'
  | 'investor_meeting'
  | 'compliance_check'
  | 'report_preparation'
  | 'document_review'
  | 'follow_up'
  | 'custom';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';

export interface TaskItem {
  id: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  provider: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  lastSyncAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IntegrationType = 
  | 'data_feed'
  | 'email_sync'
  | 'calendar_sync'
  | 'document_storage'
  | 'trading_platform'
  | 'risk_system'
  | 'accounting_system';

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: Date;
  createdAt: Date;
}

export type NotificationType = 
  | 'trade_executed'
  | 'portfolio_alert'
  | 'compliance_violation'
  | 'report_ready'
  | 'task_assigned'
  | 'investor_update'
  | 'system_alert';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'multiselect' | 'date' | 'textarea' | 'file';
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: Record<string, any>;
  placeholder?: string;
  helpText?: string;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
}

// Dashboard Types
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'list' | 'gauge';
  title: string;
  dataSource: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isVisible: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  userId: string;
  role: UserRole;
  widgets: DashboardWidget[];
  layout: 'grid' | 'flexible';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Watchlist Types
export interface WatchlistAsset {
  symbol: string;
  name: string;
  tags?: string[];
  [key: string]: any; // For custom columns
}

export interface WatchlistColumn {
  id: string;
  label: string;
  field: string;
  visible: boolean;
}

export interface Watchlist {
  id: string;
  name: string;
  userId: string;
  assets: WatchlistAsset[];
  columns: WatchlistColumn[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
} 