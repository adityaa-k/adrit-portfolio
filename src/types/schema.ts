import { z } from 'zod';

export const HoldingConfigSchema = z.object({
    symbol: z.string(),
    companyName: z.string(),
    quantity: z.number().positive(),
    buyPrice: z.number().positive(),
    buyTimestamp: z.string(),
    exchange: z.string().optional(),
    currency: z.string().default('INR'),
    note: z.string().optional(),
});

export const PortfolioConfigSchema = z.object({
    recipientName: z.string(),
    portfolioTitle: z.string(),
    asOfGiftDate: z.string(),
    holdings: z.array(HoldingConfigSchema),
});

export const HoldingDataSchema = z.object({
    symbol: z.string(),
    companyName: z.string(),
    quantity: z.number(),
    buyPrice: z.number(),
    currentPrice: z.number(),
    investedValue: z.number(),
    currentValue: z.number(),
    absolutePnL: z.number(),
    percentagePnL: z.number(),
    dayChange: z.number(),
    dayChangePct: z.number(),
    lastUpdated: z.string(),
    error: z.string().nullable(),
});

export const PortfolioDataSchema = z.object({
    recipientName: z.string(),
    totalInvested: z.number(),
    currentValue: z.number(),
    absolutePnL: z.number(),
    percentagePnL: z.number(),
    dayChange: z.number(),
    dayChangePct: z.number(),
});

export const MarketDataSnapshotSchema = z.object({
    generatedAt: z.string(),
    portfolio: z.object({
        recipientName: z.string(),
        totalInvested: z.number(),
        currentValue: z.number(),
        absolutePnL: z.number(),
        percentagePnL: z.number(),
        dayChange: z.number(),
        dayChangePct: z.number(),
    }),
    holdings: z.array(HoldingDataSchema),
});

export const HistoricalDataPointSchema = z.object({
    date: z.string(),
    totalInvested: z.number(),
    currentValue: z.number(),
});

export const HistoricalDataSnapshotSchema = z.array(HistoricalDataPointSchema);

export type HoldingConfig = z.infer<typeof HoldingConfigSchema>;
export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;
export type HoldingData = z.infer<typeof HoldingDataSchema>;
export type PortfolioData = z.infer<typeof PortfolioDataSchema>;
export type MarketDataSnapshot = z.infer<typeof MarketDataSnapshotSchema>;
export type HistoricalDataPoint = z.infer<typeof HistoricalDataPointSchema>;
export type HistoricalDataSnapshot = z.infer<typeof HistoricalDataSnapshotSchema>;
