'use client';

import { useState, useRef, useEffect } from 'react';
import { useLogout, useUser } from '@/features/auth/hooks/useAuth';
import { User as UserIcon, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useRouter, Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { data: user } = useUser();
    const logout = useLogout();
    const router = useRouter();
    const t = useTranslations("navigation");

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        router.push('/auth/login');
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10"
            >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500/20 flex items-center justify-center text-blue-500 border border-blue-500/10">
                    {user?.picture ? (
                        <img src={user.picture} alt={user.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-4 h-4" />
                    )}
                </div>
                <div className="flex flex-col items-start ml-1 hidden lg:flex">
                    <span className="text-[11px] font-bold text-gray-900 dark:text-white leading-none mb-0.5 max-w-[100px] truncate">
                        {user?.name || 'User'}
                    </span>
                    <span className="text-[9px] text-gray-500 leading-none">{t("profile_label") || 'Profile'}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 top-12 w-48 p-2 rounded-2xl border border-gray-200 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-3xl bg-white/90 dark:bg-[#0a0a0a]/90 flex flex-col gap-1 origin-top-right"
                    >
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            {t("about")}
                        </Link>

                        {user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-blue-500/10 transition-colors text-sm font-medium text-blue-500"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                {t("admin_panel")}
                            </Link>
                        )}

                        <div className="h-px w-full bg-gray-200 dark:bg-white/10 my-1" />

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-medium text-red-500"
                        >
                            <LogOut className="w-4 h-4" />
                            {t("signout")}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
