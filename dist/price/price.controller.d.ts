import { PriceService } from './price.service';
export declare class PriceController {
    private readonly priceService;
    constructor(priceService: PriceService);
    getConversion(ethAmount: number): Promise<any>;
    getHourlyPrices(): Promise<{
        timestamp: Date;
        ethereum?: number;
        polygon?: number;
    }[]>;
}
