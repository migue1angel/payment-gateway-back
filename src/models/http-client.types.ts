export type HttpHeaders = Record<string, string>;
export type HttpError = {
  message: string;
  status?: number;
  data?: any;
};