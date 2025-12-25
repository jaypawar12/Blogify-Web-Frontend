import { createBrowserRouter } from "react-router";
import App from "../App";
import HomePage from "../Pages/Home/HomePage";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import ForgetPassword from "../Pages/Auth/ForgetPassWord";
import OTPVerification from "../Pages/Auth/OTPPage";
import ResetPassword from "../Pages/Auth/ResetPassword";
// import ResetPassword from "../Pages/Auth/ResetPassword";

export const routePath = {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot_password',
    OTPVerification: '/verify_otp',
    resetPassword: '/change_password',
    home: '/home',
}

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                path: routePath.login,
                Component: SignIn,
            },
            {
                path: routePath.register,
                Component: SignUp,
            },
            {
                path: routePath.forgotPassword,
                Component: ForgetPassword,
            },
            {
                path: routePath.OTPVerification,
                Component: OTPVerification,
            },
            {
                path: routePath.resetPassword,
                Component: ResetPassword,
            },
            {
                path: routePath.home,
                Component: HomePage,
            },
        ],
    },
]);
