/* import axios from "axios";

const PAYMOB_API_KEY = import.meta.env.VITE_PAYMOB_API_KEY;
const BASE_URL = "https://accept.paymob.com/api";

// Step 1: Get Auth Token
export const getAuthToken = async (): Promise<string> => {
  const res = await axios.post(`${BASE_URL}/auth/tokens`, {
    api_key: PAYMOB_API_KEY,
  });
  return res.data.token;
};

// Step 2: Create Order
export const createOrder = async (
  authToken: string,
  amountCents: number
): Promise<{ orderId: number; orderUrl: string }> => {
  const res = await axios.post(`${BASE_URL}/ecommerce/orders`, {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: amountCents,
    currency: "EGP",
    items: [],
  });
  return {
    orderId: res.data.id,
    orderUrl: res.data.order_url,
  };
};

// Step 3: Get Payment Key
export const getPaymentKey = async (
  authToken: string,
  orderId: number,
  amountCents: number,
  integrationId: number
): Promise<string> => {
  const res = await axios.post(`${BASE_URL}/acceptance/payment_keys`, {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: orderId,
    billing_data: {
      first_name: "Customer",
      last_name: "Name",
      email: "customer@email.com",
      phone_number: "+201000000000",
      country: "EG",
      city: "Cairo",
      street: "NA",
      building: "NA",
      floor: "NA",
      apartment: "NA",
    },
    currency: "EGP",
    integration_id: integrationId,
  });
  return res.data.token;
};

// Pay with Mobile Wallet (Vodafone Cash / InstaPay)
export const payWithMobileWallet = async (
  amountCents: number
): Promise<string> => {
  const INTEGRATION_ID = 5658611;

  // Step 1: Auth
  const authToken = await getAuthToken();

  // Step 2: Order
  const { orderId, orderUrl } = await createOrder(authToken, amountCents);
  
  console.log("Order URL:", orderUrl);
  console.log("Order ID:", orderId);

  // Step 3: Payment Key
  const paymentKey = await getPaymentKey(
    authToken,
    orderId,
    amountCents,
    INTEGRATION_ID
  );

  console.log("Payment Key:", paymentKey);

  // Step 4: استخدم الـ standalone URL مع الـ payment token
const standaloneUrl = `https://accept.paymob.com/api/acceptance/iframes/1041820?payment_token=${paymentKey}`;
  console.log("Final URL:", standaloneUrl);
  
  return standaloneUrl;
}; */