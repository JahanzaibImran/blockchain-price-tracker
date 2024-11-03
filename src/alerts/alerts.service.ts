import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './alerts.entity';
import { MoreThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';
import { Price } from 'src/price/price.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,

    @InjectRepository(Price)
    private priceRepository: Repository<Price>,

    private emailService: MailerService,
  ) {}

  async createAlert(chain: string, targetPrice: number, email: string) {
    const result = await this.alertRepository.save({
      chain,
      targetPrice,
      email,
    });

    return result;
  }

  async getCurrentPrice(chain: string) {
    const prices = await this.priceRepository.find({
      where: { timestamp: MoreThan(new Date(Date.now() - 60 * 60 * 1000)) },
    });

    const priceObj = prices.find((price) => price.chain === chain);
    return priceObj ? priceObj.price : null;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
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
}
