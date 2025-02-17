import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaypalService } from './services/paypal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringDonationEntity } from './entities/recurring-donation.entity';
import { DonationsService } from './services/donations.service';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from './services/http-client.service';
import { SingleDonationEntity } from './entities/single-donation.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([RecurringDonationEntity, SingleDonationEntity])],
  controllers: [PaymentsController],
  providers: [PaypalService, DonationsService, HttpClientService],
})
export class PaymentsModule {}
