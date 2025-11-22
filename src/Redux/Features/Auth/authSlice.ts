import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    mode: 'login' | 'register' | 'forgotPassword' | 'OTPpage' | 'resetPassword'
}

const initialState: AuthState = {
    mode: 'login'
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload;
        }
    }
});

export const { setMode } = authSlice.actions;
export default authSlice.reducer;