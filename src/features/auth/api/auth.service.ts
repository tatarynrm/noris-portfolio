import authApi from '@/shared/api/axios.instance';
import { AuthResponse, ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, User } from './types';


export const authService = {
    async register(data: RegisterDto): Promise<AuthResponse> {
        const response = await authApi.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async login(data: LoginDto): Promise<AuthResponse> {
        const response = await authApi.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await authApi.get<User>('/auth/profile');
        return response.data;
    },

    async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
        const response = await authApi.post<{ message: string }>('/auth/forgot-password', data);
        return response.data;
    },

    async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
        const response = await authApi.post<{ message: string }>('/auth/reset-password', data);
        return response.data;
    },

    async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
        const response = await authApi.post<{ message: string }>('/auth/change-password', data);
        return response.data;
    },
};
