import axios from 'axios';
import { getFirestore } from 'firebase-admin/firestore';

export interface MarketQuoteDTO {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

const YAHOO_API_URL = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=';
const CACHE_TTL = 60; // seconds

export async function getQuote(symbol: string): Promise<MarketQuoteDTO | null> {
  const db = getFirestore();
  const cacheRef = db.collection('market_cache').doc(symbol);
  const cacheSnap = await cacheRef.get();
  const now = Math.floor(Date.now() / 1000);
  if (cacheSnap.exists) {
    const data = cacheSnap.data();
    if (data && data.timestamp && now - data.timestamp < CACHE_TTL) {
      return data.quote;
    }
  }
  // Fetch from Yahoo
  const url = `${YAHOO_API_URL}${encodeURIComponent(symbol)}`;
  const resp = await axios.get(url);
  const q = resp.data.quoteResponse.result[0];
  if (!q) return null;
  const quote: MarketQuoteDTO = {
    symbol: q.symbol,
    name: q.shortName || q.longName || q.symbol,
    price: q.regularMarketPrice,
    currency: q.currency,
    change: q.regularMarketChange,
    changePercent: q.regularMarketChangePercent,
    previousClose: q.regularMarketPreviousClose,
    open: q.regularMarketOpen,
    high: q.regularMarketDayHigh,
    low: q.regularMarketDayLow,
    volume: q.regularMarketVolume,
    timestamp: now,
  };
  await cacheRef.set({ quote, timestamp: now });
  return quote;
} 