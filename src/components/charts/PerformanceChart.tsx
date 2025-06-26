import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceData {
  month: string;
  return: number;
  benchmark: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const formatYAxis = (tick: number) => {
    return `${tick}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          <p className="intro text-primary">{`Fund : ${payload[0].value}%`}</p>
          <p className="intro text-muted-foreground">{`Benchmark : ${payload[1].value}%`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          tickFormatter={formatYAxis} 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="return" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorReturn)" />
        <Area type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" fillOpacity={1} fill="url(#colorBenchmark)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart; 