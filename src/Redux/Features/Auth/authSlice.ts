import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    mode: 'login' | 'register' | 'forgotPassword' | 'OTPpage' | 'resetPassword',
    email: string
}

const initialState: AuthState = {
    mode: 'login',
    email: ""
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload;
        },

        setAuthEmail: (state, action) => {
            state.email = action.payload;
        },
    }
});

export const { setMode, setAuthEmail } = authSlice.actions;
export default authSlice.reducer;