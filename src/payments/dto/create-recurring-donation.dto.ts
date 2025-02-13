import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateRecurringDonationDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  countryLocation: string;

  @IsNotEmpty()
  @IsString()
  referenceLocation: string;

  @IsNotEmpty()
  @IsString()
  payerName: string;

  @IsNotEmpty()
  @IsString()
  payerEmail: string;

  @IsNotEmpty()
  @IsString()
  paypalSubscriptionId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}