# 🚀 Local Development Setup

Your hedge fund platform with MT5 integration is now running locally!

## 📊 Services Running

### ✅ Frontend (React App)
- **URL**: http://localhost:3000
- **Status**: ✅ Running
- **Description**: Main hedge fund management platform

### ✅ MT5 API (Mock)
- **URL**: http://localhost:8000
- **Status**: ✅ Running
- **Description**: Mock MetaTrader 5 API for development
- **Documentation**: http://localhost:8000/docs

## 🎯 How to Access

### 1. Main Application
Open your browser and go to:
```
http://localhost:3000
```

### 2. MT5 Dashboard
The MT5 dashboard component is integrated into the main app. You can access it through:
- Navigate to the trading section
- Look for MT5 integration features
- View real-time trading statistics

### 3. API Documentation
For API testing and documentation:
```
http://localhost:8000/docs
```

## 📈 Mock Data Available

The mock MT5 API provides realistic trading data:

### Account Information
- **Balance**: $100,000
- **Equity**: $102,450
- **Profit**: $2,450
- **Win Rate**: 75%

### Open Trades
- EURUSD Buy: 1.0 lot at 1.0850 (Current: 1.0875)
- GBPUSD Sell: 0.5 lot at 1.2650 (Current: 1.2625)

### Trading Statistics
- Total Trades: 4
- Winning Trades: 3
- Losing Trades: 1
- Profit Factor: 2.5
- Average Win: $250
- Average Loss: -$75

## 🔧 Development Commands

### Start Frontend
```bash
npm run dev
```

### Start MT5 API
```bash
python3 mt5-api/main_mock.py
```

### Test API
```bash
python3 test-mt5-api.py
```

### Stop Services
```bash
# Kill API
lsof -ti:8000 | xargs kill -9

# Kill Frontend
lsof -ti:3000 | xargs kill -9
```

## 🎨 Features Available

### Real-time Dashboard
- Account overview with live P&L
- Trading performance metrics
- Win rate visualization
- Open positions management

### Trading Statistics
- Comprehensive performance analytics
- Profit/Loss tracking
- Risk management metrics
- Historical trade analysis

### API Endpoints
- `/health` - API status
- `/stats` - Trading statistics
- `/trades` - Open positions
- `/account` - Account information
- `/symbols` - Available instruments

## 🔄 Next Steps

1. **Explore the Interface**: Navigate through the hedge fund platform
2. **Test Trading Features**: Use the mock MT5 integration
3. **Customize Data**: Modify `mt5-api/main_mock.py` for different scenarios
4. **Add Real MT5**: Replace mock API with real MT5 when ready

## 🐛 Troubleshooting

### API Not Responding
```bash
# Check if API is running
lsof -i :8000

# Restart API
python3 mt5-api/main_mock.py
```

### Frontend Not Loading
```bash
# Check if frontend is running
lsof -i :3000

# Restart frontend
npm run dev
```

### Port Conflicts
```bash
# Kill processes on specific ports
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

## 📚 Documentation

- **API Docs**: http://localhost:8000/docs
- **MT5 Integration**: README-MT5.md
- **Main Platform**: README.md

---

🎉 **Your hedge fund platform is ready for development!** 