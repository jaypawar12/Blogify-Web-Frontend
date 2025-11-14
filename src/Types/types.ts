export interface LoginUserBody {
    email: string,
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