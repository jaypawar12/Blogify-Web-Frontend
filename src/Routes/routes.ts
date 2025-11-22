import { createBrowserRouter } from "react-router";
import App from "../App";

export const routePath = {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot_password',
    otpVerify: '/otp_verify',
    changePassword: '/change_password',
    home: '/home',
}

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
    },
]);
