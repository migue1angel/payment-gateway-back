import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
//   @IsNotEmpty()
//   productId: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  currency: string;
}
