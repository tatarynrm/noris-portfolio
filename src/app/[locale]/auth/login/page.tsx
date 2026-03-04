'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Link } from '@/i18n/routing';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { mutate: login, isPending, error } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormValues) => {
        login(data, {
            onSuccess: () => {
                router.push('/');
            },
        });
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-500">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/5 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/5 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md will-change-transform relative z-10"
            >
                <div className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 sm:p-12 shadow-2xl transition-all duration-300">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">
                            Access Port
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            Welcome back, Pioneer.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-red-500 text-sm font-bold text-center"
                        >
                            Authentication failed. Please check credentials.
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 ml-4">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    {...register('email')}
                                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[11px] sm:text-xs font-bold ml-4 mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-4">
                                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">
                                    Cipher
                                </label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors mr-1"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    {...register('password')}
                                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-[11px] sm:text-xs font-bold ml-4 mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 group active:scale-[0.98] mt-2"
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">OR</span>
                        <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                    </div>

                    <button
                        onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/auth/google`}
                        className="w-full mt-8 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs sm:text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="mt-10 text-center text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">
                        New here?{' '}
                        <Link href="/auth/register" className="text-blue-500 hover:text-blue-400 transition-colors ml-1">
                            Create Identity
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
