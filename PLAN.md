# Adrit's Gifted Stocks Dashboard - Implementation Plan

## Project Summary
A production-quality static dashboard for tracking "gifted" Indian stocks for Adrit. It displays the portfolio's current value, absolute gain/loss, percentage returns, day changes, and features elegant visualizations (KPIs, charts, holdings table). The design will have a premium, modern "financial terminal" aesthetic with a dark theme by default, and must be fully responsive. It relies strictly on zero-cost infrastructure using a static snapshot architecture.

## Architecture Choice
**Static Snapshot Architecture (No Backend)**
We will use a static site approach where the frontend strictly consumes pre-generated JSON files. A Node.js script fetches market data from Yahoo Finance at build time (and via scheduled GitHub Actions), processes it, and outputs static JSON artifacts (snapshots). The static site is then deployed to GitHub Pages.

**Why?**
- Zero hosting costs (GitHub Pages).
- Avoids fragile client-side cross-origin data fetching issues or API rate-limit exposures.
- High reliability: If the market API goes down, the site stays up, simply displaying the last known snapshot with a "stale data" indication.
- Excellent shareability and fast load times.

**Historical Data Accumulation (Our Own Database)**
Instead of relying on a dedicated historical API (which is often expensive or rate-limited), the scheduled fetch script will append daily portfolio snapshots into a `public/data/history.json` file.
- Every time the cron job runs, it checks if a snapshot for the current day already exists.
- If not (or if it's the end-of-day run), it pushes the portfolio's total value into a historical array.
- This allows the frontend React app to render beautiful long-term performance trend line-charts completely for free, using our organically accumulated data.

## Data Flow
1. **Source:** A local `portfolio.config.json` defining Adrit's holdings (symbol, exchange, quantity, buy price/timestamp).
2. **Fetch & Normalize:** A Node script (`scripts/fetch-market-data.ts`) runs on a schedule. It reads the config, queries `yahoo-finance2` for each symbol, computes gains/losses, aggregates portfolio metrics, and catches per-symbol errors.
3. **Artifact Generation:** The script outputs validated JSON (using `zod`) to `public/data/latest.json` (and `history.json` if applicable).
4. **Build & Deploy:** Vite builds the React specific code, folding the generated JSON into the public output folder `/dist`, which is then deployed to GitHub Pages.
5. **Runtime Rendering:** The React app boots in the user's browser, loads `/data/latest.json`, and renders the dashboard UI. 

## Folder Structure
```
/
  src/
    components/
      ui/        # Reusable UI elements (cards, badges)
      dashboard/ # Dashboard specific views (KPIs, holdings table, charts)
    pages/       # Page components (App.tsx)
    hooks/       # Custom hooks (e.g., useStockData)
    lib/         # Utilities (formatting, fetching)
    styles/      # Global CSS / Tailwind
    types/       # TypeScript types / Zod schemas
  public/
    data/        # Generated JSON files live here
  scripts/
    fetch-market-data.ts  # Node script for Yahoo Finance integration
  .github/workflows/
    update-and-deploy.yml # CI/CD for scheduled refresh and deployments
  PLAN.md
  README.md
  portfolio.config.json
```

## Package Choices
- **Frontend Framework:** React 18 + Vite (fast builds, modern tooling)
- **Language:** TypeScript (strict mode for type safety)
- **Styling:** Tailwind CSS (utility-first, easy to implement consistent design systems)
- **Visuals/Charts:** Recharts (composable, reliable charts) & Lucide React (icons)
- **Date/Time Handling:** date-fns (simple chronological formatting)
- **Validation:** Zod (runtime schema validation for both the backend fetch script and frontend data models)
- **Backend/Scripting Fetcher:** yahoo-finance2 (robust, unofficial node SDK for YF API)

## UI Sections and Components
1. **Hero/Header:** Title ("Adrit’s Gifted Stocks"), subtext, and a "last updated / stale data" indicator.
2. **KPI Overview:** 4 main summary cards (Invested Value, Current Value, Total P&L, Total Return %).
3. **Charts Section:** 
   - Allocation Donut (portfolio weight per holding).
   - Holdings P&L Bar Chart.
4. **Holdings Table / Cards:**
   - Desktop: Dense, clear table with columns (Symbol, Name, Qty, Buy, Current, Inv. Value, Cur. Value, P&L, Day Move).
   - Mobile: Refined card layout focusing on key metrics.
5. **Footer:** Required disclaimers, data source notes.

## JSON Schema Design
`public/data/latest.json`
```json
{
  "generatedAt": "2024-05-18T10:00:00Z",
  "portfolio": {
    "recipientName": "Adrit",
    "totalInvested": 100000,
    "currentValue": 125000,
    "absolutePnL": 25000,
    "percentagePnL": 25.0,
    "dayChange": 1500,
    "dayChangePct": 1.2
  },
  "holdings": [
    {
      "symbol": "RELIANCE.NS",
      "companyName": "Reliance Industries",
      "quantity": 10,
      "buyPrice": 2400.0,
      "currentPrice": 2800.0,
      "investedValue": 24000.0,
      "currentValue": 28000.0,
      "absolutePnL": 4000.0,
      "percentagePnL": 16.67,
      "dayChange": 20.0,
      "dayChangePct": 0.72,
      "lastUpdated": "2024-05-18T09:55:00Z",
      "error": null
    }
  ]
}
```

## Deployment Plan
- **Primary:** GitHub Pages.
- **Process:** The GitHub Action will output to `dist/`, which is then pushed to the `gh-pages` branch or handled via GitHub Actions Pages artifact upload. Needs configuration for base URL logic if repo name is used (e.g. `/adrit-stock-dashboard/`).

## Update Schedule Plan
- GitHub Actions workflow runs `fetch:data` -> `build` -> `deploy`.
- **Cron Definition:** Runs every 15 minutes during Indian market hours (approx. 09:15 to 15:30 IST) on weekdays (Mon-Fri).
- *IST (UTC+5:30)* -> 09:15-15:30 IST is 03:45-10:00 UTC.
- Cron expression config: `*/15 4-10 * * 1-5` (Note: avoiding exactly top-of-the-hour for better runner availability, e.g., offset slightly or maintain 15m intervals starting at :05 via `5,20,35,50 4-10 * * 1-5`).

## Risks and Mitigations
- **Yahoo Finance API Instability / Rate Limits:** 
  - *Mitigation:* We fetch only once per 15 minutes overall from GitHub Action IPs, not per user page load. Adding simple try-catch and returning the previous snapshot data or marking a holding with an `error` flag prevents total dashboard failure.
- **Cross-Origin / GitHub Pages Pathing:** 
  - *Mitigation:* Ensure Vite is configured with `base: './'` or appropriately mapped to repository name.
- **Stale Data:**
  - *Mitigation:* Action runner fails. UI displays `generatedAt` clearly, highlighting in red/orange if data is more than a few days old (indicating runner issues).

## Implementation Checklist
- Write PLAN.md.
- Scaffold React project (Vite/TS) and install packages.
- Define config file and seed data (Indian Stocks).
- Build the Node.js fetch script (`yahoo-finance2`).
- Construct React components (UI and Table/Charts) with Tailwind.
- Assemble GitHub actions workflows.
- Write README.md.
- Final review and verification of static builds.
