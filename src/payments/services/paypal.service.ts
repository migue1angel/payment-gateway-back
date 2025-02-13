import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { DonationsService } from './donations.service';
import { CreatePlanDto } from '../dto/create-plan.dto';
import { GetPlansResponse, Plan } from 'src/models/plans-response';
import { HttpClientService } from './http-client.service';
import { TokenResponse } from 'src/models/token-response';
import { PayPalApproveResponse } from 'src/models/paypal-approve-response';
import { SubscriptionDetailResponse } from 'src/models/subscription-detail-response';

@Injectable()
export class PaypalService {
  private readonly basePaypalApiUrl = 'https://api-m.sandbox.paypal.com/v1';

  constructor(
    private readonly donationsService: DonationsService,
    private readonly httpClientService: HttpClientService,
  ) {}

  async createOrder(amount: number, currency: string) {
    const accessToken = await this.getAccessToken();
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: `${amount}`,
          },
        },
      ],
    };

    try {
      const response = await this.httpClientService.post(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders`,
        orderRequest,
        this.setAuthHeader(accessToken, 'minimal'),
      );

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async captureOrder(orderID: string) {
    const accessToken = await this.getAccessToken();
    try {
      const response: PayPalApproveResponse = await this.httpClientService.post(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
        {},
        this.setAuthHeader(accessToken, 'representation'),
      );

      await this.donationsService.createSingleDonation({
        currency: response.purchase_units[0].amount.currency_code,
        amount: +response.purchase_units[0].amount.value,
        date: response.create_time,
        countryLocation:
          response.purchase_units[0].shipping.address.country_code,
        referenceLocation:
          response.purchase_units[0].shipping.address.admin_area_2 ??
          response.purchase_units[0].shipping.address.admin_area_1,
        payerName: `${response.payment_source.paypal.name.given_name} ${response.payment_source.paypal.name.surname}`,	
        payerEmail: response.payer.email_address,
        userId: response.payer.payer_id,
        paypalOrderId: response.id,
      });

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createProduct() {
    const accessToken = await this.getAccessToken();
    return await this.httpClientService.post(
      `${this.basePaypalApiUrl}/catalogs/products`,
      {
        name: 'Donation',
        type: 'SERVICE',
        category: 'NON_TANGIBLE',
        description: 'Donation for the organization',
      },
      this.setAuthHeader(accessToken, 'representation'),
    );
  }

  async findExistingPlan(
    accessToken: string,
    amount: number,
    currency: string,
  ) {
    const plans = await this.getPlans(accessToken);
    return plans.find(
      (plan) =>
        plan.billing_cycles[0].pricing_scheme.fixed_price.value ===
          amount.toFixed(1) &&
        plan.billing_cycles[0].pricing_scheme.fixed_price.currency_code ===
          currency,
    );
  }

  async createPlan(createPlanDto: CreatePlanDto) {
    const accessToken = await this.getAccessToken();
    const existingPlan = await this.findExistingPlan(
      accessToken,
      createPlanDto.amount,
      createPlanDto.currency,
    );

    if (existingPlan) return { id: existingPlan.id, message: 'Plan exists' };

    const response = await this.httpClientService.post(
      `${this.basePaypalApiUrl}/billing/plans`,
      {
        product_id: 'PROD-98C99648K12456828',
        name: 'Donación Planting Future',
        description: `Donación mensual para Planting Future`,
        status: 'ACTIVE',
        billing_cycles: [
          {
            frequency: { interval_unit: 'MONTH', interval_count: 1 },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: createPlanDto.amount.toString(),
                currency_code: createPlanDto.currency,
              },
            },
          },
        ],
        payment_preferences: { payment_failure_threshold: 3 },
        taxes: { percentage: '10', inclusive: false },
      },
      this.setAuthHeader(accessToken),
    );
    return response;
  }

  async captureSubscription(subscriptionId: string) {
    const accessToken = await this.getAccessToken();
    const subscriptionDetail: SubscriptionDetailResponse =
      await this.httpClientService.get(
        `${this.basePaypalApiUrl}/billing/subscriptions/${subscriptionId}`,
        this.setAuthHeader(accessToken, 'representation'),
      );
    if (subscriptionDetail) {
      await this.donationsService.createRecurringDonation({
        amount: +subscriptionDetail.billing_info.last_payment.amount.value,
        currency:
          subscriptionDetail.billing_info.last_payment.amount.currency_code,
        startDate: subscriptionDetail.create_time,
        countryLocation:
          subscriptionDetail.subscriber.shipping_address.address.country_code,
        referenceLocation:
          subscriptionDetail.subscriber.shipping_address.address.admin_area_2 ??
          subscriptionDetail.subscriber.shipping_address.address.admin_area_1,
        payerName: `${subscriptionDetail.subscriber.name.given_name} ${subscriptionDetail.subscriber.name.surname}`,
        payerEmail: subscriptionDetail.subscriber.email_address,
        userId: subscriptionDetail.subscriber.payer_id,
        paypalSubscriptionId: subscriptionDetail.id,
        isActive: true,
      });
      return subscriptionDetail;
    }
  }

  async getPlans(accessToken: string): Promise<Plan[]> {
    const response = await this.httpClientService.get<GetPlansResponse>(
      `${this.basePaypalApiUrl}/billing/plans`,
      this.setAuthHeader(accessToken, 'representation'),
    );
    return response.plans;
  }

  async getAccessToken() {
    const auth = Buffer.from(
      `${envs.PAYPAL_CLIENT_ID}:${envs.PAYPAL_SECRET}`,
    ).toString('base64');
    const headers = {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = new URLSearchParams({ grant_type: 'client_credentials' });

    const response = await this.httpClientService.post<TokenResponse>(
      `${this.basePaypalApiUrl}/oauth2/token`,
      body,
      headers,
    );
    return response.access_token;
  }

  private setAuthHeader(
    accessToken: string,
    prefer: 'minimal' | 'representation' = 'minimal',
  ) {
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'PayPal-Request-Id': `${Date.now().toString()}`,
      Prefer: `return=${prefer}`,
    };
  }
}
