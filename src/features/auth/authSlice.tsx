import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  loginStatus: boolean;
};

const checkAuthStatus = (): boolean => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user); // لازم الاثنين يكونوا موجودين
};

const initialState: AuthState = {
  loginStatus: checkAuthStatus(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      state.loginStatus = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.loginStatus = false;
    }
  },
});

export const { setLoginStatus, logout } = authSlice.actions;
export default authSlice.reducer;