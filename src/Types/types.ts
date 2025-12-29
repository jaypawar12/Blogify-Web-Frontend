export interface LoginUserBody {
    user_email: string,
    password: string
}

export interface RegisterUserBody {
    user_name: string,
    user_email: string,
    password: string,
    gender: string,
    about: string,
    profile_image: File | null
}

export interface OTPVerifyPayLoad {
    user_email: string,
    OTP: string
}

export interface ChangePasswordPayload {
    user_email: string,
    newPassword: string
}

export interface BlogResponse {
    status: number;
    error: boolean;
    message: string;
    result: Blog[];
}

export interface Blog {
    _id: string;
    title: string;
    subtitle: string;
    content: string;
    thumbnail: string;
    author: Author;
    category: string;
    tags: string[];
    likes: number;
    views?: number;
    create_at: string;
    update_at: string;
    comment: Comment[];
}

export interface Author {
    _id: string;
    user_name: string;
    gender: string;
    profile_image: string;
}

export interface Comment {
    _id: string;
    userId: Author;
    msg: string;
    create_at: string;
}

export interface User {
    _id: string,
    user_name: string,
    user_email: string,
    gender: string,
    about: string,
    profile_image: string,
    create_at: string;
    update_at: string;
    password: string;
}

export interface AddBlog {
    _id: string;
    title: string;
    subtitle: string;
    content: string;
    thumbnail: string;
    author: string;
    category: string;
    tags: string[];
}