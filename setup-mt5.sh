#!/bin/bash

echo "🚀 Setting up MetaTrader 5 Docker Environment"
echo "=============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create Docker network if it doesn't exist
echo "📦 Creating Docker network..."
docker network create traefik-public 2>/dev/null || echo "Network already exists"

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.mt5 .env
    echo "⚠️  Please edit .env file with your configuration before starting services"
    echo "   - Update domain names"
    echo "   - Set MT5 server credentials"
    echo "   - Configure passwords"
    echo ""
    echo "Press Enter to continue after editing .env file..."
    read
fi

# Generate hashed password for Traefik
echo "🔐 Generating hashed password for Traefik..."
read -s -p "Enter password for Traefik dashboard: " traefik_password
echo ""
hashed_password=$(openssl passwd -apr1 "$traefik_password")
sed -i.bak "s/TRAEFIK_HASHED_PASSWORD=.*/TRAEFIK_HASHED_PASSWORD=$hashed_password/" .env

echo "✅ Environment configured!"

# Build and start services
echo "🐳 Building and starting Docker services..."
docker-compose up -d --build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📊 Services:"
echo "   - MT5 VNC Access: https://your-vnc-domain.com"
echo "   - Traefik Dashboard: https://your-traefik-domain.com"
echo "   - MT5 API: https://your-api-domain.com"
echo "   - Frontend: https://your-frontend-domain.com"
echo ""
echo "📋 Next steps:"
echo "   1. Update your DNS to point domains to this server"
echo "   2. Access MT5 VNC to configure your trading account"
echo "   3. Update MT5 API credentials in .env file"
echo "   4. Access the frontend to view trading statistics"
echo ""
echo "🔧 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart services: docker-compose restart"
echo ""
echo "📚 Documentation: https://github.com/sesto-dev/metatrader5-quant-server-python" 