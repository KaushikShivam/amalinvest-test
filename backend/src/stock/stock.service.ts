import { Stock, StockWithWeight } from '@amalinvest/types';
import {
  BadRequestException,
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

      const resultsObj: { [key: string]: { [key: string]: number } } = {};
      responses.forEach((response) => {
        resultsObj[response.data.ticker] = {};
        response.data.results.forEach((value) => {
          resultsObj[response.data.ticker][value.t] = value.c;
        });
      });

      // Find the dates from the stock that has the most available dates;
      const stockDates = responses
        .sort((a, b) => b.data.results.length - a.data.results.length)[0]
        .data.results.map((i) => i.t);
      // Set all available dates to performance object
      const performanceObj: { [key: string]: number } = {};
      stockDates.forEach((key) => (performanceObj[key] = 0));

      // Use average performance value if the stock doesn't have data on specific date.
      Object.entries(performanceObj).forEach(([key, _]) => {
        stocks.forEach(({ stock, weight }) => {
          const result = resultsObj[stock];
          performanceObj[key] += result[key]
            ? result[key] * (parseFloat(weight) / 100)
            : AVG_MARKET_PERFORMANCE[key] * (parseFloat(weight) / 100);
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
