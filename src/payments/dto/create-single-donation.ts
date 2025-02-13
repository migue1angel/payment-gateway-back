import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateSingleDonationDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

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
  paypalOrderId: string;
}