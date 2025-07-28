import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Investor, 
  ResearchNote, 
  Trade, 
  Task, 
  PortfolioPosition 
} from '@/types';

interface Workflow {
  id: string;
  title: string;
  status: 'completed' | 'in_progress';
  assignee: string;
  completedAt?: string;
  startedAt?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DataContextType {
  // State
  tasks: Task[];
  investors: Investor[];
  portfolioPositions: PortfolioPosition[];
  researchNotes: ResearchNote[];
  trades: Trade[];
  workflows: Workflow[];
  
  // Task actions
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  startTask: (id: string) => Promise<void>;
  
  // Investor actions
  addInvestor: (investor: Omit<Investor, 'id' | 'currentBalance' | 'createdAt'>) => Promise<void>;
  updateInvestor: (id: string, updates: Partial<Investor>) => Promise<void>;
  deleteInvestor: (id: string) => Promise<void>;
  
  // Portfolio actions
  addPosition: (position: Omit<PortfolioPosition, 'id' | 'marketValue' | 'unrealizedPnl' | 'pnlPercent' | 'createdAt'>) => Promise<void>;
  updatePosition: (id: string, updates: Partial<PortfolioPosition>) => Promise<void>;
  deletePosition: (id: string) => Promise<void>;
  
  // Research actions
  addResearchNote: (note: Omit<ResearchNote, 'id' | 'rating' | 'views' | 'createdAt'>) => Promise<void>;
  updateResearchNote: (id: string, updates: Partial<ResearchNote>) => Promise<void>;
  deleteResearchNote: (id: string) => Promise<void>;
  rateResearchNote: (id: string, rating: number) => Promise<void>;
  
  // Trade actions
  addTrade: (trade: Omit<Trade, 'id' | 'totalValue' | 'pnl' | 'createdAt'>) => Promise<void>;
  updateTrade: (id: string, updates: Partial<Trade>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  approveTrade: (id: string) => Promise<void>;
  rejectTrade: (id: string) => Promise<void>;
  
  // Workflow actions
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt'>) => Promise<void>;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  
  // Analytics
  getPortfolioStats: () => {
    totalValue: number;
    totalPnl: number;
    totalPnlPercent: number;
    positions: number;
  };
  getTaskStats: () => {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  getInvestorStats: () => {
    total: number;
    active: number;
    totalCommitments: number;
    totalBalance: number;
    totalAllocated: number;
    totalUnallocated: number;
    allocationPercentage: number;
  };
  getTradeStats: () => {
    total: number;
    executed: number;
    pending: number;
    totalValue: number;
    totalPnl: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Mock data state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review Q4 Portfolio Performance',
      description: 'Analyze portfolio performance and prepare quarterly report',
      type: 'report_preparation',
      status: 'pending',
      priority: 'high',
      assigneeId: 'user1',
      assigneeName: 'John Smith',
      dueDate: new Date('2024-01-15'),
      checklist: [
        { id: '1', description: 'Calculate returns', isCompleted: false },
        { id: '2', description: 'Risk analysis', isCompleted: false },
        { id: '3', description: 'Prepare charts', isCompleted: false }
      ],
      tags: ['portfolio', 'reporting'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      title: 'Approve New Trade Strategy',
      description: 'Review and approve the new algorithmic trading strategy',
      type: 'trade_review',
      status: 'in_progress',
      priority: 'urgent',
      assigneeId: 'user2',
      assigneeName: 'Sarah Johnson',
      dueDate: new Date('2024-01-10'),
      checklist: [
        { id: '1', description: 'Strategy review', isCompleted: true },
        { id: '2', description: 'Risk assessment', isCompleted: false },
        { id: '3', description: 'Compliance check', isCompleted: false }
      ],
      tags: ['trading', 'strategy'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ]);

  const [investors, setInvestors] = useState<Investor[]>([
    {
      id: '1',
      name: 'Acme Capital Partners',
      email: 'contact@acmecapital.com',
      phone: '+1-555-0123',
      type: 'institutional',
      status: 'active',
      totalCommitment: 5000000,
      currentBalance: 5000000,
      totalInvestment: 4500000,
      currentValue: 4850000,
      totalReturn: 7.8,
      riskProfile: 'moderate',
      joinDate: new Date('2023-01-15'),
      inceptionDate: new Date('2023-01-15'),
      kycStatus: 'approved',
      documents: [],
      assignedManager: 'John Smith',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Smith Family Office',
      email: 'investments@smithfamily.com',
      phone: '+1-555-0456',
      type: 'family_office',
      status: 'active',
      totalCommitment: 2500000,
      currentBalance: 2500000,
      totalInvestment: 2200000,
      currentValue: 2350000,
      totalReturn: 6.8,
      riskProfile: 'conservative',
      joinDate: new Date('2023-03-20'),
      inceptionDate: new Date('2023-03-20'),
      kycStatus: 'approved',
      documents: [],
      assignedManager: 'Sarah Johnson',
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2024-01-01')
    }
  ]);

  const [portfolioPositions, setPortfolioPositions] = useState<PortfolioPosition[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      side: 'long',
      quantity: 1000,
      avgPrice: 150.00,
      currentPrice: 175.50,
      marketValue: 175500,
      unrealizedPnl: 25500,
      pnlPercent: 17.0,
      weight: 15.2,
      sector: 'Technology',
      risk: 'medium',
      createdAt: new Date('2023-06-15')
    },
    {
      id: '2',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      side: 'long',
      quantity: 800,
      avgPrice: 280.00,
      currentPrice: 320.75,
      marketValue: 256600,
      unrealizedPnl: 32600,
      pnlPercent: 14.5,
      weight: 22.1,
      sector: 'Technology',
      risk: 'medium',
      createdAt: new Date('2023-05-10')
    }
  ]);

  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([
    {
      id: '1',
      title: 'Apple Q4 Earnings Analysis',
      content: 'Comprehensive analysis of Apple\'s Q4 earnings report and future outlook.',
      analystId: 'analyst1',
      analystName: 'Michael Chen',
      assetClass: 'equity',
      symbol: 'AAPL',
      symbols: ['AAPL'],
      tags: ['earnings', 'technology', 'analysis'],
      status: 'published',
      priority: 'high',
      recommendation: 'buy',
      dueDate: new Date('2024-01-20'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      attachments: [],
      version: 1,
      isPublic: true
    },
    {
      id: '2',
      title: 'Microsoft Cloud Growth Prospects',
      content: 'Analysis of Microsoft\'s cloud business growth and competitive position.',
      analystId: 'analyst2',
      analystName: 'Lisa Rodriguez',
      assetClass: 'equity',
      symbol: 'MSFT',
      symbols: ['MSFT'],
      tags: ['cloud', 'technology', 'growth'],
      status: 'published',
      priority: 'medium',
      recommendation: 'hold',
      dueDate: new Date('2024-01-25'),
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      attachments: [],
      version: 1,
      isPublic: true
    }
  ]);

  const [trades, setTrades] = useState<Trade[]>([
    {
      id: '1',
      portfolioId: 'portfolio1',
      symbol: 'AAPL',
      assetClass: 'equity',
      side: 'buy',
      quantity: 500,
      price: 150.00,
      totalValue: 75000,
      commission: 25,
      timestamp: new Date('2024-01-05'),
      status: 'executed',
      tags: ['technology', 'long'],
      riskMetrics: {
        positionSize: 5.2,
        maxRisk: 7500
      },
      pnl: 12750
    },
    {
      id: '2',
      portfolioId: 'portfolio1',
      symbol: 'MSFT',
      assetClass: 'equity',
      side: 'buy',
      quantity: 300,
      price: 280.00,
      totalValue: 84000,
      commission: 30,
      timestamp: new Date('2024-01-06'),
      status: 'executed',
      tags: ['technology', 'long'],
      riskMetrics: {
        positionSize: 7.2,
        maxRisk: 8400
      },
      pnl: 12225
    }
  ]);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      title: 'Q4 Portfolio Review',
      status: 'completed',
      assignee: 'John Smith',
      completedAt: '2024-01-15',
      startedAt: '2024-01-01',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'New Strategy Implementation',
      status: 'in_progress',
      assignee: 'Sarah Johnson',
      startedAt: '2024-01-10',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    }
  ]);

