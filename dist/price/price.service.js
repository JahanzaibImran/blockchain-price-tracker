"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const price_entity_1 = require("./price.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const mailer_1 = require("@nestjs-modules/mailer");
let PriceService = class PriceService {
    constructor(priceRepository, emailService) {
        this.priceRepository = priceRepository;
        this.emailService = emailService;
        this.MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2';
        this.MORALIS_API_KEY = process.env.MORALIS_API_KEY;
        this.DEFAULT_WBTC = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
        this.DEFAULT_WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
        this.DEFAULT_POLYGON = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
        this.TRANSACTION_FEE_RATE = 0.0003;
    }
    async handleCron() {
        try {
            const ethPrice = await this.fetchPrice(this.DEFAULT_WETH);
            const polygonPrice = await this.fetchPrice(this.DEFAULT_POLYGON);
            await this.savePrice('Ethereum', ethPrice.usdPrice);
            await this.savePrice('Polygon', polygonPrice.usdPrice);
        }
        catch (error) {
            console.error('Error in scheduled price fetching:', error.message);
        }
    }
    async savePrice(chain, price) {
        const priceEntry = new price_entity_1.Price();
        priceEntry.chain = chain;
        priceEntry.price = price;
        priceEntry.timestamp = new Date();
        await this.priceRepository.save(priceEntry);
    }
    async getConversion(ethAmount, tokenA = this.DEFAULT_WETH, tokenB = this.DEFAULT_WBTC) {
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
        }
        catch (error) {
            console.error('Error fetching price data:', error);
            throw new common_1.BadRequestException('Failed to fetch price data.');
        }
    }
    async fetchPrice(tokenAddress) {
        const response = await axios_1.default.get(`${this.MORALIS_API_URL}/erc20/${tokenAddress}/price?chain=eth&include=percent_change`, {
            headers: { 'X-API-Key': this.MORALIS_API_KEY },
        });
        return response.data;
    }
    async getHourlyPrices() {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const prices = await this.priceRepository
            .createQueryBuilder('price')
            .where('price.timestamp >= :twentyFourHoursAgo', { twentyFourHoursAgo })
            .orderBy('price.timestamp', 'DESC')
            .getMany();
        const hourlyPrices = new Map();
        prices.forEach((price) => {
            const hourKey = new Date(price.timestamp).setMinutes(0, 0, 0).toString();
            if (!hourlyPrices.has(hourKey)) {
                hourlyPrices.set(hourKey, { timestamp: new Date(parseInt(hourKey)) });
            }
            const hourData = hourlyPrices.get(hourKey);
            hourData[price.chain] = Number(price.price);
        });
        return Array.from(hourlyPrices.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    async getPreviousPrice(chain) {
        const prices = await this.priceRepository.find({
            where: { chain },
            order: { timestamp: 'DESC' },
            take: 2,
        });
        return prices[1];
    }
    async checkPriceIncreases() {
        const prices = await this.priceRepository.find({
            where: { timestamp: (0, typeorm_2.MoreThan)(new Date(Date.now() - 60 * 60 * 1000)) },
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
};
exports.PriceService = PriceService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceService.prototype, "handleCron", null);
exports.PriceService = PriceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(price_entity_1.Price)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_1.MailerService])
], PriceService);
//# sourceMappingURL=price.service.js.map