import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Features/Auth/authSlice'
import blocReducer from './Features/Blog/blogSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        blog: blocReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch