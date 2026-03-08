import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PortfolioConfigSchema, HistoricalDataSnapshotSchema } from '../src/types/schema.ts';
import type { MarketDataSnapshot, HistoricalDataPoint, HistoricalDataSnapshot } from '../src/types/schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log('Fetching market data...');
    const configPath = path.resolve(__dirname, '../portfolio.config.json');
    const outDir = path.resolve(__dirname, '../public/data');
    const outPath = path.join(outDir, 'latest.json');
    const historyPath = path.join(outDir, 'history.json');

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const config = PortfolioConfigSchema.parse(rawConfig);

    let totalInvested = 0;
    let currentValue = 0;
    let dayChangeTotal = 0;

    const holdingsData: any[] = [];
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    for (const holding of config.holdings) {
        try {
            await delay(2000); // 2 second delay to avoid rate limiting

            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${holding.symbol}?interval=1d&range=1d`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            if (!response.ok) {
                throw new Error(`Yahoo Finance API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const result = data.chart?.result?.[0];

            if (!result || !result.meta || !result.meta.regularMarketPrice) {
                throw new Error(`Invalid response format from Yahoo Finance`);
            }

            const currentPrice = result.meta.regularMarketPrice ?? holding.buyPrice;
            const previousClose = result.meta.chartPreviousClose ?? currentPrice;

            const investedVal = holding.quantity * holding.buyPrice;
            const currentVal = holding.quantity * currentPrice;
            const absPnL = currentVal - investedVal;
            const pctPnL = (absPnL / investedVal) * 100;

            const dChange = currentPrice - previousClose;
            const dChangePct = (dChange / previousClose) * 100;

            totalInvested += investedVal;
            currentValue += currentVal;
            dayChangeTotal += (dChange * holding.quantity);

            holdingsData.push({
                symbol: holding.symbol,
                companyName: holding.companyName,
                quantity: holding.quantity,
                buyPrice: holding.buyPrice,
                currentPrice: currentPrice,
                investedValue: investedVal,
                currentValue: currentVal,
                absolutePnL: absPnL,
                percentagePnL: pctPnL,
                dayChange: dChange * holding.quantity,
                dayChangePct: dChangePct,
                lastUpdated: new Date().toISOString(),
                error: null,
            });

            // Wait 2 seconds before the next query to avoid 429 Rate Limit
            await delay(2000);
        } catch (error: any) {
            console.error(`Error fetching data for ${holding.symbol}:`, error.message);
            const investedVal = holding.quantity * holding.buyPrice;

            totalInvested += investedVal;
            currentValue += investedVal;

            holdingsData.push({
                symbol: holding.symbol,
                companyName: holding.companyName,
                quantity: holding.quantity,
                buyPrice: holding.buyPrice,
                currentPrice: holding.buyPrice,
                investedValue: investedVal,
                currentValue: investedVal,
                absolutePnL: 0,
                percentagePnL: 0,
                dayChange: 0,
                dayChangePct: 0,
                lastUpdated: new Date().toISOString(),
                error: error.message || 'Failed to fetch',
            });
        }
    }

    const totalAbsPnL = currentValue - totalInvested;
    const totalPctPnL = totalInvested > 0 ? (totalAbsPnL / totalInvested) * 100 : 0;

    const previousValueTotal = currentValue - dayChangeTotal;
    const totalDayChangePct = previousValueTotal > 0 ? (dayChangeTotal / previousValueTotal) * 100 : 0;

    const snapshot: MarketDataSnapshot = {
        generatedAt: new Date().toISOString(),
        portfolio: {
            recipientName: config.recipientName,
            totalInvested,
            currentValue,
            absolutePnL: totalAbsPnL,
            percentagePnL: totalPctPnL,
            dayChange: dayChangeTotal,
            dayChangePct: totalDayChangePct,
        },
        holdings: holdingsData,
    };

    fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
    console.log(`Successfully generated data snapshot at ${outPath}`);

    // --- Historical Data Accumulation ---
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let history: HistoricalDataSnapshot = [];

    if (fs.existsSync(historyPath)) {
        try {
            const rawHistory = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
            history = HistoricalDataSnapshotSchema.parse(rawHistory);
        } catch (err: any) {
            console.error("Warning: Could not parse history.json, starting fresh.", err.message);
            history = [];
        }
    }

    const newPoint: HistoricalDataPoint = {
        date: todayStr,
        totalInvested,
        currentValue
    };

    // If today's entry exists, overwrite it (intra-day update). Otherwise, append.
    const lastIndex = history.findIndex(p => p.date === todayStr);
    if (lastIndex !== -1) {
        history[lastIndex] = newPoint;
    } else {
        history.push(newPoint);
    }

    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    console.log(`Successfully updated historical data at ${historyPath}`);
}

main().catch(console.error);
