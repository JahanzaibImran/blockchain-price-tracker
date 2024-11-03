import { Price } from './price.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
export declare class PriceService {
    private readonly priceRepository;
    private emailService;
    constructor(priceRepository: Repository<Price>, emailService: MailerService);
    MORALIS_API_URL: string;
    MORALIS_API_KEY: string;
    DEFAULT_WBTC: string;
    DEFAULT_WETH: string;
    DEFAULT_POLYGON: string;
    TRANSACTION_FEE_RATE: number;
    handleCron(): Promise<void>;
    private savePrice;
    getConversion(ethAmount: number, tokenA?: string, tokenB?: string): Promise<any>;
    private fetchPrice;
    getHourlyPrices(): Promise<{
        timestamp: Date;
        ethereum?: number;
        polygon?: number;
    }[]>;
    private getPreviousPrice;
    checkPriceIncreases(): Promise<void>;
}
