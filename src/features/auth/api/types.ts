export interface User {
    user_id: string;
    email: string;
    name: string | null;
    picture: string | null;
    role: 'user' | 'admin';
    created_at?: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface LoginDto {
    email: string;
    password?: string;
}

export interface RegisterDto {
    email: string;
    password?: string;
    name?: string;
}
export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    new_password: string;
}
export interface ChangePasswordDto {
    old_password: string;
    new_password: string;
}
