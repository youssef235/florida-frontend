import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import customFetch from "../../axios/custom";

type ProductType = {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  categories?: { id: string; name: string }[];
  priceTags?: { id: string; price: number; oldPrice?: number | null }[];
  hasDiscount?: boolean;
  season?: "summer" | "winter" | null;
};

type WishlistState = {
  items: ProductType[];
  loading: boolean;
  error: string | null;
};

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || null;
  } catch {
    return null;
  }
};

export const fetchWishlist = createAsyncThunk<
  ProductType[],
  void,
  { rejectValue: string }
>("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    const userId = getUserId();
    if (!userId) return rejectWithValue("User not found in localStorage");

    const res = await customFetch.get(`/wishlist/${userId}`);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to fetch wishlist");
  }
});

export const addToWishlist = createAsyncThunk<
  { productId: string; message: string },
  string,
  { rejectValue: string }
>("wishlist/addToWishlist", async (productId, { rejectWithValue }) => {
  try {
    const userId = getUserId();
    if (!userId) return rejectWithValue("User not found in localStorage");

    const res = await customFetch.post(`/wishlist/${userId}`, { productId });
    return { productId, message: res.data.message };
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to add to wishlist");
  }
});

export const removeFromWishlist = createAsyncThunk<
  { productId: string; message: string },
  string,
  { rejectValue: string }
>("wishlist/removeFromWishlist", async (productId, { rejectWithValue }) => {
  try {
    const userId = getUserId();
    if (!userId) return rejectWithValue("User not found in localStorage");

    const res = await customFetch.delete(`/wishlist/${userId}/${productId}`);
    return { productId, message: res.data.message };
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to remove from wishlist");
  }
});

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<ProductType[]>) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wishlist";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const exists = state.items.some((item) => item.id === action.payload.productId);
        if (!exists) {
          state.items.push({ id: action.payload.productId, name: "" });
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload.productId);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;