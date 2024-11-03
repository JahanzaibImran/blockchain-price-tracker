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
exports.PriceController = void 0;
const common_1 = require("@nestjs/common");
const price_service_1 = require("./price.service");
const swagger_1 = require("@nestjs/swagger");
let PriceController = class PriceController {
    constructor(priceService) {
        this.priceService = priceService;
    }
    async getConversion(ethAmount) {
        if (isNaN(ethAmount) || ethAmount <= 0) {
            throw new common_1.BadRequestException('Invalid ETH amount');
        }
        return this.priceService.getConversion(ethAmount);
    }
    async getHourlyPrices() {
        const prices = await this.priceService.getHourlyPrices();
        return prices;
    }
};
exports.PriceController = PriceController;
__decorate([
    (0, common_1.Get)('/convert'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get BTC equivalent for a given ETH amount with fee calculation',
    }),
    (0, swagger_1.ApiQuery)({ name: 'ethAmount', required: true, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversion data retrieved successfully.',
    }),
    __param(0, (0, common_1.Query)('ethAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "getConversion", null);
__decorate([
    (0, common_1.Get)('/hourly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hourly prices for the last 24 hours' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Hourly price data retrieved successfully.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceController.prototype, "getHourlyPrices", null);
exports.PriceController = PriceController = __decorate([
    (0, common_1.Controller)('price'),
    __metadata("design:paramtypes", [price_service_1.PriceService])
], PriceController);
//# sourceMappingURL=price.controller.js.map