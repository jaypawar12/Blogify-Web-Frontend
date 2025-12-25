import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    email: string
}

const initialState: AuthState = {
    email: ""
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthEmail: (state, action) => {
            state.email = action.payload;
        },
    }
});

export const { setAuthEmail } = authSlice.actions;
export default authSlice.reducer;