const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper function to create timestamp
const createTimestamp = () => admin.firestore.Timestamp.now();

// Helper function to create date
const createDate = (dateString) => admin.firestore.Timestamp.fromDate(new Date(dateString));

// Sample data for collections
const usersData = [
  {
    uid: 'admin_user_001',
    email: 'admin@blackwater.com',
    displayName: 'System Administrator',
    role: 'admin',
    permissions: [
      'portfolio:view', 'portfolio:edit', 'portfolio:delete',
      'trades:view', 'trades:edit', 'trades:delete',
      'research:view', 'research:edit', 'research:delete',
      'investors:view', 'investors:edit', 'investors:delete',
      'reports:view', 'reports:generate', 'reports:export',
      'users:view', 'users:edit', 'users:delete',
      'settings:view', 'settings:edit', 'compliance:view', 'compliance:edit'
    ],
    createdAt: createTimestamp(),
    lastLoginAt: createTimestamp(),
    isActive: true,
    twoFactorEnabled: false,
    photoURL: null
  },
  {
    uid: 'manager_user_001',
    email: 'manager@blackwater.com',
    displayName: 'Portfolio Manager',
    role: 'manager',
    permissions: [
      'portfolio:view', 'portfolio:edit',
      'trades:view', 'trades:edit',
      'research:view', 'research:edit',
      'investors:view', 'investors:edit',
      'reports:view', 'reports:generate'
    ],
    createdAt: createTimestamp(),
    lastLoginAt: createTimestamp(),
    isActive: true,
    twoFactorEnabled: false,
    photoURL: null
  },
  {
    uid: 'analyst_user_001',
    email: 'analyst@blackwater.com',
    displayName: 'Research Analyst',
    role: 'analyst',
    permissions: [
      'portfolio:view',
      'trades:view',
      'research:view', 'research:edit'
    ],
    createdAt: createTimestamp(),
    lastLoginAt: createTimestamp(),
    isActive: true,
    twoFactorEnabled: false,
    photoURL: null
  }
];

const portfoliosData = [
  {
    id: 'portfolio_001',
    name: 'Blackwater Alpha Fund',
    description: 'Multi-strategy hedge fund focusing on equity long/short and global macro',
    managerId: 'manager_user_001',
    managerName: 'Portfolio Manager',
    inceptionDate: createDate('2023-01-01'),
    strategy: 'multi_strategy',
    riskProfile: 'moderate',
    targetReturn: 15.0,
    maxDrawdown: 10.0,
    isActive: true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
    nav: 100.00,
    totalValue: 2400000000,
    cashBalance: 120000000,
    leverage: 1.4,
    fees: {
      managementFee: 2.0,
      performanceFee: 20.0,
      hurdleRate: 8.0,
      highWaterMark: true,
      lockupPeriod: 365,
      redemptionNotice: 90
    },
    performance: {
      totalReturn: 12.4,
      annualizedReturn: 12.4,
      sharpeRatio: 1.8,
      maxDrawdown: -8.2,
      volatility: 8.5,
      beta: 0.3,
      alpha: 8.2,
      informationRatio: 1.2,
      calmarRatio: 1.5,
      sortinoRatio: 2.1,
      treynorRatio: 0.15,
      trackingError: 2.1
    }
  }
];

const tradesData = [
  {
    id: 'trade_001',
    portfolioId: 'portfolio_001',
    symbol: 'AAPL',
    assetClass: 'equity',
    side: 'buy',
    quantity: 1000,
    price: 180.5,
    totalValue: 180500,
    commission: 150,
    timestamp: createTimestamp(),
    status: 'executed',
    tags: ['tech', 'large-cap'],
    riskMetrics: {
      positionSize: 0.05,
      stopLoss: 170,
      takeProfit: 200,
      riskRewardRatio: 1.5,
      maxRisk: 10500
    },
    notes: 'Earnings momentum trade.',
    screenshots: [],
    pnl: 20000,
    rMultiple: 1.9,
    strategy: 'momentum',
    analyst: 'analyst_user_001',
    type: 'market'
  },
  {
    id: 'trade_002',
    portfolioId: 'portfolio_001',
    symbol: 'TSLA',
    assetClass: 'equity',
    side: 'short',
    quantity: 500,
    price: 170.2,
    totalValue: 85100,
    commission: 100,
    timestamp: createTimestamp(),
    status: 'executed',
    tags: ['auto', 'short'],
    riskMetrics: {
      positionSize: 0.03,
      stopLoss: 180,
      takeProfit: 150,
      riskRewardRatio: 1.3,
      maxRisk: 4900
    },
    notes: 'Short-term reversal.',
    screenshots: [],
    pnl: -2000,
    rMultiple: -0.4,
    strategy: 'mean_reversion',
    analyst: 'analyst_user_001',
    type: 'market'
  }
];

const researchData = [
  {
    id: 'research_001',
    title: 'Apple Inc. Q4 Earnings Analysis',
    content: 'Comprehensive analysis of Apple\'s Q4 earnings report and future outlook...',
    analystId: 'analyst_user_001',
    analystName: 'Research Analyst',
    assetClass: 'equity',
    symbol: 'AAPL',
    symbols: ['AAPL'],
    tags: ['earnings', 'tech', 'analysis'],
    status: 'published',
    priority: 'high',
    dueDate: createDate('2024-12-31'),
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
    attachments: [],
    version: 1,
    isPublic: true,
    recommendation: 'buy'
  }
];

