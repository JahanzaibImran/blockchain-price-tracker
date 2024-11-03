import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { Price } from './price.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { log } from 'console';
import { Cron, CronExpression } from '@nestjs/schedule';
import nodemailer from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';
import { PriceResponseDto } from './dto/price-response.dto';

// 0.03%)

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    private emailService: MailerService,
  ) {}
  MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2';
  MORALIS_API_KEY = process.env.MORALIS_API_KEY;
  DEFAULT_WBTC = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
  DEFAULT_WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  DEFAULT_POLYGON = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
  TRANSACTION_FEE_RATE = 0.0003;

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    try {
      const ethPrice = await this.fetchPrice(this.DEFAULT_WETH);
      const polygonPrice = await this.fetchPrice(this.DEFAULT_POLYGON);

      await this.savePrice('Ethereum', ethPrice.usdPrice);
      await this.savePrice('Polygon', polygonPrice.usdPrice);
    } catch (error) {
      console.error('Error in scheduled price fetching:', error.message);
    }
  }

  private async savePrice(chain: string, price: number) {
    const priceEntry = new Price();
    priceEntry.chain = chain;
    priceEntry.price = price;
    priceEntry.timestamp = new Date();

    await this.priceRepository.save(priceEntry);
  }
  async getConversion(
    ethAmount: number,
    tokenA: string = this.DEFAULT_WETH,
    tokenB: string = this.DEFAULT_WBTC,
  ): Promise<any> {
    try {
      const [priceA, priceB] = await Promise.all([
        this.fetchPrice(tokenA),
        this.fetchPrice(tokenB),
      ]);

      const btcEquivalent = (ethAmount * priceA.usdPrice) / priceB.usdPrice;
      const fee = btcEquivalent * this.TRANSACTION_FEE_RATE;
      const btcAfterFee = (btcEquivalent - fee).toFixed(4);

      return {
        ethAmount,
        btcEquivalent,
        transactionFee: fee,
        btcAfterFee,
      };
    } catch (error) {
      console.error('Error fetching price data:', error);
      throw new BadRequestException('Failed to fetch price data.');
    }
  }

  private async fetchPrice(tokenAddress: string) {
    const response = await axios.get(
      `${this.MORALIS_API_URL}/erc20/${tokenAddress}/price?chain=eth&include=percent_change`,
      {
        headers: { 'X-API-Key': this.MORALIS_API_KEY },
      },
    );

    return response.data;
  }

  async getHourlyPrices() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const prices = await this.priceRepository
      .createQueryBuilder('price')
      .where('price.timestamp >= :twentyFourHoursAgo', { twentyFourHoursAgo })
      .orderBy('price.timestamp', 'DESC')
      .getMany();

    const hourlyPrices = new Map<
      string,
      { timestamp: Date; ethereum?: number; polygon?: number }
    >();

    prices.forEach((price) => {
      const hourKey = new Date(price.timestamp).setMinutes(0, 0, 0).toString();

      if (!hourlyPrices.has(hourKey)) {
        hourlyPrices.set(hourKey, { timestamp: new Date(parseInt(hourKey)) });
      }

      const hourData = hourlyPrices.get(hourKey);
      hourData[price.chain] = Number(price.price);
    });

    return Array.from(hourlyPrices.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  private async getPreviousPrice(chain: string): Promise<Price> {
    const prices = await this.priceRepository.find({
      where: { chain },
      order: { timestamp: 'DESC' },
      take: 2,
    });
    return prices[1];
  }

  async checkPriceIncreases() {
    const prices = await this.priceRepository.find({
      where: { timestamp: MoreThan(new Date(Date.now() - 60 * 60 * 1000)) },
    });

    const ethPriceNow = prices.find((price) => price.chain === 'Ethereum');
    const polygonPriceNow = prices.find((price) => price.chain === 'Polygon');

    if (ethPriceNow) {
      const previousPrice = await this.getPreviousPrice('Ethereum');

      if (previousPrice && ethPriceNow.price > previousPrice.price * 1.03) {
        await this.emailService.sendMail({
          from: process.env.SMTP_USER,
          to: 'hyperhire_assignment@hyperhire.in',
          subject: `ETH Price Alert`,
          text: `Ethereum price increased by more than 3%! Previous Price: $${previousPrice}, Current Price: $${ethPriceNow}`,
        });
      }
    }

    if (polygonPriceNow) {
      const previousPrice = await this.getPreviousPrice('Polygon');
      if (previousPrice && polygonPriceNow.price > previousPrice.price * 1.03) {
        await this.emailService.sendMail({
          from: process.env.SMTP_USER,
          to: 'hyperhire_assignment@hyperhire.in',
          subject: `Polygon Price Alert`,
          text: `Polygon price increased by more than 3%! Previous Price: $${previousPrice}, Current Price: $${ethPriceNow}`,
        });
      }
    }
  }
}
