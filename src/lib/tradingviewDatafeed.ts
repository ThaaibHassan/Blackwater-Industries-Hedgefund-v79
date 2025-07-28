// TradingView Datafeed for integration with FastAPI yfinance backend
// Docs: https://www.tradingview.com/charting-library-docs/latest/api/datafeed/

const supportedResolutions = ['1', '5', '15', '30', '60', 'D', 'W', 'M'];

export const datafeed = {
  onReady: (callback: any) => {
    setTimeout(() => callback({
      supported_resolutions: supportedResolutions,
      exchanges: [{ value: '', name: 'All', desc: '' }],
      symbols_types: [{ name: 'All', value: '' }],
    }), 0);
  },

  resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
    // For demo, just resolve as a stock
    setTimeout(() => {
      onSymbolResolvedCallback({
        name: symbolName,
        ticker: symbolName,
        type: 'stock',
        session: '0930-1600',
        timezone: 'America/New_York',
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        supported_resolutions: supportedResolutions,
        volume_precision: 2,
        data_status: 'streaming',
      });
    }, 0);
  },

  getBars: async (symbolInfo: any, resolution: string, from: number, to: number, onHistoryCallback: any, onErrorCallback: any) => {
    try {
      // Map TradingView resolution to yfinance interval
      const intervalMap: Record<string, string> = {
        '1': '1m', '5': '5m', '15': '15m', '30': '30m', '60': '60m', 'D': '1d', 'W': '1wk', 'M': '1mo',
      };
      const interval = intervalMap[resolution] || '1d';
      const url = `http://localhost:8000/history?symbol=${symbolInfo.name}&interval=${interval}&from=${from}&to=${to}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.error || !data.t) return onHistoryCallback([], { noData: true });
      const bars = data.t.map((t: number, i: number) => ({
        time: t * 1000,
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i],
      }));
      onHistoryCallback(bars, { noData: false });
    } catch (err) {
      onErrorCallback(err);
    }
  },

  subscribeBars: (symbolInfo: any, resolution: string, onRealtimeCallback: any, subscribeUID: string, onResetCacheNeededCallback: any) => {
    // Simple polling for demo
    let lastBarTime = 0;
    const poll = async () => {
      const now = Math.floor(Date.now() / 1000);
      const url = `http://localhost:8000/history?symbol=${symbolInfo.name}&interval=${resolution}&from=${now - 3600}&to=${now}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.t && data.t.length) {
        const i = data.t.length - 1;
        const bar = {
          time: data.t[i] * 1000,
          open: data.o[i],
          high: data.h[i],
          low: data.l[i],
          close: data.c[i],
          volume: data.v[i],
        };
        if (bar.time !== lastBarTime) {
          lastBarTime = bar.time;
          onRealtimeCallback(bar);
        }
      }
      datafeed._pollingHandles[subscribeUID] = setTimeout(poll, 5000);
    };
    poll();
  },

  unsubscribeBars: (subscribeUID: string) => {
    if (datafeed._pollingHandles[subscribeUID]) {
      clearTimeout(datafeed._pollingHandles[subscribeUID]);
      delete datafeed._pollingHandles[subscribeUID];
    }
  },

  _pollingHandles: {} as Record<string, any>,
}; 