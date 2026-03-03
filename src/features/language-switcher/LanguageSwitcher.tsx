"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const locales = [
        { code: "en", label: "EN" },
        { code: "uk", label: "UK" },
        { code: "pl", label: "PL" },
        { code: "fr", label: "FR" },
        { code: "de", label: "DE" },
    ];

    const handleLocaleChange = (newLocale: string) => {
        setIsOpen(false);
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="relative z-50" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500 hover:border-blue-500/50 transition-colors focus:outline-none"
            >
                <Globe className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-32 p-2 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl"
                    >
                        {locales.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => handleLocaleChange(l.code)}
                                className={`block w-full text-left px-4 py-2 text-sm font-bold tracking-widest rounded-xl transition-colors ${locale === l.code
                                    ? "text-blue-500 bg-blue-500/10"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
