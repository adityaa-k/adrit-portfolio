import * as yahooFinanceModule from 'yahoo-finance2';
console.log('Module keys:', Object.keys(yahooFinanceModule));
if (yahooFinanceModule.default) {
    console.log('Default keys:', Object.keys(yahooFinanceModule.default));
}