const investorsData = [
  {
    id: 'investor_001',
    name: 'Blackstone Group',
    email: 'investments@blackstone.com',
    phone: '+1-212-583-5000',
    type: 'institutional',
    status: 'active',
    totalCommitment: 50000000,
    currentBalance: 50000000,
    totalInvestment: 50000000,
    currentValue: 56000000,
    totalReturn: 12.0,
    riskProfile: 'moderate',
    joinDate: createDate('2023-01-15'),
    inceptionDate: createDate('2023-01-15'),
    kycStatus: 'verified',
    documents: [],
    notes: 'Institutional investor with long-term focus',
    assignedManager: 'manager_user_001',
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
    allocatedAmount: 50000000,
    unallocatedAmount: 0,
    lastContact: '2024-06-01'
  }
];

const tasksData = [
  {
    id: 'task_001',
    title: 'Review Q4 Portfolio Performance',
    description: 'Analyze and document Q4 portfolio performance metrics',
    type: 'portfolio_review',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'analyst_user_001',
    assigneeName: 'Research Analyst',
    dueDate: createDate('2024-12-31'),
    relatedEntity: {
      type: 'portfolio',
      id: 'portfolio_001'
    },
    checklist: [
      { id: '1', description: 'Calculate Sharpe ratio', isCompleted: true },
      { id: '2', description: 'Review drawdown analysis', isCompleted: false },
      { id: '3', description: 'Prepare performance attribution', isCompleted: false }
    ],
    tags: ['performance', 'quarterly'],
    createdAt: createTimestamp(),
    updatedAt: createTimestamp()
  }
];

const dashboardData = {
  portfolio: {
    totalAum: 2400000000,
    dailyChange: 2.5,
    ytdReturn: 12.4,
    benchmarkReturn: 11.2,
    sharpeRatio: 1.8,
    maxDrawdown: -8.2,
    activeInvestors: 1247,
    newInvestors: 12,
    openPositions: 156,
    longPositions: 23,
    shortPositions: 133,
    cashPosition: 5.2,
    leverage: 1.4,
    updatedAt: createTimestamp()
  }
};

const dashboardTradesData = [
  {
    id: 'trade1',
    symbol: 'AAPL',
    side: 'buy',
    quantity: 1000,
    price: 185.50,
    timestamp: Date.now() - 2*60*60*1000,
    pnl: 2500,
    createdAt: createTimestamp()
  },
  {
    id: 'trade2',
    symbol: 'TSLA',
    side: 'sell',
    quantity: 500,
    price: 245.75,
    timestamp: Date.now() - 4*60*60*1000,
    pnl: -1200,
    createdAt: createTimestamp()
  }
];

const dashboardHoldingsData = [
  {
    id: 'holding1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    weight: 8.5,
    return: 15.2,
    value: 204000000,
    createdAt: createTimestamp()
  },
  {
    id: 'holding2',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    weight: 7.8,
    return: 12.8,
    value: 187200000,
    createdAt: createTimestamp()
  }
];

// Function to seed data
async function seedFirestoreData() {
  try {
    console.log('Starting Firestore data seeding...');

    // Seed users
    console.log('Seeding users...');
    for (const user of usersData) {
      await db.collection('users').doc(user.uid).set(user);
    }

    // Seed portfolios
    console.log('Seeding portfolios...');
    for (const portfolio of portfoliosData) {
      await db.collection('portfolios').doc(portfolio.id).set(portfolio);
    }

    // Seed trades
    console.log('Seeding trades...');
    for (const trade of tradesData) {
      await db.collection('trades').doc(trade.id).set(trade);
    }

    // Seed research
    console.log('Seeding research...');
    for (const research of researchData) {
      await db.collection('research').doc(research.id).set(research);
    }

    // Seed investors
    console.log('Seeding investors...');
    for (const investor of investorsData) {
      await db.collection('investors').doc(investor.id).set(investor);
    }

    // Seed tasks
    console.log('Seeding tasks...');
    for (const task of tasksData) {
      await db.collection('tasks').doc(task.id).set(task);
    }

    // Seed dashboard data
    console.log('Seeding dashboard data...');
    await db.collection('dashboard').doc('portfolio').set(dashboardData.portfolio);

    // Seed dashboard trades
    for (const trade of dashboardTradesData) {
      await db.collection('dashboard_trades').doc(trade.id).set(trade);
    }

    // Seed dashboard holdings
    for (const holding of dashboardHoldingsData) {
      await db.collection('dashboard_holdings').doc(holding.id).set(holding);
    }

    console.log('✅ Firestore data seeding completed successfully!');
    console.log('\nCollections created:');
    console.log('- users');
    console.log('- portfolios');
    console.log('- trades');
    console.log('- research');
    console.log('- investors');
    console.log('- tasks');
    console.log('- dashboard');
    console.log('- dashboard_trades');
    console.log('- dashboard_holdings');

  } catch (error) {
    console.error('❌ Error seeding Firestore data:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding function
seedFirestoreData(); 