import { createBrowserRouter } from "react-router";
import App from "../App";
import SignIn from "../Components/Auth/SignIn";
import SignUp from "../Components/Auth/SignUp";
import ForgetPassword from "../Components/Auth/ForgetPassWord";
import OTPVerification from "../Components/Auth/OTPPage";
import ResetPassword from "../Components/Auth/ResetPassword";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            { index: true, Component: SignIn },
            { path: "signIn", Component: SignIn },
            { path: "signUp", Component: SignUp },
            { path: "forget_password", Component: ForgetPassword },
            { path: "otp_page", Component: OTPVerification },
            { path: "reset_password", Component: ResetPassword },
        ],
    },
]);
