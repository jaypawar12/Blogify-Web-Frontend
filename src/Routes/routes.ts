import { createBrowserRouter } from "react-router";
import App from "../App";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import ForgetPassword from "../Pages/Auth/ForgetPassWord";
import OTPVerification from "../Pages/Auth/OTPPage";
import ResetPassword from "../Pages/Auth/ResetPassword";

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
        children: [
            { path: routePath.login, Component: SignIn },
            { path: routePath.register, Component: SignUp },
            { path: routePath.forgotPassword, Component: ForgetPassword },
            { path: routePath.otpVerify, Component: OTPVerification },
            { path: routePath.changePassword, Component: ResetPassword },
        ],
    },
]);
