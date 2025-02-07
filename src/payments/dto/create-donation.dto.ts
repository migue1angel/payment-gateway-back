import { IsNotEmpty } from 'class-validator';

export class CreateDonationDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  referenceLocation: string;

  @IsNotEmpty()
  countryLocation: string;

  @IsNotEmpty()
  payerName: string;

  @IsNotEmpty()
  payerEmail: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  paypalPaymentId: string;
}
