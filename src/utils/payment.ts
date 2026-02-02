import axios from "axios";
import { MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "./env";

export interface Payment {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  callbacks?: {
    success_url: string;
    pending_url: string;
    error_url: string;
  };
}

export type TypeResponseMidtrans = {
  token: string;
  redirect_url: string;
};

export default {
  async createLink(payload: Payment): Promise<TypeResponseMidtrans> {
    try {
      const result = await axios.post<TypeResponseMidtrans>(
        `${MIDTRANS_TRANSACTION_URL}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${Buffer.from(
              `${MIDTRANS_SERVER_KEY}:`
            ).toString("base64")}`,
          },
        }
      );

      return result?.data;
    } catch (error: any) {
      console.error("Midtrans Error:", error.response?.data || error.message);
      throw new Error(
        `Payment failed: ${error.response?.data?.message || error.message}`
      );
    }
  },
};
