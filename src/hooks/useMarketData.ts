import { useState, useEffect } from 'react';
import type { MarketDataSnapshot, HistoricalDataSnapshot } from '../types/schema.ts';

export function useMarketData() {
    const [data, setData] = useState<MarketDataSnapshot | null>(null);
    const [history, setHistory] = useState<HistoricalDataSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Determine base path correctly for GitHub Pages deployment
        const basePath = import.meta.env.BASE_URL || '/';
        const latestUrl = `${basePath}data/latest.json`.replace('//', '/');
        const historyUrl = `${basePath}data/history.json`.replace('//', '/');

        Promise.all([
            fetch(latestUrl).then(res => {
                if (!res.ok) throw new Error('Failed to fetch data.');
                return res.json();
            }),
            fetch(historyUrl).then(res => {
                // If history doesn't exist yet, we just gracefully handle it
                if (!res.ok) return [];
                return res.json();
            })
        ])
            .then(([latestJson, historyJson]) => {
                setData(latestJson);
                setHistory(historyJson);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return { data, history, loading, error };
}
