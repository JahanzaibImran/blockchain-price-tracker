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
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const alerts_entity_1 = require("./alerts.entity");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const mailer_1 = require("@nestjs-modules/mailer");
const price_entity_1 = require("../price/price.entity");
let AlertsService = class AlertsService {
    constructor(alertRepository, priceRepository, emailService) {
        this.alertRepository = alertRepository;
        this.priceRepository = priceRepository;
        this.emailService = emailService;
    }
    async createAlert(chain, targetPrice, email) {
        const result = await this.alertRepository.save({
            chain,
            targetPrice,
            email,
        });
        return result;
    }
    async getCurrentPrice(chain) {
        const prices = await this.priceRepository.find({
            where: { timestamp: (0, typeorm_2.MoreThan)(new Date(Date.now() - 60 * 60 * 1000)) },
        });
        const priceObj = prices.find((price) => price.chain === chain);
        return priceObj ? priceObj.price : null;
    }
    async checkAlerts() {
        const alerts = await this.alertRepository.find({
            where: { triggered: false },
        });
        for (const alert of alerts) {
            const currentPrice = await this.getCurrentPrice(alert.chain);
            if (currentPrice >= alert.targetPrice) {
                await this.emailService.sendMail({
                    from: 'hyperhire_assignment@hyperhire.in',
                    to: alert.email,
                    subject: 'Price Alert',
                    text: `${alert.chain} has reached your target price of $${alert.targetPrice}`,
                });
                alert.triggered = true;
                await this.alertRepository.save(alert);
            }
        }
    }
};
exports.AlertsService = AlertsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertsService.prototype, "checkAlerts", null);
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alerts_entity_1.Alert)),
    __param(1, (0, typeorm_1.InjectRepository)(price_entity_1.Price)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mailer_1.MailerService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map