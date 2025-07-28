from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import random
import json
import asyncio
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

# Pydantic models
class TradeRequest(BaseModel):
    symbol: str
    volume: float
    order_type: str  # "buy" or "sell"
    price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None

class AccountInfo(BaseModel):
    login: int
    server: str
    balance: float
    equity: float
    margin: float
    free_margin: float
    profit: float

class SymbolInfo(BaseModel):
    symbol: str
    bid: float
    ask: float
    point: float
    digits: int
    spread: float
    volume_min: float
    volume_max: float

# Mock data
mock_account = {
    "login": 12345678,
    "server": "MetaQuotes-Demo",
    "balance": 100000.0,
    "equity": 102450.0,
    "margin": 5000.0,
    "margin_free": 97450.0,
    "profit": 2450.0
}

mock_symbols = [
    {"symbol": "EURUSD", "description": "Euro vs US Dollar"},
    {"symbol": "GBPUSD", "description": "British Pound vs US Dollar"},
    {"symbol": "USDJPY", "description": "US Dollar vs Japanese Yen"},
    {"symbol": "AUDUSD", "description": "Australian Dollar vs US Dollar"},
    {"symbol": "USDCAD", "description": "US Dollar vs Canadian Dollar"},
    {"symbol": "NZDUSD", "description": "New Zealand Dollar vs US Dollar"},
    {"symbol": "EURGBP", "description": "Euro vs British Pound"},
    {"symbol": "USDCHF", "description": "US Dollar vs Swiss Franc"}
]

mock_trades = [
    {
        "ticket": 1001,
        "symbol": "EURUSD",
        "type": "buy",
        "volume": 1.0,
        "price_open": 1.0850,
        "price_current": 1.0875,
        "profit": 250.0,
        "swap": -5.0,
        "time": "2024-01-15T10:30:00",
        "magic": 234000,
        "comment": "python script order"
    },
    {
        "ticket": 1002,
        "symbol": "GBPUSD",
        "type": "sell",
        "volume": 0.5,
        "price_open": 1.2650,
        "price_current": 1.2625,
        "profit": 125.0,
        "swap": -2.5,
        "time": "2024-01-15T11:15:00",
        "magic": 234000,
        "comment": "python script order"
    }
]

mock_history = [
    {
        "ticket": 999,
        "order": 999,
        "symbol": "EURUSD",
        "type": "buy",
        "volume": 1.0,
        "price": 1.0800,
        "profit": 500.0,
        "swap": -10.0,
        "time": "2024-01-10T09:00:00",
        "magic": 234000,
        "comment": "closed trade"
    },
    {
        "ticket": 998,
        "order": 998,
        "symbol": "GBPUSD",
        "type": "sell",
        "volume": 0.5,
        "price": 1.2700,
        "profit": -75.0,
        "swap": -5.0,
        "time": "2024-01-08T14:30:00",
        "magic": 234000,
        "comment": "closed trade"
    }
]

