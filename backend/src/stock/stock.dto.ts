import { StockWithWeight } from '@amalinvest/types';
import { IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class StockBodyDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  stocks: StockWithWeight[];
}

export interface TickerInfo {
  c: number;
  t: number;
}
