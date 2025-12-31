import { createBrowserRouter } from "react-router";
import App from "../App";
import HomePage from "../Pages/Home/HomePage";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import ForgetPassword from "../Pages/Auth/ForgetPassWord";
import OTPVerification from "../Pages/Auth/OTPPage";
import ResetPassword from "../Pages/Auth/ResetPassword";
import ProfilePage from "../Pages/Profile/ProfilePage";
import AddBlogPage from "../Pages/Blog/AddBlog";
import SingleBlogPage from "../Pages/Blog/BlogDetails";

export const routePath = {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot_password',
    OTPVerification: '/verify_otp',
    resetPassword: '/change_password',
    home: '/',
    profile: '/profile',
    addBlog: '/create_blog',
    featchSingleBlog: '/blog/:blogId',
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
            {
                path: routePath.profile,
                Component: ProfilePage,
            },
            {
                path: routePath.addBlog,
                Component: AddBlogPage,
            },
            {
                path: routePath.featchSingleBlog,
                Component: SingleBlogPage,
            }
        ],
    },
]);