app = FastAPI(
    title="MetaTrader 5 Mock API",
    description="Mock API for MT5 integration (local development)",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@app.get("/")
async def root():
    return {"message": "MetaTrader 5 Mock API", "status": "connected"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mt5_connected": True,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/account")
async def get_account_info():
    """Get account information"""
    return AccountInfo(
        login=mock_account["login"],
        server=mock_account["server"],
        balance=mock_account["balance"],
        equity=mock_account["equity"],
        margin=mock_account["margin"],
        free_margin=mock_account["margin_free"],
        profit=mock_account["profit"]
    )

@app.get("/symbols")
async def get_symbols():
    """Get all available symbols"""
    return mock_symbols

@app.get("/symbol/{symbol}")
async def get_symbol_info(symbol: str):
    """Get specific symbol information"""
    # Generate mock symbol data
    base_price = 1.0
    if "USD" in symbol:
        base_price = 1.0
    elif "EUR" in symbol:
        base_price = 1.08
    elif "GBP" in symbol:
        base_price = 1.26
    elif "JPY" in symbol:
        base_price = 150.0
    
    # Add some randomness
    variation = random.uniform(-0.01, 0.01)
    bid = base_price + variation
    ask = bid + 0.0002
    
    return SymbolInfo(
        symbol=symbol,
        bid=round(bid, 5),
        ask=round(ask, 5),
        point=0.0001,
        digits=5,
        spread=0.0002,
        volume_min=0.01,
        volume_max=100.0
    )

@app.get("/trades")
async def get_trades():
    """Get current open trades"""
    return mock_trades

@app.get("/history")
async def get_history(days: int = 30):
    """Get trading history"""
    return mock_history

@app.get("/rates/{symbol}")
async def get_rates(symbol: str, timeframe: str = "D1", count: int = 100):
    """Get price rates for a symbol"""
    # Generate mock price data
    base_price = 1.0
    if "USD" in symbol:
        base_price = 1.0
    elif "EUR" in symbol:
        base_price = 1.08
    elif "GBP" in symbol:
        base_price = 1.26
    elif "JPY" in symbol:
        base_price = 150.0
    
    rates = []
    for i in range(count):
        # Generate realistic price movement
        variation = random.uniform(-0.02, 0.02)
        price = base_price + variation
        
        rates.append({
            "time": int((datetime.now() - timedelta(days=count-i)).timestamp()),
            "open": round(price, 5),
            "high": round(price + random.uniform(0, 0.01), 5),
            "low": round(price - random.uniform(0, 0.01), 5),
            "close": round(price + random.uniform(-0.005, 0.005), 5),
            "tick_volume": random.randint(1000, 10000),
            "spread": 2,
            "real_volume": random.randint(100, 1000)
        })
    
    return rates

@app.post("/trade")
async def place_trade(trade: TradeRequest):
    """Place a new trade"""
    # Generate mock trade response
    new_ticket = max([t["ticket"] for t in mock_trades]) + 1 if mock_trades else 1003
    
    new_trade = {
        "ticket": new_ticket,
        "symbol": trade.symbol,
        "type": trade.order_type,
        "volume": trade.volume,
        "price_open": trade.price or 1.0850,
        "price_current": trade.price or 1.0850,
        "profit": 0.0,
        "swap": 0.0,
        "time": datetime.now().isoformat(),
        "magic": 234000,
        "comment": "python script order"
    }
    
    mock_trades.append(new_trade)
    
    return {
        "success": True,
        "ticket": new_ticket,
        "volume": trade.volume,
        "price": trade.price or 1.0850,
        "comment": "Order placed successfully"
    }

@app.delete("/trade/{ticket}")
async def close_trade(ticket: int):
    """Close a specific trade"""
    # Find and remove trade
    trade_to_close = None
    for trade in mock_trades:
        if trade["ticket"] == ticket:
            trade_to_close = trade
            break
    
    if not trade_to_close:
        raise HTTPException(status_code=404, detail=f"Trade {ticket} not found")
    
    mock_trades.remove(trade_to_close)
    
    return {
        "success": True,
        "ticket": ticket,
        "comment": "Trade closed successfully"
    }

@app.get("/stats")
async def get_trading_stats():
    """Get comprehensive trading statistics"""
    # Calculate statistics from mock data
    all_deals = mock_history + mock_trades
    total_trades = len(all_deals)
    winning_trades = len([d for d in all_deals if d["profit"] > 0])
    losing_trades = len([d for d in all_deals if d["profit"] < 0])
    win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
    
    total_profit = sum(d["profit"] for d in all_deals)
    total_swap = sum(d["swap"] for d in all_deals)
    net_profit = total_profit + total_swap
    
    open_positions = len(mock_trades)
    open_profit = sum(t["profit"] for t in mock_trades)
    
    return {
        "account": {
            "balance": mock_account["balance"],
            "equity": mock_account["equity"],
            "margin": mock_account["margin"],
            "free_margin": mock_account["margin_free"],
            "profit": mock_account["profit"]
        },
        "statistics": {
            "total_trades": total_trades,
            "winning_trades": winning_trades,
            "losing_trades": losing_trades,
            "win_rate": round(win_rate, 2),
            "total_profit": round(total_profit, 2),
            "total_swap": round(total_swap, 2),
            "net_profit": round(net_profit, 2),
            "open_positions": open_positions,
            "open_profit": round(open_profit, 2)
        },
        "performance": {
            "profit_factor": abs(total_profit / sum(d["profit"] for d in all_deals if d["profit"] < 0)) if sum(d["profit"] for d in all_deals if d["profit"] < 0) != 0 else 0,
            "average_win": sum(d["profit"] for d in all_deals if d["profit"] > 0) / winning_trades if winning_trades > 0 else 0,
            "average_loss": sum(d["profit"] for d in all_deals if d["profit"] < 0) / losing_trades if losing_trades > 0 else 0,
            "largest_win": max((d["profit"] for d in all_deals), default=0),
            "largest_loss": min((d["profit"] for d in all_deals), default=0)
        }
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data"""
    await manager.connect(websocket)
    try:
        while True:
            # Send real-time updates every 5 seconds
            data = {
                "type": "update",
                "timestamp": datetime.now().isoformat(),
                "account": {
                    "equity": mock_account["equity"] + random.uniform(-100, 100),
                    "balance": mock_account["balance"],
                    "profit": mock_account["profit"] + random.uniform(-50, 50)
                },
                "trades": len(mock_trades),
                "open_profit": sum(t["profit"] for t in mock_trades)
            }
            
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 