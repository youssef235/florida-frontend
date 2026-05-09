import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCartApi, getCartApi, syncCartApi } from "../../data/cartApi";

// cartSlice.ts
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
};

const initialState: CartState = {
  productsInCart: [],
  subtotal: 0,
  isLoading: false,
};

// ✅ يدعم _id و id في نفس الوقت
const mapCartItem = (item: any): ProductInCart => {
  const productId =
    item.product?._id || item.product?.id;

  const size = item.size || "";

  const color =
    item.color?.name ||
    item.color ||
    "Standard";

  const colorHex =
    item.color?.hex ||
    item.colorHex ||
    "";

  return {
    id:
      productId +
      size +
      color +
      colorHex,

    productId,
    title: item.product?.name,
    price: item.priceTag?.price,
    quantity: item.quantity,

    image:
      item.product?.images?.[0],

    priceTag:
      item.priceTag?._id ||
      item.priceTag?.id,

    size,
    color,
    colorHex,
  };
};
export const loadCart = createAsyncThunk("cart/load", async () => {
  return await getCartApi();
});

export const syncCart = createAsyncThunk(
  "cart/sync",
  async (_, { getState }: any) => {
    const state = getState();
    const data = state.cart.productsInCart.map((p: ProductInCart) => ({
      product: p.productId,
      priceTag: p.priceTag,
      quantity: p.quantity || 1,
      size: p.size,    // ✅ أضف
      color: p.color,  // ✅ أضف
      colorHex: p.colorHex,  // ✅ أضف
    }));
    return await syncCartApi(data);
  }
);
export const addToCart = createAsyncThunk(
  "cart/add",
  async (item: { product: string; priceTag: string; quantity: number }) => {
    return await addToCartApi(item);
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToTheCart: (state, action: PayloadAction<ProductInCart>) => {
      const product = state.productsInCart.find(
        (p) => p.id === action.payload.id
      );
      if (product) {
        product.quantity += action.payload.quantity;
      } else {
        state.productsInCart.push(action.payload);
      }
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    removeProductFromTheCart: (state, action: PayloadAction<{ id: string }>) => {
      state.productsInCart = state.productsInCart.filter(
        (p) => p.id !== action.payload.id
      );
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    updateProductQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const product = state.productsInCart.find(
        (p) => p.id === action.payload.id
      );
      if (product) {
        product.quantity = Number(action.payload.quantity);
      }
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    calculateTotalPrice: (state) => {
      state.subtotal = state.productsInCart.reduce((acc, p) => {
        const price = Number(p.price) || 0;
        const qty = Number(p.quantity) || 0;
        return acc + price * qty;
      }, 0);
    },

    setCartFromBackend: (state, action: PayloadAction<ProductInCart[]>) => {
      state.productsInCart = action.payload;
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    clearCart: (state) => {
      state.productsInCart = [];
      state.subtotal = 0;
    },
  },

  extraReducers: (builder) => {
    // ─── loadCart ───────────────────────────────────────
    builder.addCase(loadCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadCart.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.data) {
        state.productsInCart = action.payload.data.map(mapCartItem);
        cartSlice.caseReducers.calculateTotalPrice(state);
      }
    });
    builder.addCase(loadCart.rejected, (state) => {
      state.isLoading = false;
    });

    // ─── syncCart ───────────────────────────────────────
    builder.addCase(syncCart.pending, (state) => {
      state.isLoading = true;
    });
builder.addCase(syncCart.fulfilled, (state, action) => {
  state.isLoading = false;
  if (action.payload?.data) {
    // ✅ deduplicate بالـ id
    const seen = new Set<string>();
    const unique = action.payload.data
      .map(mapCartItem)
      .filter((item: { id: string; }) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    state.productsInCart = unique;
    cartSlice.caseReducers.calculateTotalPrice(state);
  }
});
    builder.addCase(syncCart.rejected, (state) => {
      state.isLoading = false;
    });

    // ─── addToCart ──────────────────────────────────────
    builder.addCase(addToCart.fulfilled, (state, action) => {
      if (action.payload?.data) {
        state.productsInCart = action.payload.data.map(mapCartItem);
        cartSlice.caseReducers.calculateTotalPrice(state);
      }
    });
  },
});

export const {
  addProductToTheCart,
  removeProductFromTheCart,
  updateProductQuantity,
  calculateTotalPrice,
  setCartFromBackend,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;