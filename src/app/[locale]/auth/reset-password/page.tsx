"use client";

import { useResetPassword } from "@/features/auth/hooks/useAuth";
import { motion } from "framer-motion";
import { Key, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

function ResetPasswordForm() {
    const t = useTranslations("auth");
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const { mutate: resetPassword, isPending } = useResetPassword();
    const router = useRouter();

    if (!token) {
        return (
            <div className="text-center py-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">{t("invalid_token_title")}</h2>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 max-w-[250px] mx-auto">{t("invalid_token_message")}</p>
                <Link
                    href="/auth/forgot-password"
                    className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 text-center active:scale-[0.98]"
                >
                    {t("request_new_link")}
                </Link>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match"); // TODO: Add to translations if needed
            return;
        }

        resetPassword({ token, new_password: password }, {
            onSuccess: () => {
                setIsSuccess(true);
            },
            onError: (err: any) => {
                setError(err.response?.data?.message || t("error_generic"));
            }
        });
    };

    return (
        <>
            {!isSuccess ? (
                <>
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">{t("reset_password_title")}</h1>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{t("reset_password_subtitle")}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t("new_password_label")}</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-14 outline-none transition-all font-bold text-sm sm:text-base text-gray-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t("confirm_password_label")}</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm sm:text-base text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-bold bg-red-500/10 py-3 px-5 rounded-xl border border-red-500/20">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 group active:scale-[0.98]"
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {t("update_password_button")}
                                    <Key className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </>
            ) : (
                <div className="text-center py-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">{t("reset_success_title")}</h2>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 max-w-[280px] mx-auto">
                        {t("reset_success_message")}
                    </p>
                    <Link
                        href="/auth/login"
                        className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 text-center flex items-center justify-center gap-2 group active:scale-[0.98]"
                    >
                        {t("sign_in_now")}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            {/* Background Decorations - Optimized for mobile */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/5 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none transition-colors duration-500" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/5 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none transition-colors duration-500" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md will-change-transform"
            >
                <div className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 sm:p-12 shadow-2xl relative z-10 transition-all duration-300">
                    <Suspense fallback={
                        <div className="py-12 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-xs font-bold text-gray-400 animate-pulse uppercase tracking-widest">Initialising Terminal...</p>
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </motion.div>
        </main>
    );
}
