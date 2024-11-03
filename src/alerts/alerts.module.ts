import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { MailerService } from '@nestjs-modules/mailer';
import { Alert } from './alerts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from 'src/price/price.service';
import { Price } from 'src/price/price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alert, Price])],
  providers: [AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}
