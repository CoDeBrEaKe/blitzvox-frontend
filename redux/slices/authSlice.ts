import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types
interface User {
  name: string;
  username: string;
  role: string;
}
interface loginData {
  username: string;
  password: string;
}
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginData: loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || error.message || "Login failed"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/logout");
      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || error.message || "Logout failed"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const authSlice =
  // create
  createSlice({
    name: "auth",
    initialState,
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // login cases
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.loading = false;
          state.error = null;
        });
    },
  });
export const { clearError } = authSlice.actions;
export default authSlice.reducer;
