import axios from "axios";
import type { LoginUserBody, RegisterUserBody } from "../Types/types";

class AuthService {
    authBaseURL = "https://blogify-web-backend.onrender.com/api";
    authLogin = "/auth/login";
    authRegister = "/auth/register";
    authForgotPassword = "/auth/forgot_password";
    authVerifyOtp = "/auth/verify_otp";

    getAuthToken() {
        return localStorage.getItem("token");
    }

    async loginUser(payload: LoginUserBody) {
        try {
            const res = await axios.post(this.authBaseURL + this.authLogin, {
                user_email: payload.email, // FIX
                password: payload.password,
            });

            return res.data;

        } catch (error: any) {
            return {
                error: true,
                message: error.response?.data?.message || "Login failed.",
            };
        }
    }


    async registerUser(payload: RegisterUserBody) {
        try {
            const formData = new FormData();

            formData.append("user_name", payload.user_name);
            formData.append("user_email", payload.user_email);
            formData.append("password", payload.password);
            formData.append("gender", payload.gender);
            formData.append("about", payload.about);

            if (payload.profile_image) {
                formData.append("profile_image", payload.profile_image);
            }

            const res = await axios.post(this.authBaseURL + this.authRegister, formData);

            return res.data;
        } catch (error: any) {
            return {
                error: true,
                message: error.response?.data?.message || "Registration failed.",
            };
        }
    }

    async forgotPassword(payload: any) {
        try {
            const res = await axios.post(this.authBaseURL + this.authForgotPassword, payload);
            return res.data;
        } catch (error: any) {
            return {
                error: true,
                message: error.response?.data?.message || "Request failed.",
            };
        }
    }

    async verifyOtp(payload: any) {
        try {
            const res = await axios.post(this.authBaseURL + this.authVerifyOtp, payload);
            return res.data;
        } catch (error: any) {
            return {
                error: true,
                message: error.response?.data?.message || "OTP verification failed.",
            };
        }
    }
}

export const authService = new AuthService();