  // Task actions
  const addTask = async (task: Task) => {
    const newTask = { ...task, id: Date.now().toString() };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = async (task: Task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completeTask = async (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: 'completed' as const, completedAt: new Date() }
        : t
    ));
  };

  const startTask = async (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: 'in_progress' as const }
        : t
    ));
  };

  // Investor actions
  const addInvestor = async (investorData: Omit<Investor, 'id' | 'currentBalance' | 'createdAt'>) => {
    const newInvestor: Investor = {
      ...investorData,
      id: Date.now().toString(),
      currentBalance: investorData.totalCommitment,
      createdAt: new Date()
    };
    setInvestors(prev => [...prev, newInvestor]);
  };

  const updateInvestor = async (id: string, updates: Partial<Investor>) => {
    setInvestors(prev => prev.map(i => 
      i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i
    ));
  };

  const deleteInvestor = async (id: string) => {
    setInvestors(prev => prev.filter(i => i.id !== id));
  };

  // Portfolio actions
  const addPosition = async (positionData: Omit<PortfolioPosition, 'id' | 'marketValue' | 'unrealizedPnl' | 'pnlPercent' | 'createdAt'>) => {
    const marketValue = positionData.quantity * positionData.currentPrice;
    const unrealizedPnl = (positionData.currentPrice - positionData.avgPrice) * positionData.quantity;
    const pnlPercent = (unrealizedPnl / (positionData.avgPrice * positionData.quantity)) * 100;
    
    const newPosition: PortfolioPosition = {
      ...positionData,
      id: Date.now().toString(),
      marketValue,
      unrealizedPnl,
      pnlPercent,
      createdAt: new Date()
    };
    setPortfolioPositions(prev => [...prev, newPosition]);
  };

  const updatePosition = async (id: string, updates: Partial<PortfolioPosition>) => {
    setPortfolioPositions(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const deletePosition = async (id: string) => {
    setPortfolioPositions(prev => prev.filter(p => p.id !== id));
  };

  // Research actions
  const addResearchNote = async (noteData: Omit<ResearchNote, 'id' | 'rating' | 'views' | 'createdAt'>) => {
    const newNote: ResearchNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setResearchNotes(prev => [...prev, newNote]);
  };

  const updateResearchNote = async (id: string, updates: Partial<ResearchNote>) => {
    setResearchNotes(prev => prev.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
    ));
  };

  const deleteResearchNote = async (id: string) => {
    setResearchNotes(prev => prev.filter(n => n.id !== id));
  };

  const rateResearchNote = async (id: string, rating: number) => {
    setResearchNotes(prev => prev.map(n => 
      n.id === id ? { ...n, rating } : n
    ));
  };

  // Trade actions
  const addTrade = async (tradeData: Omit<Trade, 'id' | 'totalValue' | 'pnl' | 'createdAt'>) => {
    const totalValue = tradeData.quantity * tradeData.price;
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString(),
      totalValue,
      pnl: 0,
      timestamp: new Date()
    };
    setTrades(prev => [...prev, newTrade]);
  };

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    setTrades(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const deleteTrade = async (id: string) => {
    setTrades(prev => prev.filter(t => t.id !== id));
  };

  const approveTrade = async (id: string) => {
    setTrades(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'executed' as const } : t
    ));
  };

  const rejectTrade = async (id: string) => {
    setTrades(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'cancelled' as const } : t
    ));
  };

  // Workflow actions
  const addWorkflow = async (workflowData: Omit<Workflow, 'id' | 'createdAt'>) => {
    const newWorkflow: Workflow = {
      ...workflowData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setWorkflows(prev => [...prev, newWorkflow]);
  };

  const updateWorkflow = async (id: string, updates: Partial<Workflow>) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, ...updates, updatedAt: new Date() } : w
    ));
  };

  const deleteWorkflow = async (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  // Analytics
  const getPortfolioStats = () => {
    const totalValue = portfolioPositions.reduce((sum, p) => sum + p.marketValue, 0);
    const totalPnl = portfolioPositions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
    const totalPnlPercent = totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0;
    
    return {
      totalValue,
      totalPnl,
      totalPnlPercent,
      positions: portfolioPositions.length
    };
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
  };

  const getInvestorStats = () => {
    const total = investors.length;
    const active = investors.filter(i => i.status === 'active').length;
    const totalCommitments = investors.reduce((sum, i) => sum + i.totalCommitment, 0);
    const totalBalance = investors.reduce((sum, i) => sum + i.currentBalance, 0);
    const totalAllocated = investors.reduce((sum, i) => sum + (i.totalInvestment || 0), 0);
    const totalUnallocated = totalCommitments - totalAllocated;
    const allocationPercentage = totalCommitments > 0 ? (totalAllocated / totalCommitments) * 100 : 0;
    
    return {
      total,
      active,
      totalCommitments,
      totalBalance,
      totalAllocated,
      totalUnallocated,
      allocationPercentage
    };
  };

  const getTradeStats = () => {
    return {
      total: trades.length,
      executed: trades.filter(t => t.status === 'executed').length,
      pending: trades.filter(t => t.status === 'pending').length,
      totalValue: trades.reduce((sum, t) => sum + t.totalValue, 0),
      totalPnl: trades.reduce((sum, t) => sum + (t.pnl || 0), 0)
    };
  };

  const value: DataContextType = {
    tasks,
    investors,
    portfolioPositions,
    researchNotes,
    trades,
    workflows,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    startTask,
    addInvestor,
    updateInvestor,
    deleteInvestor,
    addPosition,
    updatePosition,
    deletePosition,
    addResearchNote,
    updateResearchNote,
    deleteResearchNote,
    rateResearchNote,
    addTrade,
    updateTrade,
    deleteTrade,
    approveTrade,
    rejectTrade,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    getPortfolioStats,
    getTaskStats,
    getInvestorStats,
    getTradeStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 