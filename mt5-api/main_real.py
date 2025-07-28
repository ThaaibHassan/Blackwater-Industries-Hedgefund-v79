from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import os
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import json
import asyncio
from contextlib import asynccontextmanager

# Try to import MetaTrader5, fallback to mock if not available
try:
    import MetaTrader5 as mt5
    MT5_AVAILABLE = True
except ImportError:
    MT5_AVAILABLE = False
    print("⚠️  MetaTrader5 package not available. Using mock data.")

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

# MT5 Configuration
MT5_CONFIG = {
    "server": "Axi-US50-Demo",
    "login": 117044,
    "password": "0fAcUj-l",
    "company": "AxiCorp Financial Services Pty Ltd"
}

# Global variables
mt5_connected = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global mt5_connected
    if MT5_AVAILABLE:
        try:
            # Initialize MT5
            if not mt5.initialize():
                print(f"❌ MT5 initialization failed: {mt5.last_error()}")
                return
            
            # Login to MT5
            authorized = mt5.login(
                login=MT5_CONFIG["login"],
                password=MT5_CONFIG["password"],
                server=MT5_CONFIG["server"]
            )
            
            if authorized:
                mt5_connected = True
                print(f"✅ Connected to MT5: {MT5_CONFIG['server']}")
                print(f"   Login: {MT5_CONFIG['login']}")
                print(f"   Company: {MT5_CONFIG['company']}")
                
                # Get account info
                account_info = mt5.account_info()
                if account_info:
                    print(f"   Balance: ${account_info.balance}")
                    print(f"   Equity: ${account_info.equity}")
            else:
                print(f"❌ MT5 login failed: {mt5.last_error()}")
                
        except Exception as e:
            print(f"❌ Error connecting to MT5: {e}")
    else:
        print("⚠️  Using mock MT5 data (MetaTrader5 package not available)")
        mt5_connected = True  # Mock mode
    
    yield
    
    # Shutdown
    if MT5_AVAILABLE and mt5_connected:
        mt5.shutdown()

