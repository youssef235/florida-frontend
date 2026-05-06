import customFetch from "../axios/custom";

export const syncCartApi = async (data: any[]) => {
  const res = await customFetch.post("/carts/sync", { data });
  return res.data;
};

export const getCartApi = async () => {
  const res = await customFetch.get("/carts");
  return res.data;
};

export const addToCartApi = async (data: {
  product: string;
  priceTag: string;
  quantity: number;
}) => {
  const res = await customFetch.post("/carts", data);
  return res.data;
};