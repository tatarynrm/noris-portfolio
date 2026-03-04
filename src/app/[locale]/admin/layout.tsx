"use client";

import { useUser } from "@/features/auth/hooks/useAuth";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import {
    LayoutDashboard,
    Languages,
    Users,
    Briefcase,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Search,
    ChevronDown
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import authApi from "@/shared/api/axios.instance";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
    title: string;
    link: string;
    icon?: string;
    children?: MenuItem[];
}

const iconMap: Record<string, any> = {
    LayoutDashboard: <LayoutDashboard size={18} />,
    Languages: <Languages size={18} />,
    Users: <Users size={18} />,
    Briefcase: <Briefcase size={18} />,
};

function NavItem({
    item,
    isSidebarOpen,
    depth = 0,
    searchQuery = ""
}: {
    item: MenuItem;
    isSidebarOpen: boolean;
    depth?: number;
    searchQuery?: string;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    const shouldShow = useMemo(() => {
        if (!searchQuery) return true;
        const matchesCurrent = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesChildren = item.children?.some(child =>
            child.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesCurrent || matchesChildren;
    }, [item, searchQuery]);

    if (!shouldShow) return null;

    return (
        <div className="w-full">
            <div className="relative group">
                {hasChildren ? (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-white/5 ${isExpanded ? "text-blue-400 bg-blue-500/5" : "text-gray-400"
                            }`}
                        style={{ paddingLeft: isSidebarOpen ? `${(depth * 12) + 12}px` : 'auto' }}
                    >
                        <div className="flex-shrink-0">
                            {iconMap[item.icon || ""] || <ChevronRight size={18} />}
                        </div>
                        {isSidebarOpen && (
                            <>
                                <span className="flex-grow text-left font-medium text-sm tracking-tight">{item.title}</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </>
                        )}
                    </button>
                ) : (
                    <Link
                        href={item.link as any}
                        className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-blue-500/10 hover:text-blue-400 group text-gray-400"
                        style={{ paddingLeft: isSidebarOpen ? `${(depth * 12) + 12}px` : 'auto' }}
                    >
                        <div className="flex-shrink-0 group-hover:text-blue-400">
                            {iconMap[item.icon || ""] || <ChevronRight size={18} />}
                        </div>
                        {isSidebarOpen && (
                            <span className="font-medium text-sm tracking-tight whitespace-nowrap">{item.title}</span>
                        )}
                        {!isSidebarOpen && (
                            <div className="absolute left-full ml-4 px-2 py-1 bg-blue-500 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] font-black uppercase tracking-widest">
                                {item.title}
                            </div>
                        )}
                    </Link>
                )}
            </div>

            {hasChildren && isExpanded && isSidebarOpen && (
                <div className="mt-1 space-y-1">
                    {item.children?.map((child, idx) => (
                        <NavItem
                            key={idx}
                            item={child}
                            isSidebarOpen={isSidebarOpen}
                            depth={depth + 1}
                            searchQuery={searchQuery}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user, isLoading } = useUser();
    const router = useRouter();
    const logout = useLogout();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: menuItems, isLoading: isMenuLoading } = useQuery<MenuItem[]>({
        queryKey: ["admin", "menu"],
        queryFn: async () => {
            const res = await authApi.get("/admin/menu");
            return res.data;
        },
    });

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "admin")) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    if (isLoading || isMenuLoading || !user || user.role !== "admin") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
                {(isSidebarOpen || isMobileOpen) && (
                    <span className="font-black tracking-tighter text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                        NORIS.ADMIN
                    </span>
                )}
                <button
                    onClick={() => isMobileOpen ? setIsMobileOpen(false) : setSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors lg:block hidden"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors lg:hidden block"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="px-4 pt-6 pb-2">
                <div className="relative group">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-blue-500 ${!isSidebarOpen && !isMobileOpen ? 'hidden' : ''}`} size={14} />
                    <input
                        type="text"
                        placeholder="Search menu..."
                        className={`w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500/50 transition-all ${!isSidebarOpen && !isMobileOpen ? 'opacity-0 pointer-events-none' : ''}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {!isSidebarOpen && !isMobileOpen && (
                        <div className="flex justify-center p-2 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer" onClick={() => setSidebarOpen(true)}>
                            <Search size={18} />
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-grow py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems?.map((item, idx) => (
                    <NavItem
                        key={idx}
                        item={item}
                        isSidebarOpen={isSidebarOpen || isMobileOpen}
                        searchQuery={searchQuery}
                    />
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/20">
                <button
                    onClick={() => {
                        logout();
                        router.push("/");
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group ${!isSidebarOpen && !isMobileOpen ? 'justify-center' : ''}`}
                >
                    <LogOut size={18} className="text-gray-400 group-hover:text-red-400" />
                    {(isSidebarOpen || isMobileOpen) && <span className="font-bold text-sm tracking-tight uppercase">Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#05050a] text-white flex">
            {/* Desktop Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#0a0a14] border-r border-white/5 transition-all duration-300 hidden lg:flex flex-col z-50`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-[#0a0a14] border-r border-white/5 z-[70] lg:hidden"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-grow flex flex-col overflow-hidden min-w-0">
                <header className="h-20 bg-[#0a0a14]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors lg:hidden block text-gray-400"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            <span>Admin</span>
                            <ChevronRight size={10} />
                            <span className="text-blue-500">System</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-white leading-none uppercase tracking-tighter">{user.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1 font-mono uppercase">{user.role}</p>
                        </div>
                        {user.picture ? (
                            <img src={user.picture} alt="" className="w-9 h-9 rounded-xl border border-white/10 object-cover" />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                                {user.name?.[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto p-6 lg:p-10 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent">
                    {children}
                </div>
            </main>
        </div>
    );
}
