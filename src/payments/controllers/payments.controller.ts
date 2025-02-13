import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaypalService } from '../services/paypal.service';
import { CreatePlanDto } from '../dto/create-plan.dto';
import { PaymentDto } from '../dto/payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paypalService: PaypalService) {}

  @Post('paypal/create')
  async createOrder(@Body() paymentDto:PaymentDto) {
    return await this.paypalService.createOrder(paymentDto.amount, paymentDto.currency);
  }

  @Get('paypal/capture/:id')
  async captureOrder(@Param('id') orderId: string) {
    return await this.paypalService.captureOrder(orderId);
  }

  @Post('paypal/capture-subscription/:id')
  async getSubscription(@Param('id') subscriptionId: string) {
    return await this.paypalService.captureSubscription(subscriptionId);
  }

  @Post('paypal/token')
  async getAccessToken() {
    return await this.paypalService.getAccessToken();
  }

  @Post('paypal/product')
  async createProduct(data: any) {
    return await this.paypalService.createProduct();
  }

  @Post('paypal/plan')
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    return await this.paypalService.createPlan(createPlanDto);
  }

  @Get('paypal/plans')
  async getPlans() {
    const accessToken = await this.paypalService.getAccessToken();
    return await this.paypalService.getPlans(accessToken);
  }
}
