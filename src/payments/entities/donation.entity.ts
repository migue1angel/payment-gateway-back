import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('donations')
export class DonationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'float',
  })
  amount: number;

  @Column({
    type: 'timestamp',
  })
  date: Date;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column({
    name: 'country_location',
  })
  countryLocation: string;

  @Column({
    name: 'reference_location',
  })
  referenceLocation: string;

  @Column({
    name: 'payer_name',
  })
  payerName: string;

  @Column({
    name: 'payer_email',
  })
  payerEmail: string;

  @Column({
    name: 'paypal_payment_id',
  })
  paypalPaymentId: string;
}
