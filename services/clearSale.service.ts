import axios, { AxiosInstance } from "axios";
import { envs } from "@/constants/envs";

export type ClearSaleTransactionPayload = {
  documentType: string;
  document: string;
  name: string;
  birthdate: string;
  mothersName: string;
  email: string;
  verifiedEmail?: boolean;
  sessionId?: string;
};

export type ClearSaleTransactionResponse = {
  transactionId: string;
};

export interface ClearSaleService {
  authenticate(): Promise<string>;
  createTransaction(
    token: string,
    payload: ClearSaleTransactionPayload,
  ): Promise<ClearSaleTransactionResponse>;
}

class ClearSaleServiceImpl implements ClearSaleService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: envs.CLEARSALE_DATATRUST_API_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async authenticate(): Promise<string> {
    console.log("[ClearSale] authenticate request", {
      url: "/authentication/",
      username: envs.CLEARSALE_USERNAME,
    });
    try {
      const response = await this.http.post("/authentication/", {
        Username: envs.CLEARSALE_USERNAME,
        Password: envs.CLEARSALE_PASSWORD,
      });
      const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.access_token ||
        response.data?.Token;
      console.log("[ClearSale] authenticate response", { token: Boolean(token) });
      if (!token) {
        throw new Error("Não foi possível obter o token da ClearSale.");
      }
      return token;
    } catch (error) {
      console.error("[ClearSale] authenticate failed", error);
      throw error;
    }
  }

  async createTransaction(
    token: string,
    payload: ClearSaleTransactionPayload,
  ): Promise<ClearSaleTransactionResponse> {
    console.log("[ClearSale] createTransaction request", {
      endpoint: "/transaction/",
      token: Boolean(token),
      payload,
    });
    try {
      const response = await this.http.post("/transaction/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("[ClearSale] createTransaction full response", {
        status: response.status,
        data: response.data,
      });
      const transactionId = response.data?.transactionId ?? response.data?.id;
      console.log("[ClearSale] createTransaction response", { transactionId });
      if (!transactionId) {
        throw new Error("Transação ClearSale inválida.");
      }
      return { transactionId };
    } catch (error) {
      console.error("[ClearSale] createTransaction failed", error);
      throw error;
    }
  }
}

export const clearSaleService: ClearSaleService = new ClearSaleServiceImpl();
