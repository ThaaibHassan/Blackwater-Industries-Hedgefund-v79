import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Types for all data entities
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  category: string;
  createdAt: Date;
}

interface Investor {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'institutional' | 'family_office';
  status: 'active' | 'pending' | 'inactive';
  totalCommitment: number;
  currentBalance: number;
  kycStatus: 'approved' | 'pending' | 'rejected';
  assignedManager: string;
  lastContact: string;
  createdAt: Date;
}

interface PortfolioPosition {
  id: number;
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
}

interface ResearchNote {
  id: number;
  title: string;
  symbol: string;
  author: string;
  date: string;
  summary: string;
  status: 'published' | 'draft' | 'review';
  rating: number;
  views: number;
  recommendation: 'buy' | 'hold' | 'sell';
  priceTarget: number;
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  createdAt: Date;
}

interface Trade {
  id: number;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalValue: number;
  pnl: number;
  status: 'executed' | 'pending' | 'cancelled';
  type: 'market' | 'limit' | 'stop';
  strategy: string;
  analyst: string;
  timestamp: string;
  createdAt: Date;
}

interface Workflow {
  id: number;
  title: string;
  status: 'completed' | 'in_progress';
  assignee: string;
  completedAt?: string;
  startedAt?: string;
  createdAt: Date;
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
  addTask: (task: Omit<Task, 'id' | 'status' | 'createdAt'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  completeTask: (id: number) => void;
  startTask: (id: number) => void;
  
  // Investor actions
  addInvestor: (investor: Omit<Investor, 'id' | 'currentBalance' | 'createdAt'>) => void;
  updateInvestor: (id: number, updates: Partial<Investor>) => void;
  deleteInvestor: (id: number) => void;
  
  // Portfolio actions
  addPosition: (position: Omit<PortfolioPosition, 'id' | 'marketValue' | 'unrealizedPnl' | 'pnlPercent' | 'createdAt'>) => void;
  updatePosition: (id: number, updates: Partial<PortfolioPosition>) => void;
  deletePosition: (id: number) => void;
  
  // Research actions
  addResearchNote: (note: Omit<ResearchNote, 'id' | 'rating' | 'views' | 'createdAt'>) => void;
  updateResearchNote: (id: number, updates: Partial<ResearchNote>) => void;
  deleteResearchNote: (id: number) => void;
  rateResearchNote: (id: number, rating: number) => void;
  
  // Trade actions
  addTrade: (trade: Omit<Trade, 'id' | 'totalValue' | 'pnl' | 'createdAt'>) => void;
  updateTrade: (id: number, updates: Partial<Trade>) => void;
  deleteTrade: (id: number) => void;
  approveTrade: (id: number) => void;
  rejectTrade: (id: number) => void;
  
  // Workflow actions
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt'>) => void;
  updateWorkflow: (id: number, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: number) => void;
  
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
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { toast } = useToast();
  
  // Initial data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Review TSLA Research',
      description: 'Review and approve the latest Tesla research report',
      status: 'pending',
      priority: 'high',
      assignee: 'John Smith',
      dueDate: '2024-01-15',
      category: 'research',
      createdAt: new Date('2024-01-10')
    },
    {
      id: 2,
      title: 'Portfolio Rebalance',
      description: 'Execute portfolio rebalancing trades',
      status: 'in_progress',
      priority: 'medium',
      assignee: 'Sarah Johnson',
      dueDate: '2024-01-16',
      category: 'trading',
      createdAt: new Date('2024-01-11')
    }
  ]);

  const [investors, setInvestors] = useState<Investor[]>([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      type: 'individual',
      status: 'active',
      totalCommitment: 2500000,
      currentBalance: 2750000,
      kycStatus: 'approved',
      assignedManager: 'Sarah Johnson',
      lastContact: '2024-01-15',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Acme Corporation',
      email: 'investor@acme.com',
      phone: '+1 (555) 234-5678',
      type: 'institutional',
      status: 'active',
      totalCommitment: 5000000,
      currentBalance: 5450000,
      kycStatus: 'approved',
      assignedManager: 'Mike Chen',
      lastContact: '2024-01-14',
      createdAt: new Date('2024-01-02')
    }
  ]);

  const [portfolioPositions, setPortfolioPositions] = useState<PortfolioPosition[]>([
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      side: 'long',
      quantity: 1000,
      avgPrice: 175.50,
      currentPrice: 185.50,
      marketValue: 185500,
      unrealizedPnl: 10000,
      pnlPercent: 5.7,
      weight: 15.2,
      sector: 'Technology',
      risk: 'medium',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      side: 'long',
      quantity: 500,
      avgPrice: 220.00,
      currentPrice: 245.75,
      marketValue: 122875,
      unrealizedPnl: 12875,
      pnlPercent: 11.7,
      weight: 10.1,
      sector: 'Consumer Discretionary',
      risk: 'high',
      createdAt: new Date('2024-01-02')
    }
  ]);

  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([
    {
      id: 1,
      title: 'Apple Q4 Earnings Analysis: Strong iPhone Sales Drive Growth',
      symbol: 'AAPL',
      author: 'John Smith',
      date: '2024-01-15',
      summary: 'Apple reported strong Q4 earnings with iPhone sales exceeding expectations. Services revenue continues to grow at a healthy pace.',
      status: 'published',
      rating: 4.5,
      views: 1250,
      recommendation: 'buy',
      priceTarget: 200,
      riskLevel: 'medium',
      category: 'earnings',
      tags: ['earnings', 'iphone', 'services', 'growth'],
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Tesla Market Position: EV Competition Intensifies',
      symbol: 'TSLA',
      author: 'Sarah Johnson',
      date: '2024-01-14',
      summary: 'Analysis of Tesla\'s competitive position as traditional automakers ramp up EV production and new players enter the market.',
      status: 'draft',
      rating: 4.2,
      views: 890,
      recommendation: 'hold',
      priceTarget: 250,
      riskLevel: 'high',
      category: 'industry',
      tags: ['ev', 'competition', 'automotive', 'growth'],
      createdAt: new Date('2024-01-14')
    }
  ]);

  const [trades, setTrades] = useState<Trade[]>([
    {
      id: 1,
      symbol: 'AAPL',
      side: 'buy',
      quantity: 100,
      price: 175.50,
      totalValue: 17550,
      pnl: 1000,
      status: 'executed',
      type: 'market',
      strategy: 'momentum',
      analyst: 'John Smith',
      timestamp: '2024-01-15T10:30:00Z',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      symbol: 'TSLA',
      side: 'sell',
      quantity: 50,
      price: 245.75,
      totalValue: 12287.5,
      pnl: -500,
      status: 'executed',
      type: 'limit',
      strategy: 'mean-reversion',
      analyst: 'Sarah Johnson',
      timestamp: '2024-01-14T14:20:00Z',
      createdAt: new Date('2024-01-14')
    }
  ]);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 1,
      title: 'Trade Approval',
      status: 'completed',
      assignee: 'Mike Chen',
      completedAt: '2024-01-14T10:30:00Z',
      createdAt: new Date('2024-01-13')
    },
    {
      id: 2,
      title: 'Research Review',
      status: 'in_progress',
      assignee: 'Lisa Wang',
      startedAt: '2024-01-13T14:00:00Z',
      createdAt: new Date('2024-01-12')
    }
  ]);

  // Task actions
  const addTask = (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task Added",
      description: "New task has been created successfully.",
    });
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    toast({
      title: "Task Updated",
      description: "Task has been updated successfully.",
    });
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task has been removed.",
    });
  };

  const completeTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: 'completed' } : task
    ));
    toast({
      title: "Task Completed",
      description: "Task has been marked as completed.",
    });
  };

  const startTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: 'in_progress' } : task
    ));
    toast({
      title: "Task Started",
      description: "Task has been started.",
    });
  };

  // Investor actions
  const addInvestor = (investorData: Omit<Investor, 'id' | 'currentBalance' | 'createdAt'>) => {
    const newInvestor: Investor = {
      ...investorData,
      id: Date.now(),
      currentBalance: 0,
      createdAt: new Date()
    };
    setInvestors(prev => [...prev, newInvestor]);
    toast({
      title: "Investor Added",
      description: `${newInvestor.name} has been added to the system.`,
    });
  };

  const updateInvestor = (id: number, updates: Partial<Investor>) => {
    setInvestors(prev => prev.map(investor => 
      investor.id === id ? { ...investor, ...updates } : investor
    ));
    toast({
      title: "Investor Updated",
      description: "Investor information has been updated.",
    });
  };

  const deleteInvestor = (id: number) => {
    const investor = investors.find(inv => inv.id === id);
    setInvestors(prev => prev.filter(inv => inv.id !== id));
    toast({
      title: "Investor Deleted",
      description: `${investor?.name} has been removed from the system.`,
    });
  };

  // Portfolio actions
  const addPosition = (positionData: Omit<PortfolioPosition, 'id' | 'marketValue' | 'unrealizedPnl' | 'pnlPercent' | 'createdAt'>) => {
    const marketValue = positionData.quantity * positionData.currentPrice;
    const unrealizedPnl = positionData.side === 'long' 
      ? (positionData.currentPrice - positionData.avgPrice) * positionData.quantity
      : (positionData.avgPrice - positionData.currentPrice) * positionData.quantity;
    const pnlPercent = (unrealizedPnl / (positionData.quantity * positionData.avgPrice)) * 100;

    const newPosition: PortfolioPosition = {
      ...positionData,
      id: Date.now(),
      marketValue,
      unrealizedPnl,
      pnlPercent,
      createdAt: new Date()
    };
    setPortfolioPositions(prev => [...prev, newPosition]);
    toast({
      title: "Position Added",
      description: `${positionData.quantity} shares of ${positionData.symbol} added to portfolio.`,
    });
  };

  const updatePosition = (id: number, updates: Partial<PortfolioPosition>) => {
    setPortfolioPositions(prev => prev.map(position => 
      position.id === id ? { ...position, ...updates } : position
    ));
    toast({
      title: "Position Updated",
      description: "Position has been updated successfully.",
    });
  };

  const deletePosition = (id: number) => {
    const position = portfolioPositions.find(pos => pos.id === id);
    setPortfolioPositions(prev => prev.filter(pos => pos.id !== id));
    toast({
      title: "Position Closed",
      description: `${position?.symbol} position has been closed.`,
    });
  };

  // Research actions
  const addResearchNote = (noteData: Omit<ResearchNote, 'id' | 'rating' | 'views' | 'createdAt'>) => {
    const newNote: ResearchNote = {
      ...noteData,
      id: Date.now(),
      rating: 0,
      views: 0,
      createdAt: new Date()
    };
    setResearchNotes(prev => [...prev, newNote]);
    toast({
      title: "Research Note Added",
      description: `New research note "${noteData.title}" has been created.`,
    });
  };

  const updateResearchNote = (id: number, updates: Partial<ResearchNote>) => {
    setResearchNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
    toast({
      title: "Research Note Updated",
      description: "Research note has been updated successfully.",
    });
  };

  const deleteResearchNote = (id: number) => {
    const note = researchNotes.find(n => n.id === id);
    setResearchNotes(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Research Note Deleted",
      description: `"${note?.title}" has been removed.`,
    });
  };

  const rateResearchNote = (id: number, rating: number) => {
    setResearchNotes(prev => prev.map(note => 
      note.id === id ? { ...note, rating } : note
    ));
    toast({
      title: "Rating Submitted",
      description: `Research note has been rated ${rating} stars.`,
    });
  };

  // Trade actions
  const addTrade = (tradeData: Omit<Trade, 'id' | 'totalValue' | 'pnl' | 'createdAt'>) => {
    const totalValue = tradeData.quantity * tradeData.price;
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now(),
      totalValue,
      pnl: 0, // Will be calculated when position is closed
      createdAt: new Date()
    };
    setTrades(prev => [...prev, newTrade]);
    toast({
      title: "Trade Added",
      description: `${tradeData.side.toUpperCase()} ${tradeData.quantity} shares of ${tradeData.symbol} at $${tradeData.price}`,
    });
  };

  const updateTrade = (id: number, updates: Partial<Trade>) => {
    setTrades(prev => prev.map(trade => 
      trade.id === id ? { ...trade, ...updates } : trade
    ));
    toast({
      title: "Trade Updated",
      description: "Trade has been updated successfully.",
    });
  };

  const deleteTrade = (id: number) => {
    const trade = trades.find(t => t.id === id);
    setTrades(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Trade Deleted",
      description: `${trade?.symbol} trade has been removed.`,
    });
  };

  const approveTrade = (id: number) => {
    setTrades(prev => prev.map(trade => 
      trade.id === id ? { ...trade, status: 'executed' } : trade
    ));
    toast({
      title: "Trade Approved",
      description: "Trade has been approved and executed.",
    });
  };

  const rejectTrade = (id: number) => {
    setTrades(prev => prev.map(trade => 
      trade.id === id ? { ...trade, status: 'cancelled' } : trade
    ));
    toast({
      title: "Trade Rejected",
      description: "Trade has been rejected.",
    });
  };

  // Workflow actions
  const addWorkflow = (workflowData: Omit<Workflow, 'id' | 'createdAt'>) => {
    const newWorkflow: Workflow = {
      ...workflowData,
      id: Date.now(),
      createdAt: new Date()
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    toast({
      title: "Workflow Added",
      description: "New workflow has been created.",
    });
  };

  const updateWorkflow = (id: number, updates: Partial<Workflow>) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === id ? { ...workflow, ...updates } : workflow
    ));
    toast({
      title: "Workflow Updated",
      description: "Workflow has been updated successfully.",
    });
  };

  const deleteWorkflow = (id: number) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id));
    toast({
      title: "Workflow Deleted",
      description: "Workflow has been removed.",
    });
  };

  // Analytics functions
  const getPortfolioStats = () => {
    const totalValue = portfolioPositions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalPnl = portfolioPositions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0);
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
    const totalCommitments = investors.reduce((sum, inv) => sum + inv.totalCommitment, 0);
    const totalBalance = investors.reduce((sum, inv) => sum + inv.currentBalance, 0);
    
    return {
      total: investors.length,
      active: investors.filter(inv => inv.status === 'active').length,
      totalCommitments,
      totalBalance
    };
  };

  const getTradeStats = () => {
    const totalValue = trades.reduce((sum, trade) => sum + trade.totalValue, 0);
    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    
    return {
      total: trades.length,
      executed: trades.filter(t => t.status === 'executed').length,
      pending: trades.filter(t => t.status === 'pending').length,
      totalValue,
      totalPnl
    };
  };

  const value: DataContextType = {
    // State
    tasks,
    investors,
    portfolioPositions,
    researchNotes,
    trades,
    workflows,
    
    // Task actions
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    startTask,
    
    // Investor actions
    addInvestor,
    updateInvestor,
    deleteInvestor,
    
    // Portfolio actions
    addPosition,
    updatePosition,
    deletePosition,
    
    // Research actions
    addResearchNote,
    updateResearchNote,
    deleteResearchNote,
    rateResearchNote,
    
    // Trade actions
    addTrade,
    updateTrade,
    deleteTrade,
    approveTrade,
    rejectTrade,
    
    // Workflow actions
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    
    // Analytics
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