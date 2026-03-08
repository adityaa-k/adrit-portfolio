
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, IndianRupee, PieChart, Activity } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import type { PortfolioData } from '@/types/schema.ts';

export function KPIGrid({ data }: { data: PortfolioData }) {
    const isPositive = data.absolutePnL >= 0;
    const isDayPositive = data.dayChange >= 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
                <CardContent className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-sm font-medium">Current Value</span>
                        <IndianRupee className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-zinc-50">
                        {formatCurrency(data.currentValue)}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                        Invested: {formatCurrency(data.totalInvested)}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-sm font-medium">Total Return</span>
                        <PieChart className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="text-2xl font-bold tracking-tight flex items-baseline gap-2">
                        <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
                            {formatCurrency(data.absolutePnL)}
                        </span>
                        <Badge variant={isPositive ? 'success' : 'danger'} className="text-xs">
                            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {formatPercentage(data.percentagePnL)}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-sm font-medium">Day Change</span>
                        <Activity className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="text-2xl font-bold tracking-tight flex items-baseline gap-2">
                        <span className={isDayPositive ? 'text-emerald-400' : 'text-red-400'}>
                            {formatCurrency(data.dayChange)}
                        </span>
                        <Badge variant={isDayPositive ? 'success' : 'danger'} className="text-xs">
                            {formatPercentage(data.dayChangePct)}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-1 h-full justify-center">
                    <div className="text-sm font-medium text-blue-400/80 mb-1 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        Countdown to 18th B'Day
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-zinc-50">
                        {differenceInDays(new Date('2043-03-10'), new Date()).toLocaleString()} Days
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                        10 March 2043
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
