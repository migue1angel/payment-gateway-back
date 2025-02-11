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
    name: 'start_date',
    type: 'timestamp',
  })
  startDate: Date;

  @Column({
    name: 'currency',
  })
  currency: string;

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
  paypalId: string;

  @Column({
    name: 'is_subscription',
    default: false,
  })
  isSubscription: boolean;

  @Column({
    name: 'is_active',
    nullable: true,
  })
  isActive: boolean;

  @Column({
    name: 'end_date',
    type: 'timestamp',
    nullable: true,
  })
  endDate: Date;
}
