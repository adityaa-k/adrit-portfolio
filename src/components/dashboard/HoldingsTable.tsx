import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import type { HoldingData } from '@/types/schema.ts';
import { AlertTriangle } from 'lucide-react';

export function HoldingsTable({ holdings }: { holdings: HoldingData[] }) {
    return (
        <Card className="mb-8">
            <CardHeader title="Your Holdings" subtitle="A detailed breakdown of gifted stocks" />
            <CardContent className="p-0">

                {/* Desktop Table view */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
                            <tr>
                                <th className="px-4 py-3 font-medium">Asset</th>
                                <th className="px-4 py-3 font-medium text-right">Qty</th>
                                <th className="px-4 py-3 font-medium text-right">Avg Price</th>
                                <th className="px-4 py-3 font-medium text-right">LTP</th>
                                <th className="px-4 py-3 font-medium text-right">Invested</th>
                                <th className="px-4 py-3 font-medium text-right">Current</th>
                                <th className="px-4 py-3 font-medium text-right">Day Move</th>
                                <th className="px-4 py-3 font-medium text-right">Total P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((h, i) => {
                                const isPositive = h.absolutePnL >= 0;
                                const isDayPositive = h.dayChange >= 0;
                                return (
                                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 font-medium text-zinc-200">
                                                    {h.symbol.replace('.NS', '')}
                                                    {h.error && (
                                                        <div title={`Error updating data: ${h.error}`}>
                                                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-zinc-500 truncate max-w-[150px]">{h.companyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right text-zinc-300 font-mono">{h.quantity}</td>
                                        <td className="px-4 py-3 text-right text-zinc-400 font-mono">{formatCurrency(h.buyPrice)}</td>
                                        <td className="px-4 py-3 text-right text-zinc-200 font-medium font-mono">
                                            {formatCurrency(h.currentPrice)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-zinc-400 font-mono">{formatCurrency(h.investedValue)}</td>
                                        <td className="px-4 py-3 text-right text-zinc-200 font-medium font-mono">{formatCurrency(h.currentValue)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex flex-col justify-end items-end gap-1 font-mono">
                                                <span className={isDayPositive ? 'text-emerald-400' : 'text-red-400'}>
                                                    {isDayPositive ? '+' : ''}{formatCurrency(h.dayChange)}
                                                </span>
                                                <span className={`text-[10px] ${isDayPositive ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                                                    {isDayPositive ? '+' : ''}{formatPercentage(h.dayChangePct)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex flex-col justify-end items-end gap-1 font-mono">
                                                <Badge variant={isPositive ? 'success' : 'danger'} className="ml-auto w-fit">
                                                    {isPositive ? '+' : ''}{formatCurrency(h.absolutePnL)}
                                                </Badge>
                                                <span className={`text-[10px] mt-0.5 ${isPositive ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                                                    {isPositive ? '+' : ''}{formatPercentage(h.percentagePnL)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile / Tablet cards view */}
                <div className="lg:hidden flex flex-col divide-y divide-zinc-800">
                    {holdings.map((h, i) => {
                        const isPositive = h.absolutePnL >= 0;
                        const isDayPositive = h.dayChange >= 0;
                        return (
                            <div key={i} className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-zinc-200 font-medium flex items-center gap-2">
                                            {h.symbol.replace('.NS', '')}
                                            {h.error && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                                        </div>
                                        <div className="text-xs text-zinc-500">{h.companyName}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-zinc-200 font-semibold font-mono">{formatCurrency(h.currentValue)}</div>
                                        <div className="text-xs text-zinc-500 font-mono">{h.quantity} shares</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                                    <div>
                                        <span className="text-zinc-500 text-xs block mb-1">Total P&L</span>
                                        <Badge variant={isPositive ? 'success' : 'danger'} className="font-mono text-xs">
                                            {isPositive ? '+' : ''}{formatCurrency(h.absolutePnL)} ({formatPercentage(h.percentagePnL)})
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-zinc-500 text-xs block mb-1">Day Move</span>
                                        <span className={`font-mono text-xs ${isDayPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {isDayPositive ? '+' : ''}{formatCurrency(h.dayChange)} ({formatPercentage(h.dayChangePct)})
                                        </span>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-zinc-800/50 col-span-2 flex justify-between">
                                        <span className="text-zinc-500 text-xs">Avg: {formatCurrency(h.buyPrice)}</span>
                                        <span className="text-zinc-500 text-xs">LTP: <span className="text-zinc-300 font-medium">{formatCurrency(h.currentPrice)}</span></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </CardContent>
        </Card>
    );
}
