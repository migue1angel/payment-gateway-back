import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateDonationDto {
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
  paypalId: string;

  @IsOptional()
  @IsBoolean()
  isSubscription?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}