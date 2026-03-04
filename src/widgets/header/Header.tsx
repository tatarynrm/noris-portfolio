"use client";

import { Link, usePathname } from "@/i18n/routing";
import { ThemeToggler } from "@/features/theme-toggler/ThemeToggler";
import { LanguageSwitcher } from "@/features/language-switcher/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X, Cpu, Network, Truck, ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";
import { CVButton } from "./CVButton";
import { UserDropdown } from "@/shared/ui/UserDropdown";
import Cookies from "js-cookie";
import { useEffect } from "react";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAboutHovered, setIsAboutHovered] = useState(false);
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const tNav = useTranslations("Navigation");
    const tProj = useTranslations("Projects");
    const pathname = usePathname();
    const lenis = useLenis();

    useEffect(() => {
        const checkAuth = () => {
            const token = Cookies.get('token');
            setIsAuthenticated(!!token);
        };
        checkAuth();
        // Setup simple polling or event listener to catch updates across tabs/components if needed.
        const interval = setInterval(checkAuth, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
        if (pathname === "/") {
            e.preventDefault();
            lenis?.scrollTo(target, { offset: 0, duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            setIsOpen(false);
        }
    };

    // The truncated dropdown projects
    const dropdownProjects = [
        {
            title: tProj("p1_title"),
            icon: <Cpu className="w-5 h-5 text-blue-400" />,
            color: "from-blue-600 to-cyan-500",
            bg: "bg-blue-500/10",
        },
        {
            title: tProj("p2_title"),
            icon: <Network className="w-5 h-5 text-purple-400" />,
            color: "from-purple-600 to-pink-500",
            bg: "bg-purple-500/10",
        },
        {
            title: tProj("p3_title"),
            icon: <Truck className="w-5 h-5 text-orange-400" />,
            color: "from-orange-600 to-yellow-500",
            bg: "bg-orange-500/10",
        }
    ];

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-white/70 dark:bg-black/20 border-b border-gray-200/40 dark:border-white/10 transition-colors duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-sm"
            >
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    <Link
                        href="/"
                        onClick={(e) => {
                            if (pathname === "/") {
                                e.preventDefault();
                                lenis?.scrollTo(0, { offset: 0, duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                            }
                        }}
                        className="text-3xl font-extrabold tracking-tighter w-[120px] text-gray-900 dark:text-white relative z-50"
                    >
                        Noris<span className="text-blue-500">.</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[13px] font-bold tracking-widest uppercase text-gray-700 dark:text-gray-300">

                        <div
                            className="relative py-8"
                            onMouseEnter={() => setIsAboutHovered(true)}
                            onMouseLeave={() => setIsAboutHovered(false)}
                        >
                            <Link
                                href="/#about"
                                onClick={(e) => handleScroll(e, '#about')}
                                className={`flex items-center gap-1.5 transition-colors relative group ${isAboutHovered ? 'text-blue-500' : 'hover:text-black dark:hover:text-white'}`}
                            >
                                {tNav("about")}
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isAboutHovered ? 'rotate-180 text-blue-500' : ''}`} />
                                <span className={`absolute -bottom-2 left-0 h-[2px] bg-blue-500 transition-all duration-300 ${isAboutHovered ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </Link>

                            {/* Secondary Header / Sub-nav */}
                            <AnimatePresence>
                                {isAboutHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        className="fixed top-24 left-0 w-full bg-white/95 dark:bg-black/80 backdrop-blur-3xl border-b border-gray-200/50 dark:border-white/5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
                                    >
                                        <div className="container mx-auto px-6 flex items-center justify-center gap-12">
                                            <Link href="/#experience" onClick={(e) => handleScroll(e, '#experience')} className="text-[11px] font-bold tracking-[0.2em] text-gray-500 hover:text-blue-500 transition-colors uppercase py-2">
                                                {tNav("experience")}
                                            </Link>
                                            <Link href="/#skills" onClick={(e) => handleScroll(e, '#skills')} className="text-[11px] font-bold tracking-[0.2em] text-gray-500 hover:text-blue-500 transition-colors uppercase py-2">
                                                {tNav("skills")}
                                            </Link>
                                            <Link href="/#services" onClick={(e) => handleScroll(e, '#services')} className="text-[11px] font-bold tracking-[0.2em] text-gray-500 hover:text-blue-500 transition-colors uppercase py-2">
                                                {tNav("services")}
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Nested Selected Works Dropdown */}
                        <div
                            className="relative group py-8"
                            onMouseEnter={() => setIsProjectsOpen(true)}
                            onMouseLeave={() => setIsProjectsOpen(false)}
                        >
                            <Link href="/projects" onClick={(e) => handleScroll(e, '#projects')} className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors relative group">
                                {tNav("selected_works")}
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isProjectsOpen ? 'rotate-180' : ''}`} />
                                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full" />
                            </Link>

                            {/* Dropdown Pane */}
                            <AnimatePresence>
                                {isProjectsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-[80px] -left-1/2 w-[350px] p-4 rounded-3xl border border-gray-200 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-3xl bg-white/90 dark:bg-[#0a0a0a]/90 flex flex-col gap-2 origin-top"
                                    >
                                        <div className="flex flex-col gap-2">
                                            {dropdownProjects.map((proj, i) => (
                                                <Link
                                                    key={i}
                                                    href="/projects"
                                                    className="group/card flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${proj.bg} border border-black/5 dark:border-white/10 group-hover/card:scale-110 transition-transform duration-300`}>
                                                        {proj.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 group-hover/card:text-blue-500 transition-colors line-clamp-2 leading-tight normal-case tracking-normal">
                                                            {proj.title}
                                                        </h4>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="w-full h-px bg-gray-200 dark:bg-white/10 my-2" />

                                        <Link
                                            href="/projects"
                                            className="group/btn flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white font-bold tracking-widest text-xs uppercase transition-all duration-300"
                                        >
                                            {tNav("view_all_projects")}
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link href="/#contact" onClick={(e) => handleScroll(e, '#contact')} className="hover:text-black dark:hover:text-white transition-colors relative group">
                            {tNav("contact")}
                            <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <CVButton variant="compact" />
                    </nav>

                    <div className="hidden md:flex items-center gap-4 justify-end relative z-50">
                        <LanguageSwitcher />
                        <ThemeToggler />
                        {isAuthenticated ? (
                            <UserDropdown />
                        ) : (
                            <Link
                                href="/auth/login"
                                className="ml-2 text-[13px] font-bold tracking-widest uppercase text-gray-700 dark:text-white border border-gray-300 dark:border-white/10 px-5 py-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                {tNav("signin")}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle & Theme */}
                    <div className="md:hidden flex items-center gap-4 relative z-50">
                        {isAuthenticated ? (
                            <UserDropdown />
                        ) : (
                            <Link href="/auth/login" className="text-sm font-bold uppercase text-gray-900 dark:text-white">
                                {tNav("signin")}
                            </Link>
                        )}
                        <LanguageSwitcher />
                        <ThemeToggler />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 -mr-2 text-gray-900 dark:text-white focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: isOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </motion.div>
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-40 bg-white dark:bg-black md:hidden flex flex-col pt-32 px-8 overflow-hidden"
                    >
                        {/* Decorative Background Elements */}
                        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />

                        <div className="flex flex-col gap-6 relative z-10">
                            {[
                                { name: tNav("about"), href: "/#about", id: "#about" },
                                { name: tNav("experience"), href: "/#experience", id: "#experience" },
                                { name: tNav("skills"), href: "/#skills", id: "#skills" },
                                { name: tNav("services"), href: "/#services", id: "#services" },
                                { name: tNav("selected_works"), href: "/projects", id: "#projects" },
                                { name: tNav("contact"), href: "/#contact", id: "#contact" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={(e) => {
                                            if (item.id.startsWith('#')) handleScroll(e, item.id);
                                            else setIsOpen(false);
                                        }}
                                        className="text-3xl font-black tracking-tight uppercase text-gray-900 dark:text-white hover:text-blue-500 transition-colors block"
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="mt-12 pt-12 border-t border-gray-100 dark:border-white/5 relative z-10"
                        >
                            <CVButton variant="full" onPick={() => setIsOpen(false)} />

                            <div className="flex items-center gap-6 mt-10">
                                <Link href="https://github.com" className="text-gray-400 hover:text-blue-500 transition-colors">Github</Link>
                                <Link href="https://linkedin.com" className="text-gray-400 hover:text-blue-500 transition-colors">LinkedIn</Link>
                                <Link href="https://instagram.com" className="text-gray-400 hover:text-blue-500 transition-colors">Instagram</Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
