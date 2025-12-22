import axios from "axios";
import toast from "react-hot-toast";
import { authService } from "./AuthService";

class BlogService {
    baseURL = "https://blog-web-backend-1-dkyg.onrender.com/api";
    blog = "/blog/";
    userProfile = "/user/profile";

    private blogHeader() {
        const token = authService.getAuthToken();
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    async fetchAllBlogs() {
        try {
            const res = await axios.get(
                this.baseURL + this.blog,
                this.blogHeader()
            );
            return res.data;
        } catch (err: any) {
            console.error("Fetch All Blogs Error:", err);
            toast.error(err?.response?.data?.message || "Something went wrong!");
            return { error: true };
        }
    }

    async fetchSingleBlog(blogId: string) {
        try {
            const res = await axios.get(
                this.baseURL + this.blog + blogId,
                this.blogHeader()
            );
            return res.data;
        } catch (err: any) {
            console.error("Fetch Single Blog Error:", err);
            toast.error(err?.response?.data?.message || "Something went wrong!");
            return { error: true };
        }
    }

    async fetchUserProfile() {
        try {
            const res = await axios.get(
                this.baseURL + this.userProfile,
                this.blogHeader()
            );
            return res.data;
        } catch (err: any) {
            console.error("Fetch User Profile Error:", err);
            toast.error(err?.response?.data?.message || "Something went wrong!");
            return { error: true };
        }
    }
}

export const blogService = new BlogService();
