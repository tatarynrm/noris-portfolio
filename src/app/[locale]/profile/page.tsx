"use client";

import { useUser } from "@/features/auth/hooks/useAuth";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, MapPin, Camera, LogOut, Code, Briefcase, Zap, Key, Lock, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLogout, useChangePassword } from "@/features/auth/hooks/useAuth";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";

export default function ProfilePage() {
    const { data: user, isLoading } = useUser();
    const logout = useLogout();
    const router = useRouter();
    const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [changeError, setChangeError] = useState("");

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setChangeError("");
        setChangeSuccess(false);

        changePassword({ old_password: oldPassword, new_password: newPassword }, {
            onSuccess: () => {
                setChangeSuccess(true);
                setOldPassword("");
                setNewPassword("");
            },
            onError: (err: any) => {
                setChangeError(err.response?.data?.message || "Failed to update security credentials.");
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505]">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505] p-6">
                <div className="text-center p-12 bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 max-w-sm w-full shadow-2xl">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight mb-2">Access Denied</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">You need to establish a secure session to view this terminal.</p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25"
                    >
                        Authenticate Now
                    </button>
                </div>
            </div>
        );
    }

    const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('uk-UA', {
        month: 'long',
        year: 'numeric'
    }) : 'Березень 2026';

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#050505] pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Decorations - Simplified blurs for better scroll performance */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[64px] rounded-full pointer-events-none " />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[64px] rounded-full pointer-events-none " />

            <div className="container mx-auto max-w-5xl relative z-10">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[3rem] p-8 md:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] mb-8 will-change-transform"
                >
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                        {/* Avatar Section */}
                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="w-40 h-40 md:w-52 md:h-52 rounded-[2.5rem] overflow-hidden border-[6px] border-white dark:border-white/10 shadow-2xl relative z-20 group will-change-transform"
                            >
                                {user.picture ? (
                                    <img src={user.picture} alt={user.name || 'User'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                        <User className="w-24 h-24 text-white/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </motion.div>
                            <div className="absolute -inset-4 bg-blue-500/10 blur-xl rounded-full -z-10 animate-pulse" />
                        </div>

                        {/* Stats & Identity */}
                        <div className="flex-1 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="will-change-opacity"
                            >
                                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-4">
                                    System Operator
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white mb-6 leading-none">
                                    {user.name || 'Anonymous'}
                                </h1>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
                                    <div className="bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 transition-colors">
                                        <Mail className="w-5 h-5 text-blue-500" />
                                        <span className="font-bold text-sm tracking-tight">{user.email}</span>
                                    </div>
                                    <div className="bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 transition-colors">
                                        <Shield className="w-5 h-5 text-green-500" />
                                        <span className="font-bold text-sm tracking-tight">Verified Identity</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <button
                                        onClick={handleLogout}
                                        className="px-8 py-4 bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center gap-2 group"
                                    >
                                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        Log Out
                                    </button>
                                    <button className="p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:border-blue-500/50 transition-all">
                                        <Zap className="w-5 h-5 text-blue-500" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[3rem] p-10 shadow-xl will-change-transform"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black tracking-tight">System Metadata</h3>
                            <Code className="w-6 h-6 text-blue-500" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Unique Identity Hash</p>
                                <p className="font-mono text-sm bg-blue-500/5 text-blue-500 px-4 py-2 rounded-xl inline-block border border-blue-500/10">
                                    {user.user_id}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Geolocation</p>
                                <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white">
                                    <MapPin className="w-5 h-5 text-orange-500" />
                                    Kyiv, Ukraine
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Affiliation</p>
                                <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white">
                                    <Briefcase className="w-5 h-5 text-purple-500" />
                                    Autonomous Resident
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Access Level</p>
                                <div className="flex items-center gap-2 font-black text-blue-500">
                                    <Shield className="w-5 h-5" />
                                    Administrator
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group  will-change-transform"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[40px] rounded-full " />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                                <Calendar className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight mb-2">Service Duration</h3>
                            <p className="text-blue-100 font-medium mb-8">Member since the era of Antigravity.</p>

                            <div className="space-y-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                                    <p className="text-xs font-black uppercase tracking-widest text-blue-200 mb-1">Initialized</p>
                                    <p className="text-2xl font-black">{joinDate}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                                    <p className="text-xs font-black uppercase tracking-widest text-blue-200 mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <p className="text-xl font-black">Active Terminal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Security Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[3rem] p-10 shadow-xl overflow-hidden relative group  will-change-transform"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black tracking-tight">Security Credentials</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your access keys for the system terminal.</p>
                        </div>
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>

                    <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Current Access Key</label>
                                <div className="relative group/input">
                                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">New Access Key</label>
                                <div className="relative group/input">
                                    <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-green-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-green-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end gap-6">
                            {changeSuccess && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-center gap-4 text-green-500 animate-in fade-in slide-in-from-bottom-2">
                                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                                    <p className="text-sm font-black">Security credentials updated.</p>
                                </div>
                            )}

                            {changeError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-center gap-4 text-red-500 animate-in fade-in slide-in-from-bottom-2">
                                    <Shield className="w-6 h-6 shrink-0" />
                                    <p className="text-sm font-black">{changeError}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full md:w-auto self-end px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isChangingPassword ? (
                                    <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Recalibrate
                                        <Zap className="w-4 h-4 fill-current" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
