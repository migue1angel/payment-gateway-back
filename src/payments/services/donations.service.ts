import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity } from '../entities/donation.entity';
import { Repository } from 'typeorm';
import { CreateDonationDto } from '../dto/create-donation.dto';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(DonationEntity)
    private readonly repository: Repository<DonationEntity>,
  ) {}

  async create(donationDto: CreateDonationDto) {
    const donation = this.repository.create(donationDto);
    return await this.repository.save(donation);
  }
  
}
