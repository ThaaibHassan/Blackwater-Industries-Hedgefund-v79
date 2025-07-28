# MetaTrader 5 Integration for Hedge Fund Platform

This project integrates MetaTrader 5 with your hedge fund platform using Docker containers, providing real-time trading statistics and automated trading capabilities.

## 🚀 Features

- **MetaTrader 5 Docker Container**: Runs MT5 in a Linux environment using Wine
- **VNC Remote Access**: Web-based access to MT5 interface
- **Python API**: FastAPI-based REST API for MT5 integration
- **Real-time Statistics**: Live trading performance metrics
- **Traefik Reverse Proxy**: SSL certificates and domain management
- **React Dashboard**: Modern UI for viewing trading statistics

## 📋 Prerequisites

- Docker and Docker Compose
- Domain names for services (optional for local development)
- MetaTrader 5 account credentials

## 🛠️ Quick Setup

### 1. Run the Setup Script

```bash
./setup-mt5.sh
```

This script will:
- Check Docker installation
- Create necessary Docker networks
- Generate environment configuration
- Build and start all services

### 2. Configure Environment

Edit the `.env` file with your settings:

```bash
# MetaTrader 5 Configuration
CUSTOM_USER=admin
PASSWORD=your_secure_password_here
VNC_DOMAIN=mt5.yourdomain.com

# Traefik Configuration
TRAEFIK_DOMAIN=traefik.yourdomain.com
TRAEFIK_USERNAME=admin
TRAEFIK_HASHED_PASSWORD=$apr1$your_hashed_password_here
ACME_EMAIL=your_email@example.com

# MT5 API Configuration
MT5_SERVER=your_mt5_server
MT5_LOGIN=your_mt5_login
MT5_PASSWORD=your_mt5_password
MT5_DEMO=true

# Domain Configuration
API_DOMAIN=api.yourdomain.com
FRONTEND_DOMAIN=hedgefund.yourdomain.com
```

### 3. Access Services

Once running, you can access:

- **MT5 VNC**: `https://your-vnc-domain.com` - Direct access to MetaTrader 5
- **Traefik Dashboard**: `https://your-traefik-domain.com` - Service monitoring
- **MT5 API**: `https://your-api-domain.com` - REST API endpoints
- **Frontend**: `https://your-frontend-domain.com` - Trading dashboard

## 📊 API Endpoints

### Account Information
- `GET /account` - Get account details
- `GET /stats` - Get comprehensive trading statistics

### Trading Operations
- `GET /trades` - Get open positions
- `GET /history` - Get trading history
- `POST /trade` - Place new trade
- `DELETE /trade/{ticket}` - Close specific trade

### Market Data
- `GET /symbols` - Get available symbols
- `GET /symbol/{symbol}` - Get symbol information
- `GET /rates/{symbol}` - Get price data

### Real-time Data
- `WS /ws` - WebSocket for real-time updates

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   MT5 API       │    │   MetaTrader 5  │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (Wine/VNC)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Traefik       │
                    │   (Reverse      │
                    │    Proxy)       │
                    └─────────────────┘
```

## 🔧 Manual Setup

If you prefer manual setup:

### 1. Create Docker Network
```bash
docker network create traefik-public
```

### 2. Configure Environment
```bash
cp env.mt5 .env
# Edit .env with your settings
```

### 3. Generate Traefik Password
```bash
export TRAEFIK_HASHED_PASSWORD=$(openssl passwd -apr1 your_password)
```

### 4. Start Services
```bash
docker-compose up -d --build
```

## 📈 Trading Statistics

The system provides comprehensive trading statistics:

### Account Metrics
- Balance, Equity, Margin
- Free Margin, Profit/Loss
- Real-time P&L tracking

### Performance Analytics
- Win Rate percentage
- Total vs Net Profit
- Profit Factor
- Average Win/Loss
- Largest Win/Loss

### Position Management
- Open positions list
- Real-time P&L per trade
- One-click trade closure

## 🔒 Security

- SSL certificates via Let's Encrypt
- Traefik basic authentication
- Isolated Docker containers
- Secure VNC access

## 🐛 Troubleshooting

### MT5 Not Connecting
1. Check MT5 server credentials in `.env`
2. Verify network connectivity
3. Check Docker logs: `docker-compose logs mt5-api`

### VNC Access Issues
1. Ensure port 6080 is accessible
2. Check VNC domain configuration
3. Verify Traefik routing

### API Connection Errors
1. Check API domain configuration
2. Verify MT5 API container is running
3. Check logs: `docker-compose logs mt5-api`

## 📚 API Documentation

Once the API is running, visit:
- Swagger UI: `https://your-api-domain.com/docs`
- ReDoc: `https://your-api-domain.com/redoc`

## 🔄 Development

### Adding New Features
1. Modify `mt5-api/main.py` for new API endpoints
2. Update React components in `src/components/mt5/`
3. Rebuild containers: `docker-compose up -d --build`

### Local Development
```bash
# Run API locally
cd mt5-api
pip install -r requirements.txt
uvicorn main:app --reload

# Run frontend locally
npm run dev
```

## 📄 License

This project is based on the [MetaTrader 5 Docker setup](https://github.com/sesto-dev/metatrader5-quant-server-python) and is licensed under MIT.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions:
- Check the [original repository](https://github.com/sesto-dev/metatrader5-quant-server-python)
- Review Docker logs for debugging
- Ensure all prerequisites are met 