import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  LineSeriesOptions,
  CandlestickSeriesOptions,
  BarSeriesOptions,
  AreaSeriesOptions,
  IChartApi,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ASSETS = [
  { label: 'AAPL', value: 'AAPL' },
  { label: 'BTC/USD', value: 'BTCUSD' },
  { label: 'EUR/USD', value: 'EURUSD' },
  { label: 'Gold', value: 'XAUUSD' },
  { label: 'S&P 500', value: 'SPX' },
];

const CHART_TYPES = [
  { label: 'Line', value: 'line' },
  { label: 'Candlestick', value: 'candlestick' },
  { label: 'Bar', value: 'bar' },
  { label: 'Area', value: 'area' },
];

// Mock data generator for demo
function generateMockData(type: 'line' | 'candlestick' | 'bar' | 'area'): any[] {
  const now = Math.floor(Date.now() / 1000);
  const data = [];
  let price = 100;
  for (let i = 0; i < 100; i++) {
    const time = now - (100 - i) * 60 * 60 * 24;
    if (type === 'candlestick') {
      const open = price + (Math.random() - 0.5) * 2;
      const close = open + (Math.random() - 0.5) * 2;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      data.push({ time, open, high, low, close });
      price = close;
    } else if (type === 'bar') {
      const open = price + (Math.random() - 0.5) * 2;
      const close = open + (Math.random() - 0.5) * 2;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      data.push({ time, open, high, low, close });
      price = close;
    } else if (type === 'area' || type === 'line') {
      price += (Math.random() - 0.5) * 2;
      data.push({ time, value: price });
    }
  }
  return data;
}

const AdvancedChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [asset, setAsset] = useState(ASSETS[0].value);
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'bar' | 'area'>('line');
  const [error, setError] = useState<string | null>(null);
  const [containerReady, setContainerReady] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Observe container size and resize chart
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      setContainerSize({ width, height });
      setContainerReady(width > 0 && height > 0);
      if (chartRef.current && width > 0 && height > 0) {
        chartRef.current.resize(width, 400);
      }
    };
    handleResize();
    const resizeObserver = new window.ResizeObserver(handleResize);
    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Create chart only on asset/chartType change
  useEffect(() => {
    setError(null);
    if (!containerReady) return;
    const container = chartContainerRef.current;
    if (!container) return;
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    let chart: IChartApi | null = null;
    let series: any;
    try {
      chart = createChart(container, {
        width: containerSize.width,
        height: 400,
        layout: {
          background: { color: 'white' },
          textColor: '#222',
        },
        grid: {
          vertLines: { color: '#eee' },
          horzLines: { color: '#eee' },
        },
        timeScale: { timeVisible: true, secondsVisible: false },
      });
      chartRef.current = chart;
      const data = generateMockData(chartType);
      if (chartType === 'line') {
        series = chart.addSeries({ type: 'Line' } as any);
      } else if (chartType === 'candlestick') {
        series = chart.addSeries({ type: 'Candlestick' } as any);
      } else if (chartType === 'bar') {
        series = chart.addSeries({ type: 'Bar' } as any);
      } else if (chartType === 'area') {
        series = chart.addSeries({ type: 'Area' } as any);
      }
      if (series) {
        series.setData(data);
      }
    } catch (e: any) {
      setError('Failed to create chart: ' + (e?.message || e));
    }
    return () => {
      if (chart) {
        chart.remove();
        chartRef.current = null;
      }
    };
  }, [asset, chartType, containerReady]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Chart</CardTitle>
        <div className="flex gap-2 mt-2">
          <select
            value={asset}
            onChange={e => setAsset(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {ASSETS.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
          <select
            value={chartType}
            onChange={e => setChartType(e.target.value as 'line' | 'candlestick' | 'bar' | 'area')}
            className="border rounded px-2 py-1"
          >
            {CHART_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <Button size="sm" variant="outline">Indicators</Button>
          <Button size="sm" variant="outline">Draw Tools</Button>
          <Button size="sm" variant="outline">Export/Share</Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-600 font-semibold p-4">{error}</div>
        ) : (
          <div ref={chartContainerRef} style={{ width: '100%', height: 400 }} />
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedChart; 