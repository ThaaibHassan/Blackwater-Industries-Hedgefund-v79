#!/bin/bash

echo "🚀 Starting MetaTrader 5 Integration (Local Development)"
echo "========================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Create Docker network if it doesn't exist
echo "📦 Creating Docker network..."
docker network create traefik-public 2>/dev/null || echo "Network already exists"

# Create local environment file
if [ ! -f .env ]; then
    echo "📝 Creating local .env file..."
    cat > .env << EOF
# MetaTrader 5 Configuration
CUSTOM_USER=admin
PASSWORD=admin123
VNC_DOMAIN=localhost

# Traefik Configuration (local)
TRAEFIK_DOMAIN=localhost
TRAEFIK_USERNAME=admin
TRAEFIK_HASHED_PASSWORD=\$apr1\$admin123
ACME_EMAIL=admin@localhost

# MT5 API Configuration
MT5_SERVER=your_mt5_server
MT5_LOGIN=your_mt5_login
MT5_PASSWORD=your_mt5_password
MT5_DEMO=true

# Domain Configuration (local)
API_DOMAIN=localhost
FRONTEND_DOMAIN=localhost
EOF
    echo "✅ Local environment created!"
    echo "⚠️  Please update MT5 credentials in .env file before starting"
    echo ""
    echo "Press Enter to continue..."
    read
fi

# Build and start services
echo "🐳 Building and starting Docker services..."
docker-compose up -d --build

echo ""
echo "🎉 Local setup complete!"
echo ""
echo "📊 Services available at:"
echo "   - MT5 VNC Access: http://localhost:6080"
echo "   - MT5 API: http://localhost:8000"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "📋 Next steps:"
echo "   1. Access MT5 VNC at http://localhost:6080"
echo "   2. Configure your MT5 account in the VNC interface"
echo "   3. Update MT5 API credentials in .env file"
echo "   4. Access the frontend at http://localhost:3000"
echo ""
echo "🔧 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart services: docker-compose restart"
echo ""
echo "📚 API Documentation: http://localhost:8000/docs" 