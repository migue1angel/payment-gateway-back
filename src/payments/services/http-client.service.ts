import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { HttpError, HttpHeaders } from 'src/models/http-client.types';

@Injectable()
export class HttpClientService {
  constructor() {}

  private handleError(error: AxiosError): never {
    const httpError: HttpError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };

    throw httpError;
  }

  async get<T>(url: string, headers?: HttpHeaders): Promise<T> {
    try {
      const { data } = await axios.get<T>(url, { headers });

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T>(url: string, body: unknown, headers?: HttpHeaders): Promise<T> {
    try {
      const { data } = await axios.post<T>(url, body, { headers });
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T>(url: string, body: unknown, headers?: HttpHeaders): Promise<T> {
    try {
      const { data } = await axios.put<T>(url, body, { headers });
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T>(url: string, headers?: HttpHeaders): Promise<T> {
    try {
      const { data } = await axios.delete<T>(url, { headers });
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
