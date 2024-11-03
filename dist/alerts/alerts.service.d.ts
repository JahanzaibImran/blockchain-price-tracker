import { Alert } from './alerts.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Price } from 'src/price/price.entity';
export declare class AlertsService {
    private alertRepository;
    private priceRepository;
    private emailService;
    constructor(alertRepository: Repository<Alert>, priceRepository: Repository<Price>, emailService: MailerService);
    createAlert(chain: string, targetPrice: number, email: string): Promise<{
        chain: string;
        targetPrice: number;
        email: string;
    } & Alert>;
    getCurrentPrice(chain: string): Promise<number>;
    checkAlerts(): Promise<void>;
}
