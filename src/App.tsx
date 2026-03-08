
import { useMarketData } from './hooks/useMarketData'
import { KPIGrid } from './components/dashboard/KPIGrid'
import { HoldingsTable } from './components/dashboard/HoldingsTable'
import { Charts } from './components/dashboard/Charts'
import { HistoryChart } from './components/dashboard/HistoryChart'
import { AlertCircle, Clock, RefreshCcw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

function App() {
    const { data, history, loading, error } = useMarketData();

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="w-8 h-8 animate-spin text-zinc-600" />
                    <p className="text-zinc-400 font-medium tracking-wide animate-pulse">Initializing Financial Terminal...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8 flex items-center justify-center font-sans">
                <div className="max-w-md w-full text-center space-y-4 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <h2 className="text-xl font-bold text-zinc-200">System Offline</h2>
                    <p className="text-zinc-400 text-sm">Failed to connect to the data relay. The snapshot could not be loaded.</p>
                    <div className="text-xs text-zinc-500 font-mono bg-zinc-950 p-2 rounded border border-zinc-800">{error || 'Unknown Error'}</div>
                </div>
            </div>
        );
    }

    const { portfolio, holdings, generatedAt } = data;
    const isStale = new Date().getTime() - new Date(generatedAt).getTime() > 1000 * 60 * 60 * 24; // 24 hours
    const updateTimeString = formatDistanceToNow(new Date(generatedAt), { addSuffix: true });

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30">

            {/* Top Navigation / Header */}
            <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{portfolio.recipientName}'s Portfolio</h1>
                        </div>

                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${isStale ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Snapshot {updateTimeString}</span>
                            {isStale && <span className="ml-1 opacity-70">(Delayed)</span>}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Dashboard */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <KPIGrid data={portfolio} />
                {history && <HistoryChart history={history} />}
                <Charts holdings={holdings} />
                <HoldingsTable holdings={holdings} />
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 text-center text-sm text-zinc-500">
                <p>Market data integrated via Yahoo Finance • Unofficial Snapshot Architecture</p>
                <p className="mt-2 text-zinc-600 text-xs max-w-2xl mx-auto px-4">
                    Disclaimer: This dashboard is for informational tracking purposes only and does not constitute financial advice. Data may be delayed by 15 minutes or more depending on GitHub Actions runner availability.
                </p>
            </footer>
        </div>
    )
}

export default App
