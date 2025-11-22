import axios from "axios";
import type { LoginUserBody, RegisterUserBody } from "../Types/types";
import toast from "react-hot-toast";



class AuthService {
    authBaseURL = "https://blogify-web-backend.vercel.app/api";
    authLogin = "/auth/login";
    authRegister = "/auth/register";
    authForgotPasswor = "/auth/forgot_password"
    authVerifyOtp = "/auth/verify_otp"

    getAuthToken() {
        return localStorage.getItem('token');
    }

    async loginUser(payload: LoginUserBody) {
        try {
            const res = await axios.post(this.authBaseURL + this.authLogin, payload);

            console.log(res.data);

            return res.data;
        } catch (error) {
            console.log("Login Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }
    }

    async registerUser(payload: RegisterUserBody) {
        try {
            const formData = new FormData();

            formData.append('name', payload.user_name);
            formData.append('email', payload.user_email);
            formData.append('password', payload.password);
            formData.append('gender', payload.gender);
            formData.append('about', payload.about);
            if (payload.profile_image != null) {
                formData.append('profile_image', payload.profile_image);
            }

            console.log("API FormData :", formData);

            const res = await axios.post(this.authBaseURL + this.authRegister, formData);

            console.log(res.data);

            return res.data;

        } catch (error) {
            console.log("Register Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }
    }

    async forgotPassword(payload: any) {
        try {
            const res = await axios.post(this.authBaseURL + this.authForgotPasswor, payload);
            console.log(res.data);

            return res.data;
        } catch (error) {
            console.log("Forgot Password Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }
    }

    async verifyOtp(payload: any) {
        try {
            const res = await axios.post(this.authBaseURL + this.authVerifyOtp, payload);
            console.log(res.data);

            return res.data;
        } catch (error) {
            console.log("Verify OTP Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }
    }
}

export const authService = new AuthService();