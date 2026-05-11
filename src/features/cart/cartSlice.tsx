import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCartApi, getCartApi, syncCartApi } from "../../data/cartApi";

export type ProductInCart = {
  id: string;
  productId: string;
  priceTag: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  colorHex?: string;
};

type CartState = {
  productsInCart: ProductInCart[];
  subtotal: number;
  isLoading: boolean;
  isGuest: boolean;
};

const initialState: CartState = {
  productsInCart: [],
  subtotal: 0,
  isLoading: false,
  isGuest: true,
};

const CART_KEY = "guest_cart";

const saveGuestCart = (cart: ProductInCart[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const loadGuestCart = (): ProductInCart[] => {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const mapCartItem = (item: any): ProductInCart => ({
  id: item.id || (item.productId + (item.size || "") + (item.color || "")),
  productId: item.product?._id || item.productId,
  title: item.product?.name || item.title,
  price: item.priceTag?.price || item.price,
  quantity: item.quantity,
  image: item.product?.images?.[0] || item.image,
  priceTag: item.priceTag?._id || item.priceTag,
  size: item.size,
  color: item.color?.name || item.color || "Standard",
  colorHex: item.color?.hex || item.colorHex,
});

export const loadCart = createAsyncThunk("cart/load", async () => {
  return await getCartApi();
});

export const syncCart = createAsyncThunk("cart/sync", async (_, { getState }) => {
  const state = getState() as any;
  const isLoggedIn = state.auth?.loginStatus || false;

  if (!isLoggedIn) {
    saveGuestCart(state.cart.productsInCart);
    return null;
  }

  const data = state.cart.productsInCart.map((p: ProductInCart) => ({
    product: p.productId,
    priceTag: p.priceTag,
    quantity: p.quantity,
    size: p.size,
    color: p.color,
  }));

  return await syncCartApi(data);
});

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToTheCart: (state, action: PayloadAction<ProductInCart>) => {
      const existing = state.productsInCart.find(p => p.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.productsInCart.push(action.payload);
      }
      cartSlice.caseReducers.calculateTotalPrice(state);
      saveGuestCart(state.productsInCart);
    },

    removeProductFromTheCart: (state, action: PayloadAction<{ id: string }>) => {
      state.productsInCart = state.productsInCart.filter(p => p.id !== action.payload.id);
      cartSlice.caseReducers.calculateTotalPrice(state);
      saveGuestCart(state.productsInCart);
    },

    updateProductQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.productsInCart.find(p => p.id === action.payload.id);
      if (product) product.quantity = action.payload.quantity;
      cartSlice.caseReducers.calculateTotalPrice(state);
      saveGuestCart(state.productsInCart);
    },

    calculateTotalPrice: (state) => {
      state.subtotal = state.productsInCart.reduce((acc, p) => {
        return acc + (Number(p.price) || 0) * (Number(p.quantity) || 0);
      }, 0);
    },

    setCartFromBackend: (state, action: PayloadAction<ProductInCart[]>) => {
      state.productsInCart = action.payload;
      state.isGuest = false;
      cartSlice.caseReducers.calculateTotalPrice(state);
      localStorage.removeItem(CART_KEY);
    },

    mergeGuestCartToUser: (state, action: PayloadAction<ProductInCart[]>) => {
      const userCart = action.payload;
      const guestCart = [...state.productsInCart];

      const merged = [...userCart];

      guestCart.forEach(guest => {
        const exists = merged.findIndex(item => item.id === guest.id);
        if (exists !== -1) {
          merged[exists].quantity += guest.quantity;
        } else {
          merged.push(guest);
        }
      });

      state.productsInCart = merged;
      state.isGuest = false;
      cartSlice.caseReducers.calculateTotalPrice(state);
      localStorage.removeItem(CART_KEY);
    },

    clearCart: (state) => {
      state.productsInCart = [];
      state.subtotal = 0;
      localStorage.removeItem(CART_KEY);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loadCart.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.data) {
        state.productsInCart = action.payload.data.map(mapCartItem);
        state.isGuest = false;
        cartSlice.caseReducers.calculateTotalPrice(state);
      }
    });
  },
});

export const {
  addProductToTheCart,
  removeProductFromTheCart,
  updateProductQuantity,
  setCartFromBackend,
  mergeGuestCartToUser,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;