# Firebase Setup Guide for Blackwater Hedge Fund

This guide will help you set up Firebase for your hedge fund management platform.

## 🔥 Current Firebase Project Status

- **Project ID**: `blackwater-hedgefund`
- **Status**: ✅ Firestore Rules & Indexes deployed
- **Functions**: ⚠️ Requires Blaze plan upgrade for v2 functions

## 📋 Setup Steps

### 1. Environment Configuration

Create a `.env.local` file in your project root with the following configuration:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyA-7BXZuUs7kbwldRYSvDUg8Afuh29mtoI
VITE_FIREBASE_AUTH_DOMAIN=blackwater-hedgefund.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=blackwater-hedgefund
VITE_FIREBASE_STORAGE_BUCKET=blackwater-hedgefund.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=644835120177
VITE_FIREBASE_APP_ID=1:644835120177:web:afb27906803fc8bcf67110

# Firebase Functions Configuration
VITE_FIREBASE_FUNCTIONS_REGION=us-central1

# Application Configuration
VITE_APP_NAME=Blackwater Industries
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_USE_MOCK_AUTH=false
VITE_ENABLE_MT5_INTEGRATION=true
VITE_ENABLE_MYFXBOOK_INTEGRATION=true
VITE_ENABLE_AI_INSIGHTS=true
VITE_ENABLE_ESG_ANALYSIS=true
VITE_ENABLE_CREDIT_ANALYSIS=true
VITE_ENABLE_RISK_MANAGEMENT=true
VITE_ENABLE_COMPLIANCE=true
VITE_ENABLE_FUNDRAISING=true

# Development Settings
VITE_USE_FIREBASE_EMULATORS=false

# Security
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_DURATION=900000

# Performance
VITE_CACHE_DURATION=300000
VITE_MAX_CACHE_SIZE=100
VITE_ENABLE_OFFLINE_SUPPORT=true
```

### 2. Set Up Firestore Collections

#### Option A: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/project/blackwater-hedgefund)
2. Navigate to Firestore Database
3. Create the following collections manually:

**Collections to create:**
- `users`
- `portfolios`
- `trades`
- `research`
- `investors`
- `tasks`
- `reports`
- `ai_insights`
- `credit_analysis`
- `esg_analysis`
- `risk_scenarios`
- `orders`
- `data_jobs`
- `audit_logs`
- `compliance_rules`
- `workflows`
- `notifications`
- `watchlists`
- `fundraising`
- `performance_attribution`
- `dashboard`
- `dashboard_trades`
- `dashboard_holdings`
- `dashboard_performance`

#### Option B: Using the Setup Script

1. Download your service account key:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root

2. Run the setup script:
   ```bash
   node setup-firebase-collections.js
   ```

### 3. Authentication Setup

1. **Enable Email/Password Authentication:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Email/Password

2. **Create Initial Admin User:**
   ```bash
   node grant-admin.js
   ```
   Then use the email you want to grant admin access to.

3. **Set up Custom Claims for Roles:**
   The Firebase Functions will handle this automatically when users are created.

### 4. Storage Setup

1. **Create Storage Bucket:**
   - Go to Firebase Console → Storage
   - Create bucket if not exists
   - Set up security rules for file uploads

2. **Storage Rules (add to firebase.json):**
   ```json
   {
     "storage": {
       "rules": "storage.rules"
     }
   }
   ```

### 5. Functions Deployment (Optional - Requires Blaze Plan)

If you want to deploy the Firebase Functions:

1. **Upgrade to Blaze Plan:**
   - Go to [Firebase Console Billing](https://console.firebase.google.com/project/blackwater-hedgefund/usage/details)
   - Upgrade to Blaze (pay-as-you-go) plan

2. **Deploy Functions:**
   ```bash
   firebase deploy --only functions
   ```

## 🔐 Security Rules Status

✅ **Firestore Rules**: Deployed with role-based access control
✅ **Indexes**: Deployed for efficient queries

### Security Features Implemented:

- **Role-Based Access Control (RBAC)**
  - Admin: Full access
  - Manager: Portfolio, trades, research, investors management
  - Analyst: View portfolios, trades, create research
  - Investor: View portfolios and reports
  - Compliance: View all data, manage compliance rules

- **Audit Logging**: All admin actions are logged
- **Data Validation**: Input validation on all functions
- **Session Management**: Auto-logout after inactivity

## 📊 Data Structure

### Users Collection
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'analyst' | 'investor' | 'compliance';
  permissions: string[];
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  isActive: boolean;
  twoFactorEnabled: boolean;
  photoURL?: string;
}
```

### Portfolios Collection
```typescript
{
  id: string;
  name: string;
  description?: string;
  managerId: string;
  managerName: string;
  inceptionDate: Timestamp;
  strategy: InvestmentStrategy;
  riskProfile: RiskProfile;
  targetReturn: number;
  maxDrawdown: number;
  isActive: boolean;
  nav: number;
  totalValue: number;
  cashBalance: number;
  leverage: number;
  fees: FeeStructure;
  performance: PerformanceMetrics;
}
```

### Trades Collection
```typescript
{
  id: string;
  portfolioId: string;
  symbol: string;
  assetClass: AssetClass;
  side: 'buy' | 'sell' | 'short' | 'cover';
  quantity: number;
  price: number;
  totalValue: number;
  commission: number;
  timestamp: Timestamp;
  status: TradeStatus;
  tags: string[];
  notes?: string;
  pnl?: number;
  strategy?: string;
  analyst?: string;
}
```

## 🚀 Testing Your Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Authentication:**
   - Try logging in with the admin user
   - Verify role-based access works

3. **Test Data Access:**
   - Navigate to different sections
   - Verify data loads correctly
   - Test CRUD operations

## 🔧 Troubleshooting

### Common Issues:

1. **"Missing Firebase environment variables"**
   - Ensure `.env.local` file exists with correct values

2. **"Permission denied" errors**
   - Check if user has correct role
   - Verify Firestore rules are deployed

3. **"Functions not found"**
   - Upgrade to Blaze plan for v2 functions
   - Or use mock authentication for development

4. **"Collection not found"**
   - Run the setup script to create collections
   - Or create collections manually in Firebase Console

### Development vs Production:

- **Development**: Use mock authentication with `VITE_USE_MOCK_AUTH=true`
- **Production**: Use real Firebase authentication

## 📈 Next Steps

1. **Set up real data**: Replace mock data with actual portfolio data
2. **Configure external APIs**: Set up MT5, Myfxbook integrations
3. **Deploy to production**: Configure production environment
4. **Set up monitoring**: Configure Firebase Analytics and Crashlytics
5. **Implement advanced features**: AI insights, ESG analysis, etc.

## 🆘 Support

If you encounter issues:

1. Check Firebase Console for error logs
2. Verify environment variables are set correctly
3. Ensure Firestore rules are deployed
4. Check browser console for client-side errors

---

**Firebase Project URL**: https://console.firebase.google.com/project/blackwater-hedgefund/overview 