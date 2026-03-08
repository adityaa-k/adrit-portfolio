import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { HistoricalDataSnapshot } from '@/types/schema.ts';
import { formatCurrency } from '@/lib/utils';
import { parseISO } from 'date-fns';

export function HistoryChart({ history }: { history: HistoricalDataSnapshot }) {
    const chartData = useMemo(() => {
        if (!history || history.length === 0) return [];

        // Sort chronologically just in case
        return [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [history]);

    if (chartData.length < 2) {
        return (
            <Card>
                <CardHeader title="Portfolio Growth" subtitle="Historical value trend" />
                <CardContent className="h-[300px] flex items-center justify-center text-zinc-500">
                    Not enough historical data collected yet. Check back tomorrow!
                </CardContent>
            </Card>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl text-sm">
                    <p className="font-medium text-zinc-200 mb-2">{label}</p>
                    <div className="flex justify-between gap-4 mb-1">
                        <span className="text-zinc-400">Current Val:</span>
                        <span className="text-emerald-400 font-mono">{formatCurrency(payload[0].value)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-zinc-400">Invested:</span>
                        <span className="text-blue-400 font-mono">{formatCurrency(payload[1].value)}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader title="Portfolio Growth" subtitle="Historical value trend" />
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(dateStr) => {
                                const date = parseISO(dateStr);
                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="currentValue"
                            name="Current Value"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                        <Area
                            type="monotone"
                            dataKey="totalInvested"
                            name="Invested"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorInvested)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
