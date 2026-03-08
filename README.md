# Adrit's Gifted Stocks Dashboard

A zero-backend static dashboard for tracking gifted Indian stocks. It fetches data via a scheduled GitHub action to render a resilient, production-quality dashboard hosted on GitHub Pages.

## Architecture & Why Static Snapshots?

This repository follows a strict **Static Snapshot Architecture**.
- **The Problem**: Fetching financial data gracefully from the browser requires a dedicated backend proxy to handle API keys, CORS, and rate limits. Maintaining a backend for a simple read-only dashboard introduces cost and operational complexity.
- **The Solution**: A Node script (`scripts/fetch-market-data.ts`) runs during the build step (or via GitHub Actions CRON). It asks Yahoo Finance for the latest stock data, calculates the P&L metrics locally, and writes a flat JSON file to `public/data/latest.json`.
- **The Delivery**: Vite builds the React project. The generated JSON file is bundled with the compiled HTML/JS payloads. Thus, the static site on GitHub Pages simply reads its own local JSON file at runtime. No backend required!

## How to Edit Portfolio Holdings

Edit the `portfolio.config.json` file in the root directory. 

```json
{
  "symbol": "RELIANCE.NS",
  "quantity": 10,
  "buyPrice": 2400.0,
  "note": "Gifted on birthday"
}
```
*Note: Ensure your stock symbols match Yahoo Finance's format (e.g., `.NS` for NSE).*

## How to Run Locally

1. Install Node.js (v22+ recommended).
2. Clone the repository and run `npm install`.
3. Fetch the latest data snapshot:
   ```bash
   npm run fetch:data
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```

## Data Refresh & GitHub Pages Deployment

The dashboard automatically updates using GitHub Actions (`.github/workflows/update-and-deploy.yml`).
- It runs automatically on pushes to `main`.
- It can be manually triggered in the "Actions" tab.
- **Schedule:** It is configured to run every 15 minutes during Indian market hours (approx. 9:15 AM - 3:30 PM IST) on weekdays.

**Enabling GitHub Pages:**
1. Go to your repository **Settings > Pages**.
2. Under "Build and deployment", select **GitHub Actions** as the source.
3. Everything else is handled by the `.github/workflows/update-and-deploy.yml` pipeline.

## Cloudflare Pages Deployment (Optional)

This dashboard generates purely static output into the `dist` folder.
You can alternatively deploy it to Cloudflare Pages for free:
1. Connect your GitHub repository to Cloudflare Pages.
2. Set the build command to `npm run build:all`.
3. Set the build output directory to `dist`.
(Alternatively, you can just use Cloudflare's Direct Upload by dragging and dropping your `dist` folder).

## Limitations
- **Yahoo Finance API**: The underlying data uses an unofficial integration (`yahoo-finance2`). It is incredibly robust but can occasionally experience temporary rate limits. The architecture is designed to gracefully degrade—if the fetch fails, it simply keeps the previous snapshot and displays a "stale data" indication.
- **Delay:** Data is delayed by 15 minutes by default.
