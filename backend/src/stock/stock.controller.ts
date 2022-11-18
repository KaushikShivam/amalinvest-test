import { Stock } from '@amalinvest/types';
import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { StockBodyDto } from './stock.dto';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  getStocks(@Query('q') query: string): Promise<Stock[]> {
    return this.stockService.getStocks({ query });
  }

  @Post('performance')
  getStockPerformance(@Body() { stocks }: StockBodyDto): Promise<number[][]> {
    return this.stockService.getStockPerformance({ stocks });
  }
}
