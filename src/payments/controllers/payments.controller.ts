import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaypalService } from '../services/paypal.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paypalService: PaypalService) {}

  @Post('paypal/create')
  async createOrder(@Body('amount') amount: number) {
    return await this.paypalService.createOrder(amount);
  }

  @Get('paypal/capture/:id')
  async captureOrder(@Param('id') orderId: string) {
    return await this.paypalService.captureOrder(orderId);
  }

  @Get('paypal/get/:id')
  async getPayment(@Param('id') orderId: string) {
    return await this.paypalService.getPayment(orderId);
  }

  @Get('paypal/token')
  async getAccessToken() {
    return await this.paypalService.getAccessToken();
  }

  @Post('paypal/product')
  async createProduct(data: any) {
    return await this.paypalService.createProduct();
  }

  @Post('paypal/plan')
  async createPlan(@Body('product') productId: string) {
    return await this.paypalService.createPlan(productId);
  }
}
