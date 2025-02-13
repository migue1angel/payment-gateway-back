import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('single_donations')
export class SingleDonationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'float',
  })
  amount: number;

  @Column({
    name: 'date',
    type: 'timestamp',
  })
  date: Date;

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
    name: 'paypal_order_id',
  })
  paypalOrderId: string;
}
