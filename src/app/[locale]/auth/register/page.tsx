'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { mutate: registerUser, isPending, error } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormValues) => {
        registerUser(data, {
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
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-[10px] items-center font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">
                            Create Identity
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            Join the elite network of pioneers.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-red-500 text-sm font-bold text-center"
                        >
                            Registration failed. Please try again.
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 ml-4">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    {...register('name')}
                                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm sm:text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-[11px] sm:text-xs font-bold ml-4 mt-1">{errors.name.message}</p>}
                        </div>

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
                            <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 ml-4">
                                Secure Cipher
                            </label>
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
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 group active:scale-[0.98] mt-4"
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign Up
                                    <UserPlus className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">
                        Already have an identity?{' '}
                        <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 transition-colors ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