app = FastAPI(
    title="MetaTrader 5 Real API",
    description="Real MT5 API for AxiCorp account",
    version="1.0.0",
    lifespan=lifespan
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
    return {
        "message": "MetaTrader 5 Real API", 
        "status": "connected" if mt5_connected else "disconnected",
        "server": MT5_CONFIG["server"],
        "login": MT5_CONFIG["login"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if mt5_connected else "unhealthy",
        "mt5_connected": mt5_connected,
        "server": MT5_CONFIG["server"],
        "login": MT5_CONFIG["login"],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/account")
async def get_account_info():
    """Get account information"""
    if not mt5_connected:
        raise HTTPException(status_code=503, detail="MT5 not connected")
    
    try:
        if MT5_AVAILABLE:
            account_info = mt5.account_info()
            if account_info is None:
                raise HTTPException(status_code=500, detail="Failed to get account info")
            
            return AccountInfo(
                login=account_info.login,
                server=account_info.server,
                balance=account_info.balance,
                equity=account_info.equity,
                margin=account_info.margin,
                free_margin=account_info.margin_free,
                profit=account_info.profit
            )
        else:
            # Mock data for development
            return AccountInfo(
                login=MT5_CONFIG["login"],
                server=MT5_CONFIG["server"],
                balance=100000.0,
                equity=102450.0,
                margin=5000.0,
                free_margin=97450.0,
                profit=2450.0
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting account info: {str(e)}")

@app.get("/symbols")
async def get_symbols():
    """Get all available symbols"""
    if not mt5_connected:
        raise HTTPException(status_code=503, detail="MT5 not connected")
    
    try:
        if MT5_AVAILABLE:
            symbols = mt5.symbols_get()
            if symbols is None:
                raise HTTPException(status_code=500, detail="Failed to get symbols")
            
            return [{"symbol": symbol.name, "description": symbol.description} for symbol in symbols]
        else:
            # Mock symbols
            return [
                {"symbol": "EURUSD", "description": "Euro vs US Dollar"},
                {"symbol": "GBPUSD", "description": "British Pound vs US Dollar"},
                {"symbol": "USDJPY", "description": "US Dollar vs Japanese Yen"},
                {"symbol": "AUDUSD", "description": "Australian Dollar vs US Dollar"},
                {"symbol": "USDCAD", "description": "US Dollar vs Canadian Dollar"},
                {"symbol": "NZDUSD", "description": "New Zealand Dollar vs US Dollar"},
                {"symbol": "EURGBP", "description": "Euro vs British Pound"},
                {"symbol": "USDCHF", "description": "US Dollar vs Swiss Franc"}
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting symbols: {str(e)}")

@app.get("/symbol/{symbol}")
async def get_symbol_info(symbol: str):
    """Get specific symbol information"""
    if not mt5_connected:
        raise HTTPException(status_code=503, detail="MT5 not connected")
    
    try:
        if MT5_AVAILABLE:
            symbol_info = mt5.symbol_info(symbol)
            if symbol_info is None:
                raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found")
            
            return SymbolInfo(
                symbol=symbol_info.name,
                bid=symbol_info.bid,
                ask=symbol_info.ask,
                point=symbol_info.point,
                digits=symbol_info.digits,
                spread=symbol_info.spread,
                volume_min=symbol_info.volume_min,
                volume_max=symbol_info.volume_max
            )
        else:
            # Mock symbol info
            return SymbolInfo(
                symbol=symbol,
                bid=1.0850,
                ask=1.0852,
                point=0.0001,
                digits=5,
                spread=2,
                volume_min=0.01,
                volume_max=100.0
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting symbol info: {str(e)}")

@app.get("/trades")
async def get_trades():
    """Get current open trades"""
    if not mt5_connected:
        raise HTTPException(status_code=503, detail="MT5 not connected")
    
    try:
        if MT5_AVAILABLE:
            trades = mt5.positions_get()
            if trades is None:
                return []
            
            trades_list = []
            for trade in trades:
                trades_list.append({
                    "ticket": trade.ticket,
                    "symbol": trade.symbol,
                    "type": "buy" if trade.type == 0 else "sell",
                    "volume": trade.volume,
                    "price_open": trade.price_open,
                    "price_current": trade.price_current,
                    "profit": trade.profit,
                    "swap": trade.swap,
                    "time": trade.time,
                    "magic": trade.magic,
                    "comment": trade.comment
                })
            
            return trades_list
        else:
            # Mock trades
            return [
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
                }
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting trades: {str(e)}")

@app.get("/history")
async def get_history(days: int = 30):
    """Get trading history"""
    if not mt5_connected:
        raise HTTPException(status_code=503, detail="MT5 not connected")
    
    try:
        if MT5_AVAILABLE:
            from_date = datetime.now() - timedelta(days=days)
            deals = mt5.history_deals_get(from_date, datetime.now())
            
            if deals is None:
                return []
            
            history_list = []
            for deal in deals:
                history_list.append({
                    "ticket": deal.ticket,
                    "order": deal.order,
                    "symbol": deal.symbol,
                    "type": "buy" if deal.type == 0 else "sell",
                    "volume": deal.volume,
                    "price": deal.price,
                    "profit": deal.profit,
                    "swap": deal.swap,
                    "time": deal.time,
                    "magic": deal.magic,
                    "comment": deal.comment
                })
            
            return history_list
        else:
            # Mock history
            return [
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
                }
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting history: {str(e)}")

@app.get("/rates/{symbol}")
async def get_rates(symbol: str, timeframe: str = "D1", count: int = 100):
    """Get price rates for a symbol"""
    if not mt5_connected:
        raise HTTPException(status_code=503, detail="MT5 not connected")
    
    try:
        if MT5_AVAILABLE:
            # Map timeframe string to MT5 constant
            timeframe_map = {
                "M1": mt5.TIMEFRAME_M1,
                "M5": mt5.TIMEFRAME_M5,
                "M15": mt5.TIMEFRAME_M15,
                "M30": mt5.TIMEFRAME_M30,
                "H1": mt5.TIMEFRAME_H1,
                "H4": mt5.TIMEFRAME_H4,
                "D1": mt5.TIMEFRAME_D1,
                "W1": mt5.TIMEFRAME_W1,
                "MN1": mt5.TIMEFRAME_MN1
            }
            
            tf = timeframe_map.get(timeframe, mt5.TIMEFRAME_D1)
            rates = mt5.copy_rates_from_pos(symbol, tf, 0, count)
            
            if rates is None:
                raise HTTPException(status_code=404, detail=f"No rates found for {symbol}")
            
            rates_list = []
            for rate in rates:
                rates_list.append({
                    "time": rate.time,
                    "open": rate.open,
                    "high": rate.high,
                    "low": rate.low,
                    "close": rate.close,
                    "tick_volume": rate.tick_volume,
                    "spread": rate.spread,
                    "real_volume": rate.real_volume
                })
            
            return rates_list
        else:
            # Mock rates
            import random
            rates = []
            for i in range(count):
                rates.append({
                    "time": int((datetime.now() - timedelta(days=count-i)).timestamp()),
                    "open": 1.0850 + random.uniform(-0.01, 0.01),
                    "high": 1.0870 + random.uniform(0, 0.01),
                    "low": 1.0830 + random.uniform(-0.01, 0),
                    "close": 1.0850 + random.uniform(-0.005, 0.005),
                    "tick_volume": random.randint(1000, 10000),
                    "spread": 2,
                    "real_volume": random.randint(100, 1000)
                })
            return rates
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting rates: {str(e)}")

@app.post("/trade")
async def place_trade(trade: TradeRequest):
    """Place a new trade"""
    if not mt5_connected:
        raise HTTPException(status_code=503, detail="MT5 not connected")
    
    try:
        if MT5_AVAILABLE:
            # Get symbol info
            symbol_info = mt5.symbol_info(trade.symbol)
            if symbol_info is None:
                raise HTTPException(status_code=404, detail=f"Symbol {trade.symbol} not found")
            
            # Prepare trade request
            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": trade.symbol,
                "volume": trade.volume,
                "type": mt5.ORDER_TYPE_BUY if trade.order_type == "buy" else mt5.ORDER_TYPE_SELL,
                "price": trade.price or (symbol_info.ask if trade.order_type == "buy" else symbol_info.bid),
                "deviation": 20,
                "magic": 234000,
                "comment": "python script order",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }
            
            # Add stop loss and take profit if provided
            if trade.stop_loss:
                request["sl"] = trade.stop_loss
            if trade.take_profit:
                request["tp"] = trade.take_profit
            
            # Send order
            result = mt5.order_send(request)
            if result.retcode != mt5.TRADE_RETCODE_DONE:
                raise HTTPException(status_code=400, detail=f"Order failed: {result.comment}")
            
            return {
                "success": True,
                "ticket": result.order,
                "volume": result.volume,
                "price": result.price,
                "comment": result.comment
            }
        else:
            # Mock trade
            return {
                "success": True,
                "ticket": 1003,
                "volume": trade.volume,
                "price": trade.price or 1.0850,
                "comment": "Mock order placed successfully"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error placing trade: {str(e)}")

@app.delete("/trade/{ticket}")
async def close_trade(ticket: int):
    """Close a specific trade"""
    if not mt5_connected:
        raise HTTPException(status_code=503, detail="MT5 not connected")
    
    try:
        if MT5_AVAILABLE:
            # Get position
            position = mt5.positions_get(ticket=ticket)
            if not position:
                raise HTTPException(status_code=404, detail=f"Trade {ticket} not found")
            
            position = position[0]
            
            # Prepare close request
            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": position.symbol,
                "volume": position.volume,
                "type": mt5.ORDER_TYPE_SELL if position.type == 0 else mt5.ORDER_TYPE_BUY,
                "position": ticket,
                "price": mt5.symbol_info_tick(position.symbol).bid if position.type == 0 else mt5.symbol_info_tick(position.symbol).ask,
                "deviation": 20,
                "magic": 234000,
                "comment": "python script close",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }
            
            # Send close order
            result = mt5.order_send(request)
            if result.retcode != mt5.TRADE_RETCODE_DONE:
                raise HTTPException(status_code=400, detail=f"Close failed: {result.comment}")
            
            return {
                "success": True,
                "ticket": result.order,
                "comment": result.comment
            }
        else:
            # Mock close
            return {
                "success": True,
                "ticket": ticket,
                "comment": "Mock trade closed successfully"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error closing trade: {str(e)}")

@app.get("/stats")
async def get_trading_stats():
    """Get comprehensive trading statistics"""
    if not mt5_connected:
        raise HTTPException(status_code=503, detail="MT5 not connected")
    
    try:
        if MT5_AVAILABLE:
            # Get account info
            account_info = mt5.account_info()
            
            # Get current trades
            trades = mt5.positions_get() or []
            
            # Get history
            from_date = datetime.now() - timedelta(days=30)
            deals = mt5.history_deals_get(from_date, datetime.now()) or []
            
            # Calculate statistics
            total_trades = len(deals)
            winning_trades = len([d for d in deals if d.profit > 0])
            losing_trades = len([d for d in deals if d.profit < 0])
            win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
            
            total_profit = sum(d.profit for d in deals)
            total_swap = sum(d.swap for d in deals)
            net_profit = total_profit + total_swap
            
            # Current open positions
            open_positions = len(trades)
            open_profit = sum(t.profit for t in trades)
            
            return {
                "account": {
                    "balance": account_info.balance,
                    "equity": account_info.equity,
                    "margin": account_info.margin,
                    "free_margin": account_info.margin_free,
                    "profit": account_info.profit
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
                    "profit_factor": abs(total_profit / sum(d.profit for d in deals if d.profit < 0)) if sum(d.profit for d in deals if d.profit < 0) != 0 else 0,
                    "average_win": sum(d.profit for d in deals if d.profit > 0) / winning_trades if winning_trades > 0 else 0,
                    "average_loss": sum(d.profit for d in deals if d.profit < 0) / losing_trades if losing_trades > 0 else 0,
                    "largest_win": max((d.profit for d in deals), default=0),
                    "largest_loss": min((d.profit for d in deals), default=0)
                }
            }
        else:
            # Mock stats
            return {
                "account": {
                    "balance": 100000.0,
                    "equity": 102450.0,
                    "margin": 5000.0,
                    "free_margin": 97450.0,
                    "profit": 2450.0
                },
                "statistics": {
                    "total_trades": 4,
                    "winning_trades": 3,
                    "losing_trades": 1,
                    "win_rate": 75.0,
                    "total_profit": 1000.0,
                    "total_swap": -50.0,
                    "net_profit": 950.0,
                    "open_positions": 1,
                    "open_profit": 250.0
                },
                "performance": {
                    "profit_factor": 2.5,
                    "average_win": 250.0,
                    "average_loss": -75.0,
                    "largest_win": 500.0,
                    "largest_loss": -75.0
                }
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data"""
    await manager.connect(websocket)
    try:
        while True:
            # Send real-time updates every 5 seconds
            if mt5_connected:
                if MT5_AVAILABLE:
                    account_info = mt5.account_info()
                    trades = mt5.positions_get() or []
                else:
                    # Mock data
                    account_info = type('obj', (object,), {
                        'equity': 102450.0,
                        'balance': 100000.0,
                        'profit': 2450.0
                    })()
                    trades = []
                
                data = {
                    "type": "update",
                    "timestamp": datetime.now().isoformat(),
                    "account": {
                        "equity": account_info.equity,
                        "balance": account_info.balance,
                        "profit": account_info.profit
                    },
                    "trades": len(trades),
                    "open_profit": sum(t.profit for t in trades) if trades else 0
                }
                
                await websocket.send_text(json.dumps(data))
            
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 