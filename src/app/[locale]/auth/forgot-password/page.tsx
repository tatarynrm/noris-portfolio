"use client";

import { useForgotPassword } from "@/features/auth/hooks/useAuth";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";

export default function ForgotPasswordPage() {
    const t = useTranslations("Auth");
    const [email, setEmail] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const { mutate: forgotPassword, isPending } = useForgotPassword();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        forgotPassword({ email }, {
            onSuccess: () => {
                setIsSuccess(true);
            },
            onError: (err: any) => {
                const message = err.response?.data?.message;
                if (message === "User with this email was not found") {
                    setError(t("error_user_not_found"));
                } else {
                    setError(t("error_generic"));
                }
            }
        });
    };

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
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-[10px] items-center font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors mb-8 group p-1 -ml-1"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {t("back_to_login")}
                    </Link>

                    {!isSuccess ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">{t("forgot_password_title")}</h1>
                                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{t("forgot_password_subtitle")}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t("email_label")}</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t("email_placeholder")}
                                            className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm sm:text-base text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-red-500 text-[11px] sm:text-xs font-bold ml-4 mt-1 animate-in fade-in slide-in-from-left-1">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 group active:scale-[0.98]"
                                >
                                    {isPending ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {t("send_link_button")}
                                            <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
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
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">{t("success_title")}</h2>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 max-w-[280px] mx-auto">
                                {t("success_message", { email })}
                            </p>
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="w-full py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-2xl transition-all active:scale-[0.98]"
                            >
                                {t("return_to_login")}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
