import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { HoldingData } from '@/types/schema.ts';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

export function Charts({ holdings }: { holdings: HoldingData[] }) {

    const allocationData = useMemo(() => {
        return holdings
            .filter(h => h.currentValue > 0)
            .map(h => ({
                name: h.symbol.replace('.NS', ''),
                value: h.currentValue
            }))
            .sort((a, b) => b.value - a.value);
    }, [holdings]);

    const pnlData = useMemo(() => {
        return holdings.map(h => ({
            name: h.symbol.replace('.NS', ''),
            pnl: h.absolutePnL
        })).sort((a, b) => b.pnl - a.pnl);
    }, [holdings]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl text-sm">
                    <p className="font-medium text-zinc-200 mb-1">{payload[0].name}</p>
                    <p className="text-zinc-400 font-mono">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <Card>
                <CardHeader title="Portfolio Allocation" subtitle="Current value weight per holding" />
                <CardContent className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="transparent"
                            >
                                {allocationData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Holding P&L" subtitle="Absolute gain/loss per asset" />
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pnlData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#71717a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
                            <Bar dataKey="pnl" radius={[4, 4, 4, 4]}>
                                {pnlData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#f43f5e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
