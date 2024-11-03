import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PriceService } from './price.service';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('/convert')
  @ApiOperation({
    summary: 'Get BTC equivalent for a given ETH amount with fee calculation',
  })
  @ApiQuery({ name: 'ethAmount', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Conversion data retrieved successfully.',
  })
  async getConversion(@Query('ethAmount') ethAmount: number) {
    if (isNaN(ethAmount) || ethAmount <= 0) {
      throw new BadRequestException('Invalid ETH amount');
    }
    return this.priceService.getConversion(ethAmount);
  }

  @Get('/hourly')
  @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
  @ApiResponse({
    status: 200,
    description: 'Hourly price data retrieved successfully.',
  })
  async getHourlyPrices() {
    const prices = await this.priceService.getHourlyPrices();
    return prices;
  }
}
