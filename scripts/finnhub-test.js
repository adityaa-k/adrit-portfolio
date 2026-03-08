import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const token = process.env.FINNHUB_API_KEY;

async function test(symbol) {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`);
    console.log(symbol, 'Status:', res.status, 'Text:', await res.text());
}

async function run() {
    await test('AAPL');
    await test('HDFCBANK.NS');
    await test('RELIANCE.BO');
}

run();
