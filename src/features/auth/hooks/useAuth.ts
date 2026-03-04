import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth.service';
import { LoginDto, RegisterDto, AuthResponse, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from '../api/types';
import Cookies from 'js-cookie';

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginDto) => authService.login(data),
        onSuccess: (data: AuthResponse) => {
            Cookies.set('token', data.access_token, { expires: 1 }); // 1 day
            // Optionally store user data in state/storage or rely on token
            queryClient.setQueryData(['user'], data.user);
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterDto) => authService.register(data),
        onSuccess: (data: AuthResponse) => {
            Cookies.set('token', data.access_token, { expires: 1 });
            queryClient.setQueryData(['user'], data.user);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return () => {
        Cookies.remove('token');
        queryClient.setQueryData(['user'], null);
        queryClient.removeQueries({ queryKey: ['user'] });
    };
};

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => authService.getProfile(),
        enabled: !!Cookies.get('token'),
        retry: false,
    });
};
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordDto) => authService.forgotPassword(data),
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: ResetPasswordDto) => authService.resetPassword(data),
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordDto) => authService.changePassword(data),
    });
};
