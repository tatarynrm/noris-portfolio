"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

/* ─────────────────────────────────────────────────────────── *
 *  CVButton                                                   *
 *  Hover on desktop / tap on mobile → flyout with 3 options: *
 *    • View   — opens the .txt file in a new tab             *
 *    • Download — triggers file download                      *
 *    • Contact — scrolls to / links to #contact              *
 * ─────────────────────────────────────────────────────────── */

const CV_PATH = "/CV_RomanNoris.txt";

interface CVButtonProps {
    /** compact = pill style for header nav; full = big button for mobile menu */
    variant?: "compact" | "full";
    /** called after any option is picked (e.g. close mobile menu) */
    onPick?: () => void;
}

export function CVButton({ variant = "compact", onPick }: CVButtonProps) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tNav = useTranslations("Navigation");

    const cancelClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };
    const scheduleClose = () => {
        cancelClose();
        closeTimer.current = setTimeout(() => setOpen(false), 220);
    };
    const close = () => { cancelClose(); setOpen(false); };

    const options = [
        {
            icon: Eye,
            label: tNav("preview_cv"),
            href: CV_PATH,
            target: "_blank",
            download: false,
        },
        {
            icon: Download,
            label: tNav("download_cv"),
            href: CV_PATH,
            target: "_self",
            download: true,
        },
        {
            icon: Mail,
            label: tNav("contact_me"),
            href: "/#contact",
            target: "_self",
            download: false,
            isContact: true,
        },
    ] as const;

    const trigger =
        variant === "compact" ? (
            /* Desktop pill button */
            <button
                onClick={() => setOpen((o) => !o)}
                onMouseEnter={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 backdrop-blur-md bg-white/5 text-sm font-medium"
            >
                <Download className="w-4 h-4" />

            </button>
        ) : (
            /* Mobile full-width button */
            <button
                onClick={() => setOpen((o) => !o)}
                className="mt-4 flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-blue-600 text-white font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(37,99,235,0.4)] w-full max-w-xs"
            >
                <Download className="w-5 h-5" />

            </button>
        );

    return (
        <div
            ref={wrapRef}
            className="relative"
            onMouseEnter={() => variant === "compact" && cancelClose()}
            onMouseLeave={() => variant === "compact" && scheduleClose()}
        >
            {trigger}

            <AnimatePresence>
                {open && (
                    <>
                        {/* Click-outside backdrop (mobile / full variant) */}
                        {variant === "full" && (
                            <div
                                className="fixed inset-0 z-40"
                                onClick={close}
                            />
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.96 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className={[
                                "absolute z-50 flex flex-col gap-1 p-2 rounded-2xl",
                                "bg-white/[0.95] dark:bg-black/80 backdrop-blur-2xl",
                                "border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
                                variant === "compact"
                                    ? "top-full mt-2 right-0 min-w-[180px]"
                                    : "bottom-full mb-3 left-1/2 -translate-x-1/2 min-w-[200px]",
                            ].join(" ")}
                        >
                            {options.map(({ icon: Icon, label, href, target, download, ...rest }) => {
                                const isContact = "isContact" in rest && rest.isContact;

                                const cls =
                                    "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium " +
                                    "text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 " +
                                    "hover:bg-blue-500/[0.08] transition-all duration-200 cursor-pointer";

                                if (isContact) {
                                    return (
                                        <Link
                                            key={label}
                                            href="/#contact"
                                            className={cls}
                                            onClick={() => { close(); onPick?.(); }}
                                        >
                                            <Icon className="w-4 h-4 shrink-0 text-blue-400" />
                                            {label}
                                        </Link>
                                    );
                                }

                                return (
                                    <a
                                        key={label}
                                        href={href}
                                        target={target}
                                        download={download || undefined}
                                        rel={target === "_blank" ? "noopener noreferrer" : undefined}
                                        className={cls}
                                        onClick={() => { close(); onPick?.(); }}
                                    >
                                        <Icon className="w-4 h-4 shrink-0 text-blue-400" />
                                        {label}
                                    </a>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
