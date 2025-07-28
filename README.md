# Blackwater Hedge Fund Management Platform

An institutional-grade hedge fund management platform built with React, TypeScript, and Firebase.

##  Features

- **Role-Based Access Control (RBAC)**: Secure authentication with different user roles
- **Multi-Module Architecture**: Dashboard, Portfolio, Trading, Research, Compliance, and Reporting
- **Real-time Data**: Firebase Firestore integration for live updates
- **MetaTrader 5 Integration**: Docker-based MT5 with real-time trading statistics
- **Modern UI**: Built with ShadCN UI and TailwindCSS
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works seamlessly across all devices

##  Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: ShadCN UI + TailwindCSS
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Trading Integration**: MetaTrader 5 + FastAPI + Docker
- **State Management**: React Context API
- **Routing**: React Router v6
- **Build Tool**: Vite

##  Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── ui/             # ShadCN UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (Firebase, etc.)
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

##  Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blackwater-hedge-fund
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication, Firestore, Storage, and Functions
   - Add your Firebase config to `.env.local`

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

##  MetaTrader 5 Integration

This platform includes a comprehensive MetaTrader 5 integration using Docker containers. The MT5 integration provides:

- **Real-time Trading Statistics**: Live P&L, win rates, and performance metrics
- **Automated Trading**: API-based trade execution and management
- **VNC Remote Access**: Web-based access to MT5 interface
- **Comprehensive API**: REST endpoints for all trading operations

### Quick Start (Local Development)

```bash
# Start MT5 integration locally
./start-local.sh

# Access services:
# - MT5 VNC: http://localhost:6080
# - MT5 API: http://localhost:8000
# - Frontend: http://localhost:3000
```

### Production Setup

```bash
# Full setup with domain configuration
./setup-mt5.sh
```

For detailed MT5 integration documentation, see [README-MT5.md](./README-MT5.md).

##  Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

##  Architecture

### Role-Based Access Control

The platform supports multiple user roles:
- **Admin**: Full system access
- **Portfolio Manager**: Portfolio and trading access
- **Analyst**: Research and analysis tools
- **Compliance Officer**: Compliance monitoring
- **Investor**: Read-only access to relevant data

### Module Breakdown

1. **Dashboard**: Overview and key metrics
2. **Portfolio**: Asset allocation and performance
3. **Trading**: Trade execution and management
4. **Research**: Market analysis and reports
5. **Investors**: Investor portal and communications
6. **Reports**: Performance and compliance reports
7. **Compliance**: Regulatory compliance monitoring
8. **Tasks**: Task management and workflows

##  Security

- Firebase Authentication with custom claims
- Role-based route protection
- Secure Firestore rules
- Environment variable protection
- Input validation and sanitization

##  Testing

- Unit tests with Jest and React Testing Library
- Integration tests for critical workflows
- E2E tests with Playwright
- Security testing for authentication flows

##  Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init hosting
```

4. Deploy:
```bash
npm run build
firebase deploy
```

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

This project is proprietary software for Blackwater Industries.

##  Support

For support and questions, please contact the development team.

## Manually Adding Users (Admin Instructions)

### 1. Create the User in Firebase Authentication
1. Go to the [Firebase Console Authentication Users page](https://console.firebase.google.com/project/blackwater-hedgefund/authentication/users).
2. Click **"Add user"**.
3. Enter the user's **email** and a **temporary password**.
4. Click **"Add user"**.

### 2. Create or Update the User Document in Firestore
1. Go to the [Firestore Database page](https://console.firebase.google.com/project/blackwater-hedgefund/firestore/data).
2. In the left sidebar, click on the `users` collection.
3. Find the new user's UID (from the Auth users list) in the `users` collection.
   - If it **exists**, click it and update the fields as needed.
   - If it **does not exist**, click **"Add document"** and use the UID from Auth as the document ID.

**Fill in the following fields:**
- `uid`: (string) — The UID from Firebase Auth
- `email`: (string) — The user's email
- `displayName`: (string) — The user's name (optional)
- `role`: (string) — `analyst`, `admin`, `manager`, `investor`, or `compliance`
- `permissions`: (array) — Leave empty or fill with permissions (the app will auto-fill based on role)
- `createdAt`: (timestamp) — Click the field type and select "timestamp", then set to "now"
- `lastLoginAt`: (timestamp) — Same as above
- `isActive`: (boolean) — `true`
- `twoFactorEnabled`: (boolean) — `false`

### 3. Send Credentials to the User
- Give the user their email and temporary password.
- When they log in, they'll be prompted to change their password.

#### Example Firestore User Document
| Field             | Type      | Example Value                |
|-------------------|-----------|------------------------------|
| uid               | string    | `abc123UID`                  |
| email             | string    | `user@example.com`           |
| displayName       | string    | `Jane Doe`                   |
| role              | string    | `analyst`                    |
| permissions       | array     | (leave empty, or auto-filled)|
| createdAt         | timestamp | (set to now)                 |
| lastLoginAt       | timestamp | (set to now)                 |
| isActive          | boolean   | `true`                       |
| twoFactorEnabled  | boolean   | `false`                      |

---

**Blackwater Industries** - Institutional Hedge Fund Management Platform 
