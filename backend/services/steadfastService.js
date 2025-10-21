const axios = require("axios");

const STEADFAST_BASE_URL = process.env.STEADFAST_BASE_URL;
const STEADFAST_API_KEY = process.env.STEADFAST_API_KEY;
const STEADFAST_SECRET_KEY = process.env.STEADFAST_SECRET_KEY;

class SteadfastService {
  constructor() {
    this.client = axios.create({
      baseURL: STEADFAST_BASE_URL,
      headers: {
        "Api-Key": STEADFAST_API_KEY,
        "Secret-Key": STEADFAST_SECRET_KEY,
        "Content-Type": "application/json",
      },
    });
  }

  // Create parcel in Steadfast
  async createParcel(order) {
    try {
      const recipientAddress = this.formatAddress(order.shippingInfo);

      const parcelData = {
        invoice: `SO${order.orderId}`, // Unique invoice with order ID
        recipient_name: order.shippingInfo.fullName,
        recipient_phone: order.shippingInfo.phone,
        recipient_email: order.shippingInfo.email,
        recipient_address: recipientAddress,
        cod_amount: order.cashOnDelivery || 0,
        delivery_type: 0, // Regular delivery
      };

      console.log("Creating parcel in Steadfast:", parcelData);

      const response = await this.client.post("/create_order", parcelData);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Steadfast API Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Format address for Steadfast
  formatAddress(shippingInfo) {
    return `${shippingInfo.address}, ${shippingInfo.thana}, ${shippingInfo.district}, ${shippingInfo.zipCode}, ${shippingInfo.country}`;
  }
}

module.exports = new SteadfastService();
