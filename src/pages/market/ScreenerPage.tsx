import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWatchlists } from '@/context/WatchlistContext';
import { restClient } from '@polygon.io/client-js';

// Locally defined widgets
// import AdvancedChart from '@/components/charts/AdvancedChart';
import { datafeed } from '@/lib/tradingviewDatafeed';

// Fix for window.TradingView type
declare global {
  interface Window {
    TradingView: any;
  }
}

// TradingViewChart component
const TradingViewChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.TradingView) return;
    if (!containerRef.current) return;
    // Remove previous widget if any
    containerRef.current.innerHTML = '';
    // @ts-ignore
    new window.TradingView.widget({
      symbol,
      interval: 'D',
      container_id: containerRef.current.id,
      datafeed,
      library_path: '/tradingview/', // adjust if needed
      locale: 'en',
      width: '100%',
      height: 500,
      theme: 'light',
      autosize: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      studies_overrides: {},
    });
  }, [symbol]);
  return <div id="tv_chart_container" ref={containerRef} style={{ width: '100%', height: 500 }} />;
};

const WatchlistWidget = () => {
  const { watchlists, loading, addAssetToWatchlist, removeAssetFromWatchlist } = useWatchlists();
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  if (loading) return <div>Loading watchlists...</div>;
  if (!watchlists.length) return <div>No watchlists found.</div>;
  const watchlist = watchlists[0];
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Watchlist: {watchlist.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (symbol && name) {
              await addAssetToWatchlist(watchlist.id, { symbol, name });
              setSymbol('');
              setName('');
            }
          }}
          className="flex gap-2 mb-4"
        >
          <input
            className="border rounded px-2 py-1"
            placeholder="Symbol"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button type="submit" size="sm">Add</Button>
        </form>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Symbol</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.assets.map(asset => (
              <tr key={asset.symbol}>
                <td className="p-2">{asset.symbol}</td>
                <td className="p-2">{asset.name}</td>
                <td className="p-2">
                  <Button size="sm" variant="destructive" onClick={() => removeAssetFromWatchlist(watchlist.id, asset.symbol)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

const GlobalIndicesWidget: React.FC = () => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle>Global Indices (Sample Widget)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex gap-4">
        <div>
          <div className="font-bold">S&P 500</div>
          <div>4,500.00</div>
        </div>
        <div>
          <div className="font-bold">NASDAQ</div>
          <div>14,000.00</div>
        </div>
        <div>
          <div className="font-bold">FTSE 100</div>
          <div>7,200.00</div>
        </div>
        <div>
          <div className="font-bold">NIKKEI 225</div>
          <div>32,000.00</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const BondYieldsWidget: React.FC = () => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle>Bond Yields (Sample Widget)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex gap-4">
        <div>
          <div className="font-bold">US 10Y</div>
          <div>4.25%</div>
        </div>
        <div>
          <div className="font-bold">US 2Y</div>
          <div>4.75%</div>
        </div>
        <div>
          <div className="font-bold">DE 10Y</div>
          <div>2.50%</div>
        </div>
        <div>
          <div className="font-bold">JP 10Y</div>
          <div>0.60%</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FXHeatmapWidget: React.FC = () => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle>FX Heatmap (Sample Widget)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex gap-4">
        <div>
          <div className="font-bold">EUR/USD</div>
          <div className="text-green-600">+0.45%</div>
        </div>
        <div>
          <div className="font-bold">USD/JPY</div>
          <div className="text-red-600">-0.20%</div>
        </div>
        <div>
          <div className="font-bold">GBP/USD</div>
          <div className="text-green-600">+0.30%</div>
        </div>
        <div>
          <div className="font-bold">AUD/USD</div>
          <div className="text-red-600">-0.10%</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ASSET_TYPES = [
  { label: 'Equities', value: 'equity' },
  { label: 'ETFs', value: 'etf' },
  { label: 'Bonds', value: 'bond' },
  { label: 'FX', value: 'fx' },
  { label: 'Crypto', value: 'crypto' },
];

const FILTERS = [
  { label: 'Market Cap > $1B', value: 'marketcap1b' },
  { label: 'P/E < 20', value: 'pe20' },
  { label: 'Dividend Yield > 2%', value: 'div2' },
  { label: 'Volume > 1M', value: 'vol1m' },
  // Add more sample filters here
];

const SAMPLE_SYMBOLS = ['AAPL', 'TSLA', 'NVDA'];

// --- TradingView Widget Components ---
const TradingViewWidget = ({ scriptSrc, config, style = {} }: { scriptSrc: string, config: any, style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    ref.current.appendChild(script);
  }, [scriptSrc, config]);
  return <div ref={ref} style={style} />;
};

const TickerTape = () => (
  <TradingViewWidget
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
    config={{
      symbols: [
        { proName: 'NASDAQ:AAPL', title: 'Apple' },
        { proName: 'NASDAQ:TSLA', title: 'Tesla' },
        { proName: 'NASDAQ:NVDA', title: 'NVIDIA' },
        { proName: 'NASDAQ:MSFT', title: 'Microsoft' },
        { proName: 'NASDAQ:GOOGL', title: 'Google' },
      ],
      colorTheme: 'dark',
      isTransparent: false,
      displayMode: 'regular',
      locale: 'en',
    }}
    style={{ minHeight: 50, width: '100%' }}
  />
);

const AdvancedChart = () => (
  <TradingViewWidget
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    config={{
      symbol: 'NASDAQ:AAPL',
      interval: 'D',
      timezone: 'America/New_York',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: [],
      container_id: 'tradingview_advanced_chart',
      width: '100%',
      height: 500,
    }}
    style={{ minHeight: 500, width: '100%', maxWidth: '100vw' }}
  />
);

const Watchlist = () => (
  <TradingViewWidget
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
    config={{
      colorTheme: 'dark',
      dateRange: '12M',
      showChart: true,
      locale: 'en',
      largeChartUrl: '',
      isTransparent: false,
      showSymbolLogo: true,
      width: '100%',
      height: 400,
      plotLineColorGrowing: 'rgba(33, 150, 243, 1)',
      plotLineColorFalling: 'rgba(33, 150, 243, 1)',
      gridLineColor: 'rgba(240, 243, 250, 0)',
      scaleFontColor: 'rgba(120, 123, 134, 1)',
      belowLineFillColorGrowing: 'rgba(33, 150, 243, 0.12)',
      belowLineFillColorFalling: 'rgba(33, 150, 243, 0.12)',
      symbolActiveColor: 'rgba(33, 150, 243, 0.12)',
      tabs: [
        {
          title: 'Stocks',
          symbols: [
            { s: 'NASDAQ:AAPL', d: 'Apple' },
            { s: 'NASDAQ:TSLA', d: 'Tesla' },
            { s: 'NASDAQ:NVDA', d: 'NVIDIA' },
            { s: 'NASDAQ:MSFT', d: 'Microsoft' },
            { s: 'NASDAQ:GOOGL', d: 'Google' },
          ],
          originalTitle: 'Stocks',
        },
        {
          title: 'Indices',
          symbols: [
            { s: 'INDEX:SPX', d: 'S&P 500' },
            { s: 'INDEX:IUXX', d: 'NASDAQ 100' },
            { s: 'INDEX:DJI', d: 'Dow 30' },
            { s: 'INDEX:VIX', d: 'VIX' },
          ],
          originalTitle: 'Indices',
        },
      ],
    }}
    style={{ minHeight: 400, width: '100%' }}
  />
);

const Heatmap = () => (
  <TradingViewWidget
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js"
    config={{
      width: '100%',
      height: 400,
      currencies: [
        'EUR',
        'USD',
        'JPY',
        'GBP',
        'AUD',
        'CAD',
        'CHF',
        'NZD',
      ],
      isTransparent: false,
      colorTheme: 'dark',
      locale: 'en',
    }}
    style={{ minHeight: 400, width: '100%' }}
  />
);

const Screener = () => (
  <TradingViewWidget
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
    config={{
      width: '100%',
      height: 500,
      defaultColumn: 'overview',
      screener_type: 'stock',
      displayCurrency: 'USD',
      colorTheme: 'dark',
      locale: 'en',
    }}
    style={{ minHeight: 500, width: '100%' }}
  />
);

const SymbolDetails = () => (
  <TradingViewWidget
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
    config={{
      symbol: 'NASDAQ:AAPL',
      width: '100%',
      colorTheme: 'dark',
      isTransparent: false,
      locale: 'en',
    }}
    style={{ minHeight: 200, width: '100%' }}
  />
);

const News = () => (
  <TradingViewWidget
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-news.js"
    config={{
      colorTheme: 'dark',
      isTransparent: false,
      displayMode: 'adaptive',
      locale: 'en',
      feedMode: 'all_symbols',
    }}
    style={{ minHeight: 400, width: '100%' }}
  />
);

const Calendar = () => (
  <TradingViewWidget
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-events.js"
    config={{
      colorTheme: 'dark',
      isTransparent: false,
      width: '100%',
      height: 400,
      locale: 'en',
    }}
    style={{ minHeight: 400, width: '100%' }}
  />
);

const STOCK_SYMBOLS = ['AAPL', 'TSLA', 'NVDA'];
const CRYPTO_SYMBOLS = ['BTC-USD', 'ETH-USD', 'SOL-USD'];
const FOREX_SYMBOLS = ['EURUSD=X', 'USDJPY=X', 'GBPUSD=X'];

// Simple SVG Line Chart component
const SimpleLineChart = ({ data, width = 200, height = 60, color = '#4F46E5' }: { data: number[]; width?: number; height?: number; color?: string }) => {
  if (!data.length) return <svg width={width} height={height} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ background: '#18181b', borderRadius: 4 }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

const CORS_PROXY = 'https://corsproxy.io/?';

const ScreenerPage: React.FC = () => {
  const [assetClass, setAssetClass] = useState<'stocks' | 'crypto' | 'forex'>('stocks');
  const [quotes, setQuotes] = useState<any[]>([]);
  const [history, setHistory] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let symbols: string[] = [];
    if (assetClass === 'stocks') symbols = STOCK_SYMBOLS;
    if (assetClass === 'crypto') symbols = CRYPTO_SYMBOLS;
    if (assetClass === 'forex') symbols = FOREX_SYMBOLS;

    // Use Yahoo Finance for all asset classes
    Promise.all(
      symbols.map(async symbol => {
        try {
          const res = await fetch(`${CORS_PROXY}https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
          const data = await res.json();
          const q = data.quoteResponse.result[0];
          if (!q) throw new Error('No data');
          return {
            symbol: q.symbol,
            name: q.shortName || q.longName || q.symbol,
            price: q.regularMarketPrice,
            change: q.regularMarketChange,
            changePercent: q.regularMarketChangePercent,
            volume: q.regularMarketVolume,
          };
        } catch (err: any) {
          return { symbol, error: err.message };
        }
      })
    )
      .then(setQuotes)
      .catch(e => setError(e.message));
    // Fetch historical data (Yahoo)
    Promise.all(
      symbols.map(async symbol => {
        try {
          const res = await fetch(`${CORS_PROXY}https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`);
          const data = await res.json();
          const closes = data.chart.result?.[0]?.indicators?.quote?.[0]?.close || [];
          return { symbol, closes };
        } catch {
          return { symbol, closes: [] };
        }
      })
    ).then(results => {
      const hist: Record<string, number[]> = {};
      results.forEach(r => { hist[r.symbol] = r.closes; });
      setHistory(hist);
    });
    setLoading(false);
  }, [assetClass]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-2 md:px-6">
      <h1 className="text-3xl font-bold">Market Screener</h1>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${assetClass === 'stocks' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}
          onClick={() => setAssetClass('stocks')}
        >Stocks</button>
        <button
          className={`px-4 py-2 rounded ${assetClass === 'crypto' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}
          onClick={() => setAssetClass('crypto')}
        >Crypto</button>
        <button
          className={`px-4 py-2 rounded ${assetClass === 'forex' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}
          onClick={() => setAssetClass('forex')}
        >Forex</button>
      </div>
      {loading ? (
        <div>Loading market data...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full text-sm bg-zinc-900 text-white rounded shadow">
          <thead>
            <tr>
              <th className="text-left p-2">Symbol</th>
              <th className="text-left p-2">Name</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">Change</th>
              <th className="text-right p-2">Volume</th>
              <th className="text-right p-2">30d Chart</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(q =>
              q.error ? (
                <tr key={q.symbol}>
                  <td className="p-2">{q.symbol}</td>
                  <td className="p-2 text-red-600" colSpan={5}>Error: {q.error}</td>
                </tr>
              ) : (
                <tr key={q.symbol}>
                  <td className="p-2">{q.symbol}</td>
                  <td className="p-2">{q.name}</td>
                  <td className="p-2 text-right">{q.price !== undefined ? `$${q.price.toFixed(2)}` : '-'}</td>
                  <td className={`p-2 text-right ${q.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>{q.change !== undefined ? `${q.change.toFixed(2)} (${q.changePercent ? q.changePercent.toFixed(2) : '0'}%)` : '-'}</td>
                  <td className="p-2 text-right">{q.volume !== undefined ? q.volume.toLocaleString() : '-'}</td>
                  <td className="p-2 text-right"><SimpleLineChart data={history[q.symbol] || []} /></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScreenerPage; 