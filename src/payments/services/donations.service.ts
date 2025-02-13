import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecurringDonationEntity } from '../entities/recurring-donation.entity';
import { Repository } from 'typeorm';
import { CreateRecurringDonationDto } from '../dto/create-recurring-donation.dto';
import { SingleDonationEntity } from '../entities/single-donation.entity';
import { CreateSingleDonationDto } from '../dto/create-single-donation';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(RecurringDonationEntity)
    private readonly recurringDonationRepository: Repository<RecurringDonationEntity>,
    @InjectRepository(SingleDonationEntity)
    private readonly singleDonationRepository: Repository<SingleDonationEntity>,
  ) {}

  async createRecurringDonation(donationDto: CreateRecurringDonationDto) {
    const donation = this.recurringDonationRepository.create(donationDto);
    return await this.recurringDonationRepository.save(donation);
  }
  async createSingleDonation(singleDonationDto: CreateSingleDonationDto) {
    const donation = this.singleDonationRepository.create(singleDonationDto);
    return await this.singleDonationRepository.save(donation);
  }
  
}
