import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaypalService } from './services/paypal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationEntity } from './entities/donation.entity';
import { DonationsService } from './services/donations.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule,TypeOrmModule.forFeature([DonationEntity])],
  controllers: [PaymentsController],
  providers: [PaypalService, DonationsService],
})
export class PaymentsModule {}
