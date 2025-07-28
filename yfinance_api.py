from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/quote")
def get_quote(symbol: str = Query(..., description="Ticker symbol")):
    ticker = yf.Ticker(symbol)
    info = ticker.info
    if not info or 'regularMarketPrice' not in info:
        return {"error": f"No data for symbol {symbol}"}
    return {
        'symbol': symbol,
        'name': info.get('shortName', symbol),
        'price': info.get('regularMarketPrice'),
        'currency': info.get('currency'),
        'change': info.get('regularMarketChange'),
        'changePercent': info.get('regularMarketChangePercent'),
        'previousClose': info.get('regularMarketPreviousClose'),
        'open': info.get('regularMarketOpen'),
        'high': info.get('regularMarketDayHigh'),
        'low': info.get('regularMarketDayLow'),
        'volume': info.get('regularMarketVolume'),
        'timestamp': info.get('regularMarketTime'),
    } 