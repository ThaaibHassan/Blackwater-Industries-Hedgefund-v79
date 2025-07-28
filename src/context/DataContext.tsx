import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from '@/hooks/use-toast';
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { Task } from '@/types';

// Types for all data entities
interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'institutional' | 'family_office' | 'hnwi' | 'uhnwi' | 'founder_entrepreneur' | 'corporate' | 'institutional_investor';
  status: 'active' | 'pending' | 'inactive';
  totalCommitment: number;
  currentBalance: number;
  allocatedAmount: number;
  unallocatedAmount: number;
  kycStatus: 'approved' | 'pending' | 'rejected';
  assignedManager: string;
  lastContact: string;
  createdAt: Date;
  updatedAt: Date;
  inceptionDate: Date;
}

interface PortfolioPosition {
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
  updatedAt: Date;
}

interface ResearchNote {
  id: string;
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
  updatedAt: Date;
  dueDate: Date;
}

interface Trade {
  id: string;
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
  updatedAt: Date;
}

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
  const { user } = useAuth();
  
  // Initial data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [portfolioPositions, setPortfolioPositions] = useState<PortfolioPosition[]>([]);
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  // Real-time Firestore listeners
  useEffect(() => {
    // Tasks
    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      setTasks(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          dueDate: data.dueDate?.toDate?.() || (typeof data.dueDate === 'string' ? new Date(data.dueDate) : new Date()),
        } as Task;
      }));
    });
    // Investors
    const unsubInvestors = onSnapshot(collection(db, 'investors'), (snapshot) => {
      setInvestors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() }) as Investor));
    });
    // Portfolio Positions
    const unsubPositions = onSnapshot(collection(db, 'portfolioPositions'), (snapshot) => {
      setPortfolioPositions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() }) as PortfolioPosition));
    });
    // Research Notes
    const unsubResearch = onSnapshot(collection(db, 'researchNotes'), (snapshot) => {
      setResearchNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() }) as ResearchNote));
    });
    // Trades
    const unsubTrades = onSnapshot(collection(db, 'trades'), (snapshot) => {
      setTrades(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() }) as Trade));
    });
    // Workflows
    const unsubWorkflows = onSnapshot(collection(db, 'workflows'), (snapshot) => {
      setWorkflows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() }) as Workflow));
    });
    return () => {
      unsubTasks();
      unsubInvestors();
      unsubPositions();
      unsubResearch();
      unsubTrades();
      unsubWorkflows();
    };
  }, []);

  // Task actions
  const addTask = async (task: Task) => {
    await addDoc(collection(db, 'tasks'), {
      ...task,
      status: 'pending',
      dueDate: task.dueDate instanceof Date ? Timestamp.fromDate(task.dueDate) : task.dueDate,
      createdAt: task.createdAt instanceof Date ? Timestamp.fromDate(task.createdAt) : Timestamp.now(),
      updatedAt: task.updatedAt instanceof Date ? Timestamp.fromDate(task.updatedAt) : Timestamp.now(),
      completedAt: task.completedAt instanceof Date ? Timestamp.fromDate(task.completedAt) : undefined,
    });
    toast({
      title: "Task Added",
      description: "New task has been created successfully.",
    });
  };

  const updateTask = async (task: Task) => {
    await updateDoc(doc(db, 'tasks', task.id), {
      ...task,
      status: task.status,
      dueDate: task.dueDate instanceof Date ? Timestamp.fromDate(task.dueDate) : task.dueDate,
      createdAt: task.createdAt instanceof Date ? Timestamp.fromDate(task.createdAt) : task.createdAt,
      updatedAt: task.updatedAt instanceof Date ? Timestamp.fromDate(task.updatedAt) : Timestamp.now(),
      completedAt: task.completedAt instanceof Date ? Timestamp.fromDate(task.completedAt) : undefined,
    });
    toast({
      title: "Task Updated",
      description: "Task has been updated successfully.",
    });
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
    toast({
      title: 'Task Deleted',
      description: 'Task has been removed.',
    });
  };

  const completeTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await updateDoc(doc(db, 'tasks', id), {
        ...task,
        status: 'completed',
        updatedAt: Timestamp.now(),
        completedAt: Timestamp.now(),
        dueDate: task.dueDate instanceof Date ? Timestamp.fromDate(task.dueDate) : task.dueDate,
        createdAt: task.createdAt instanceof Date ? Timestamp.fromDate(task.createdAt) : task.createdAt,
      });
      toast({
        title: 'Task Completed',
        description: 'Task has been marked as completed.',
      });
    }
  };

  const startTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await updateDoc(doc(db, 'tasks', id), {
        ...task,
        status: 'in_progress',
        updatedAt: Timestamp.now(),
        dueDate: task.dueDate instanceof Date ? Timestamp.fromDate(task.dueDate) : task.dueDate,
        createdAt: task.createdAt instanceof Date ? Timestamp.fromDate(task.createdAt) : task.createdAt,
      });
      toast({
        title: 'Task Started',
        description: 'Task has been started.',
      });
    }
  };

  // Investor actions
  const addInvestor = async (investorData: Omit<Investor, 'id' | 'currentBalance' | 'createdAt'>) => {
    await addDoc(collection(db, 'investors'), {
      ...investorData,
      currentBalance: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      inceptionDate: investorData.inceptionDate instanceof Date ? Timestamp.fromDate(investorData.inceptionDate) : investorData.inceptionDate,
    });
    toast({
      title: "Investor Added",
      description: "New investor has been added successfully.",
    });
  };

  const updateInvestor = async (id: string, updates: Partial<Investor>) => {
    await updateDoc(doc(db, 'investors', id), {
      ...updates,
      updatedAt: updates.updatedAt instanceof Date ? Timestamp.fromDate(updates.updatedAt) : Timestamp.now(),
      inceptionDate: updates.inceptionDate instanceof Date ? Timestamp.fromDate(updates.inceptionDate) : updates.inceptionDate,
    });
    toast({
      title: "Investor Updated",
      description: "Investor has been updated successfully.",
    });
  };

  const deleteInvestor = async (id: string) => {
    await deleteDoc(doc(db, 'investors', id));
    toast({
      title: "Investor Deleted",
      description: "Investor has been removed.",
    });
  };

  // Portfolio actions
  const addPosition = async (positionData: Omit<PortfolioPosition, 'id' | 'marketValue' | 'unrealizedPnl' | 'pnlPercent' | 'createdAt'>) => {
    await addDoc(collection(db, 'portfolioPositions'), {
      ...positionData,
      marketValue: 0,
      unrealizedPnl: 0,
      pnlPercent: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    toast({
      title: "Position Added",
      description: "New position has been added successfully.",
    });
  };

  const updatePosition = async (id: string, updates: Partial<PortfolioPosition>) => {
    await updateDoc(doc(db, 'portfolioPositions', id), {
      ...updates,
      updatedAt: updates.updatedAt instanceof Date ? Timestamp.fromDate(updates.updatedAt) : Timestamp.now(),
    });
    toast({
      title: "Position Updated",
      description: "Position has been updated successfully.",
    });
  };

  const deletePosition = async (id: string) => {
    await deleteDoc(doc(db, 'portfolioPositions', id));
    toast({
      title: "Position Deleted",
      description: "Position has been removed.",
    });
  };

  // Research actions
  const addResearchNote = async (noteData: Omit<ResearchNote, 'id' | 'rating' | 'views' | 'createdAt'>) => {
    await addDoc(collection(db, 'researchNotes'), {
      ...noteData,
      rating: 0,
      views: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      dueDate: noteData.dueDate instanceof Date ? Timestamp.fromDate(noteData.dueDate) : noteData.dueDate,
    });
    toast({
      title: "Research Note Added",
      description: "New research note has been added successfully.",
    });
  };

  const updateResearchNote = async (id: string, updates: Partial<ResearchNote>) => {
    await updateDoc(doc(db, 'researchNotes', id), {
      ...updates,
      updatedAt: updates.updatedAt instanceof Date ? Timestamp.fromDate(updates.updatedAt) : Timestamp.now(),
      dueDate: updates.dueDate instanceof Date ? Timestamp.fromDate(updates.dueDate) : updates.dueDate,
    });
    toast({
      title: "Research Note Updated",
      description: "Research note has been updated successfully.",
    });
  };

  const deleteResearchNote = async (id: string) => {
    await deleteDoc(doc(db, 'researchNotes', id));
    toast({
      title: "Research Note Deleted",
      description: "Research note has been removed.",
    });
  };

  const rateResearchNote = async (id: string, rating: number) => {
    await updateDoc(doc(db, 'researchNotes', id), { rating });
    toast({
      title: "Research Note Rated",
      description: "Research note has been rated successfully.",
    });
  };

  // Trade actions
  const addTrade = async (tradeData: Omit<Trade, 'id' | 'totalValue' | 'pnl' | 'createdAt'>) => {
    await addDoc(collection(db, 'trades'), {
      ...tradeData,
      totalValue: 0,
      pnl: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    toast({
      title: "Trade Added",
      description: "New trade has been added successfully.",
    });
  };

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    await updateDoc(doc(db, 'trades', id), {
      ...updates,
      updatedAt: updates.updatedAt instanceof Date ? Timestamp.fromDate(updates.updatedAt) : Timestamp.now(),
    });
    toast({
      title: "Trade Updated",
      description: "Trade has been updated successfully.",
    });
  };

  const deleteTrade = async (id: string) => {
    await deleteDoc(doc(db, 'trades', id));
    toast({
      title: "Trade Deleted",
      description: "Trade has been removed.",
    });
  };

  const approveTrade = async (id: string) => {
    await updateDoc(doc(db, 'trades', id), { status: 'executed' });
    toast({
      title: "Trade Approved",
      description: "Trade has been approved successfully.",
    });
  };

  const rejectTrade = async (id: string) => {
    await updateDoc(doc(db, 'trades', id), { status: 'cancelled' });
    toast({
      title: "Trade Rejected",
      description: "Trade has been rejected successfully.",
    });
  };

  // Workflow actions
  const addWorkflow = async (workflowData: Omit<Workflow, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'workflows'), {
      ...workflowData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    toast({
      title: "Workflow Added",
      description: "New workflow has been added successfully.",
    });
  };

  const updateWorkflow = async (id: string, updates: Partial<Workflow>) => {
    await updateDoc(doc(db, 'workflows', id), {
      ...updates,
      updatedAt: updates.updatedAt instanceof Date ? Timestamp.fromDate(updates.updatedAt) : Timestamp.now(),
    });
    toast({
      title: "Workflow Updated",
      description: "Workflow has been updated successfully.",
    });
  };

  const deleteWorkflow = async (id: string) => {
    await deleteDoc(doc(db, 'workflows', id));
    toast({
      title: "Workflow Deleted",
      description: "Workflow has been removed.",
    });
  };

  // Analytics functions
  const getPortfolioStats = () => {
    const totalValue = portfolioPositions.reduce((sum, pos) => sum + (typeof pos.marketValue === 'number' && !isNaN(pos.marketValue) ? pos.marketValue : 0), 0);
    const totalPnl = portfolioPositions.reduce((sum, pos) => sum + (typeof pos.unrealizedPnl === 'number' && !isNaN(pos.unrealizedPnl) ? pos.unrealizedPnl : 0), 0);
    const totalPnlPercent = (totalValue && !isNaN(totalValue)) ? ((totalPnl / (totalValue || 1)) * 100) : 0;
    return {
      totalValue: isNaN(totalValue) ? 0 : totalValue,
      totalPnl: isNaN(totalPnl) ? 0 : totalPnl,
      totalPnlPercent: isNaN(totalPnlPercent) ? 0 : totalPnlPercent,
      positions: portfolioPositions.length,
    };
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return { total, pending, inProgress, completed };
  };

  const getInvestorStats = () => {
    const total = investors.length;
    const active = investors.filter(i => i.status === 'active').length;
    const totalCommitments = investors.reduce((sum, i) => sum + (i.totalCommitment || 0), 0);
    const totalBalance = investors.reduce((sum, i) => sum + (i.currentBalance || 0), 0);
    const totalAllocated = investors.reduce((sum, i) => sum + (i.allocatedAmount || 0), 0);
    const totalUnallocated = investors.reduce((sum, i) => sum + (i.unallocatedAmount || 0), 0);
    const allocationPercentage = totalBalance > 0 ? (totalAllocated / totalBalance) * 100 : 0;
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
    const total = trades.length;
    const executed = trades.filter(t => t.status === 'executed').length;
    const pending = trades.filter(t => t.status === 'pending').length;
    const totalValue = trades.reduce((sum, t) => sum + (t.totalValue || 0), 0);
    const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    return { total, executed, pending, totalValue, totalPnl };
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