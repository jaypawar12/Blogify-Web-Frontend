import axios from "axios";
import type { ChangePasswordPayload, LoginUserBody, RegisterUserBody } from "../Types/types";

class AuthService {
    // "https://blogify-web-backend.vercel.app/api"
    authBaseURL = "http://localhost:8000/api";
    authLogin = "/auth/login";
    authRegister = "/auth/register";
    authForgotPassword = "/auth/forgot_password";
    authVerifyOtp = "/auth/verify_otp";
    authResetPassword = "/auth/change_password";

    getAuthToken() {
        return localStorage.getItem("token");
    }

    async loginUser(payload: LoginUserBody) {
        try {
            console.log("data", payload.user_email, payload.password);

            const res = await axios.post(this.authBaseURL + this.authLogin, {
                user_email: payload.user_email,
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

    async changePassword(payload: ChangePasswordPayload) {
        try {
            // console.log("Payload", payload);
            const res = await axios.post(this.authBaseURL + this.authResetPassword, payload);
            return res.data;
        } catch (error: any) {
            return {
                error: true,
                message: error.response?.data?.message || "Password reset failed.",
            };
        }

    }

}
export const authService = new AuthService();
