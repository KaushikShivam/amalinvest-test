import { Stock, StockWithWeight } from '@amalinvest/types';
import {
  BadRequestException,
  flatten,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import * as dayjs from 'dayjs';
import { AVG_MARKET_PERFORMANCE } from './spy-data';
import { TickerInfo } from './stock.dto';

@Injectable()
export class StockService {
  BASE_URL = 'https://api.polygon.io/';

  async getStocks({ query }: { query: string }): Promise<Stock[]> {
    if (!process.env.POLYGON_KEY)
      throw new InternalServerErrorException('Polygon key not found');
    try {
      const response = await axios.get<{ results: Stock[] }>(
        `${this.BASE_URL}v3/reference/tickers?market=stocks&limit=50&apiKey=${process.env.POLYGON_KEY}&search=${query}`,
      );
      return response.data.results.map((i) => ({
        name: i.name,
        ticker: i.ticker,
      }));
    } catch (error) {
      throw new BadRequestException(
        'Oops! Something happened. Please try again later',
      );
    }
  }

  async getStockPerformance({
    stocks,
  }: {
    stocks: StockWithWeight[];
  }): Promise<number[][]> {
    if (!process.env.POLYGON_KEY)
      throw new InternalServerErrorException('Polygon key not found');
    try {
      const SUM_INVESTED = 100;

      // Get starting and ending period
      const today = dayjs().format('YYYY-MM-DD');
      const lastYear = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
      const days = dayjs(today).diff(dayjs(lastYear), 'days');

      const promises = stocks.map(({ stock }) =>
        axios.get<{ ticker: string; results: TickerInfo[] }>(
          `${this.BASE_URL}v2/aggs/ticker/${stock}/range/1/day/${lastYear}/${today}?adjusted=false&sort=asc&limit=${days}&apiKey=${process.env.POLYGON_KEY}`,
        ),
      );
      const responses = await axios.all(promises);

      // Set all trading dates to performance object
      const performanceObj: { [key: string]: number } = {};
      const allDates = flatten(
        responses.map((i) => i.data.results.map((i) => i.t.toString())),
      ).sort();
      const avgTradingStartIndex = Object.keys(AVG_MARKET_PERFORMANCE).indexOf(
        allDates[0],
      );
      // Remove all SPY trading days that are before the performance starting period
      // Add tradings days after the SPY ending period
      const tradingDays = Array.from(
        new Set([
          ...Object.keys(AVG_MARKET_PERFORMANCE).slice(avgTradingStartIndex),
          ...allDates,
        ]),
      );
      tradingDays.forEach((date) => (performanceObj[date] = 0));

      const allotedShares: { [key: string]: number } = {};

      const resultsObj: { [key: string]: { [key: string]: number } } = {};
      responses.forEach((response) => {
        // Calculate allocated shares
        const stock = stocks.find((i) => i.stock === response.data.ticker);
        allotedShares[response.data.ticker] =
          (SUM_INVESTED * (parseFloat(stock.weight) / 100)) /
          response.data.results[0].c;

        resultsObj[response.data.ticker] = {};
        response.data.results.forEach((value) => {
          resultsObj[response.data.ticker][value.t] = value.c;
        });
      });

      // Use average performance value if the stock doesn't have data on specific date.
      Object.entries(performanceObj).forEach(([key, _]) => {
        stocks.forEach(({ stock }) => {
          const result = resultsObj[stock];

          if (result[key]) {
            performanceObj[key] += result[key] * allotedShares[stock];
          } else {
            const index = Object.keys(result).indexOf(key);
            const previousTrades = Object.entries(result).slice(0, index);
            // Use closing price from previous day, else use avg market performance
            performanceObj[key] += previousTrades.length
              ? previousTrades.pop()[1]
              : AVG_MARKET_PERFORMANCE[key] * allotedShares[stock];
          }
        });
      });

      return Object.entries(performanceObj).map(([date, total]) => [
        parseInt(date),
        total,
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }
}
