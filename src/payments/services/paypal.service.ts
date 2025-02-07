import { Injectable } from '@nestjs/common';
import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  OrderRequest,
  OrdersController,
} from '@paypal/paypal-server-sdk';
import { envs } from 'src/config/envs';
import { DonationsService } from './donations.service';
import { PayPalResponse } from 'src/models/paypal-response';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaypalService {
  constructor(
    private readonly donationsService: DonationsService,
    private readonly httpService: HttpService,
  ) {}
  private readonly paypalClient = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: envs.PAYPAL_CLIENT_ID,
      oAuthClientSecret: envs.PAYPAL_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
  });
  private readonly ordersController = new OrdersController(this.paypalClient);
  private readonly basePaypalApiUrl = 'https://api-m.sandbox.paypal.com/v1';
  async createOrder(amount: number) {
    try {
      const orderRequest: OrderRequest = {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              value: `${amount}`,
              currencyCode: 'USD',
            },
          },
        ],
      };
      const { body } = await this.ordersController.ordersCreate({
        body: orderRequest,
      });
      if (typeof body === 'string') {
        return JSON.parse(body);
      }
      return body;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async captureOrder(orderID: string) {
    const collect = {
      id: orderID,
      prefer: 'return=minimal',
    };

    try {
      const { body, ...httpResponse } =
        await this.ordersController.ordersCapture(collect);
      // Get more response info...
      // const { statusCode, headers } = httpResponse;

      if (typeof body === 'string') {
        const data: PayPalResponse | undefined = await this.getPayment(orderID);
        if (data) {
          await this.donationsService.create({
            amount: +data.purchase_units[0].amount.value,
            date: data.create_time,
            countryLocation: data.payer.address.country_code,
            referenceLocation:
              data.purchase_units[0].shipping.address.admin_area_1 ||
              data.purchase_units[0].shipping.address.admin_area_2,
            payerName: `${data.payer.name.given_name} ${data.payer.name.surname}`,
            payerEmail: data.payer.email_address,
            userId: data.payer.payer_id,
            paypalPaymentId: data.id,
          });
        }
        return JSON.parse(body);
      }
    } catch (error) {
      console.log(error);

      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
    }
  }

  async getPayment(orderID: string) {
    const collect = {
      id: orderID,
      prefer: 'return=minimal',
    };

    try {
      const { body, ...httpResponse } =
        await this.ordersController.ordersGet(collect);
      if (typeof body === 'string') {
        const response: PayPalResponse = JSON.parse(body);
        return response;
      }
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct() {
    const accessToken = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken.access_token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'PayPal-Request-Id': `${Date.now().toString()}`,
      Prefer: 'return=representation',
    };
    const product = await firstValueFrom(
      this.httpService.post(
        `${this.basePaypalApiUrl}/catalogs/products`,
        {
          name: 'Donation',
          type: 'SERVICE',
          category: 'SOFTWARE',
          description: 'Donation for the organization',
          // image_url: 'https://example.com/image.jpg', // Optional
          // home_url: 'https://example.com/home', // Optional
        },
        { headers },
      ),
    );

    return product.data;
  }

  async createPlan(productId: string) {
    const accessToken = await this.getAccessToken();
    console.log(accessToken);

    const plan = await firstValueFrom(
      this.httpService.post(
        `${this.basePaypalApiUrl}/billing/plans`,
        {
          product_id: productId,
          name: 'Video Streaming Service Plan',
          description: 'Video Streaming Service basic plan',
          status: 'ACTIVE',
          billing_cycles: [
            {
              frequency: {
                interval_unit: 'MONTH', // Unidad de tiempo del intervalo (meses)
                interval_count: 1, // Cantidad de unidades de tiempo por intervalo (1 mes)
              },
              tenure_type: 'REGULAR', // Tipo de ciclo (REGULAR indica un ciclo regular)
              sequence: 1, // Secuencia del ciclo (1er ciclo)
              total_cycles: 0, // Número total de ciclos (0 indica indefinido)
              pricing_scheme: {
                fixed_price: {
                  value: '10', // Precio fijo del ciclo (10 USD)
                  currency_code: 'USD', // Código de la moneda (USD)
                },
                // No incluyas setup_fee si no deseas cobrar una tarifa de instalación
              },
            },
          ],
          payment_preferences: {
            payment_failure_threshold: 3, // Umbral de fallos de pago (3 intentos)
          },
          taxes: {
            percentage: '10', // Porcentaje de impuestos (10%)
            inclusive: false, // Impuestos no incluidos en el precio
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.access_token}`, // Token de acceso para la autenticación
            'Content-Type': 'application/json', // Tipo de contenido de la solicitud
            Accept: 'application/json', // Aceptar respuesta en formato JSON
            'PayPal-Request-Id': `${Date.now().toString()}`, // ID de la solicitud para evitar duplicados
            Prefer: 'return=representation', // Preferencia de respuesta
          },
        },
      ),
    );

    return plan.data;
  }

  async getAccessToken() {
    const auth = Buffer.from(
      `${envs.PAYPAL_CLIENT_ID}:${envs.PAYPAL_SECRET}`,
    ).toString('base64');
    const headers = {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    // const body = 'grant_type=client_credentials';
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
    });
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.basePaypalApiUrl}/oauth2/token`, body, {
          headers,
        }),
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
