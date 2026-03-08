"use client";

import { useEffect, useState } from "react";
import { projectsService, Project, ProjectStatus } from "@/features/admin/api/projects.service";
import { usersService } from "@/features/admin/api/users.service";
import {
    Briefcase,
    Edit2,
    Save,
    X,
    Search,
    Plus,
    Trash2,
    Calendar,
    ExternalLink,
    Clock,
    UserCircle,
    CheckCircle2,
    Shield,
    Users as UsersIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [statuses, setStatuses] = useState<ProjectStatus[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState<Partial<Project>>({
        title: "",
        description: "",
        status_id: "",
        member_ids: []
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        loadData();
    }, [currentPage, searchQuery]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [projectsData, statusesData, usersData] = await Promise.all([
                projectsService.getAll({
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    search: searchQuery
                }),
                projectsService.getStatuses(),
                usersService.getAll()
            ]);
            setProjects(projectsData.items);
            setTotalPages(projectsData.meta.totalPages);
            setTotalItems(projectsData.meta.total);
            setStatuses(statusesData);
            setUsers(usersData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.project_id);
        setForm({
            ...project,
            member_ids: project.members?.map(m => m.user.user_id) || []
        });
    };

    const handleSave = async (id: string) => {
        try {
            const updated = await projectsService.update(id, form);
            setProjects(projects.map(p => p.project_id === id ? updated : p));
            setEditingId(null);
            setForm({});
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async () => {
        try {
            const created = await projectsService.create(form);
            setProjects([created, ...projects]);
            setIsAdding(false);
            setForm({ title: "", description: "", status_id: "", member_ids: [] });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await projectsService.delete(id);
            setProjects(projects.filter(p => p.project_id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleMember = (userId: string) => {
        const currentIds = form.member_ids || [];
        if (currentIds.includes(userId)) {
            setForm({ ...form, member_ids: currentIds.filter(id => id !== userId) });
        } else {
            setForm({ ...form, member_ids: [...currentIds, userId] });
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <Briefcase className="text-blue-500" />
                        </motion.div>
                        PROJECT ARCHITECTURE
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium italic">Manage lifecycle, statuses and responsible entities.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group w-64 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Scan archives..."
                            className="w-full bg-[#0a0a14] border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-blue-500/50 transition-all text-sm placeholder:text-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsAdding(true);
                            setForm({ title: "", description: "", status_id: statuses[0]?.status_id || "", member_ids: [] });
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        <span className="hidden sm:inline font-bold uppercase text-[10px] tracking-widest">Construct New</span>
                    </button>
                </div>
            </div>

            {/* Add / Edit Form Modal-like UI */}
            <AnimatePresence>
                {(isAdding || editingId) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0a0a14] border border-blue-500/30 rounded-[2rem] p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative"
                        >
                            <button
                                onClick={() => { setIsAdding(false); setEditingId(null); setForm({}); }}
                                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter uppercase">
                                        {editingId ? "Modify Protocol" : "Initialize System Entry"}
                                    </h2>
                                    <p className="text-gray-500 text-xs font-mono uppercase tracking-[0.2em]">Matrix Sector: Portfolio / Projects</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-2">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full" /> Project Title
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm font-bold"
                                            placeholder="Nexus Core Engine..."
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-2">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full" /> Technical Description
                                        </label>
                                        <textarea
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm resize-none h-40 leading-relaxed"
                                            placeholder="Detailed breakdown of architecture and tech stack..."
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-2">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full" /> Status Matrix
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {statuses.map(status => (
                                                <button
                                                    key={status.status_id}
                                                    onClick={() => setForm({ ...form, status_id: status.status_id })}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${form.status_id === status.status_id
                                                        ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                                                        : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20"
                                                        }`}
                                                >
                                                    {status.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 flex flex-col h-full">
                                    <div className="space-y-2 flex-grow">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-2">
                                            <UsersIcon size={12} className="text-blue-500" /> Assign Responsible Entities
                                        </label>
                                        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                                            {users.map(user => {
                                                const isSelected = form.member_ids?.includes(user.user_id);
                                                return (
                                                    <button
                                                        key={user.user_id}
                                                        onClick={() => toggleMember(user.user_id)}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${isSelected
                                                            ? "bg-blue-500/10 border-blue-500/50 text-white"
                                                            : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                                                            }`}
                                                    >
                                                        {user.picture ? (
                                                            <img src={user.picture} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold">
                                                                {user.name?.[0]?.toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className="flex-grow text-left">
                                                            <p className="text-xs font-bold leading-none capitalize">{user.name}</p>
                                                            <p className="text-[10px] text-gray-500 mt-1">{user.email}</p>
                                                        </div>
                                                        {isSelected && <CheckCircle2 size={16} className="text-blue-500" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4">
                                        <button
                                            onClick={() => { setIsAdding(false); setEditingId(null); setForm({}); }}
                                            className="px-8 py-4 rounded-2xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all font-bold uppercase text-[10px] tracking-widest active:scale-95"
                                        >
                                            Abort Operation
                                        </button>
                                        <button
                                            onClick={editingId ? () => handleSave(editingId) : handleCreate}
                                            className="px-10 py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition-all font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/30 active:scale-95 flex items-center gap-3"
                                        >
                                            <Save size={18} />
                                            {editingId ? "Commit Changes" : "Initialize Build"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Projects Matrix Display */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 text-center">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Clock size={20} className="text-blue-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-blue-500 font-black text-sm uppercase tracking-[0.4em] animate-pulse">Synchronizing Archives</p>
                            <p className="text-gray-600 text-[10px] font-mono mt-2 uppercase">Please wait for system handshake...</p>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {projects.map((project) => (
                            <motion.div
                                key={project.project_id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-[2.5rem] -m-1 group-hover:m-0 transition-all duration-500 opacity-0 group-hover:opacity-100" />

                                <div className="relative bg-[#0a0a14] border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 h-full flex flex-col">
                                    <div className="flex items-start justify-between gap-6 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-3xl bg-blue-500/5 flex items-center justify-center text-blue-500 border border-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-inner">
                                                <Briefcase size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black tracking-tighter group-hover:text-blue-400 transition-colors uppercase leading-tight max-w-[200px] truncate">
                                                    {project.title}
                                                </h3>
                                                {project.status && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.status.color }} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: project.status.color }}>
                                                            {project.status.name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform active:scale-90"
                                                title="Modify Entry"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.project_id)}
                                                className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:bg-red-600 hover:text-white transition-all transform active:scale-90"
                                                title="Purge Entry"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 font-medium italic">
                                            {project.description || "Experimental architecture. Technical specifics classified."}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex -space-x-3 overflow-hidden">
                                            {project.members && project.members.length > 0 ? (
                                                project.members.map((member: any) => (
                                                    <div key={member.user.user_id} className="inline-block relative group/user" title={member.user.name}>
                                                        {member.user.picture ? (
                                                            <img
                                                                className="h-10 w-10 rounded-2xl ring-4 ring-[#0a0a14] object-cover group-hover/user:scale-110 transition-transform cursor-pointer"
                                                                src={member.user.picture}
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 ring-4 ring-[#0a0a14] flex items-center justify-center text-indigo-400 text-xs font-bold font-mono group-hover/user:bg-indigo-500 group-hover/user:text-white transition-all cursor-pointer">
                                                                {member.user.name?.[0]?.toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <UserCircle size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Unassigned</span>
                                                </div>
                                            )}
                                            {project.members && project.members.length > 3 && (
                                                <div className="h-10 w-10 rounded-2xl bg-[#141420] ring-4 ring-[#0a0a14] flex items-center justify-center text-[10px] font-black text-gray-400">
                                                    +{project.members.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar size={12} />
                                                <span className="text-[10px] font-mono uppercase tracking-tighter">
                                                    {new Date(project.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-blue-500/50">
                                                <Clock size={10} />
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Live Sync</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={`p-4 rounded-2xl border border-white/5 transition-all ${currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-600 hover:border-blue-500 hover:text-white group"
                            }`}
                    >
                        <motion.div whileHover={{ x: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                            <X className="rotate-90" size={18} /> {/* Using custom icon for back */}
                            <span className="sr-only">Previous</span>
                        </motion.div>
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-12 h-12 rounded-2xl border transition-all font-black text-xs ${currentPage === i + 1
                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110"
                                    : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20"
                                    }`}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={`p-4 rounded-2xl border border-white/5 transition-all ${currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-600 hover:border-blue-500 hover:text-white group"
                            }`}
                    >
                        <motion.div whileHover={{ x: 2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                            <ExternalLink className="-rotate-180" size={18} /> {/* Using custom icon for next */}
                            <span className="sr-only">Next</span>
                        </motion.div>
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && projects.length === 0 && (
                <div className="text-center py-40 bg-[#0a0a14] border border-dashed border-white/5 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:border-blue-500/30 transition-colors"
                    >
                        <Plus className="text-gray-400 group-hover:text-blue-500 transition-colors" size={40} />
                    </motion.div>
                    <p className="text-gray-400 font-black text-sm uppercase tracking-[0.4em]">The Grid is Empty</p>
                    <p className="text-gray-600 font-mono text-[10px] mt-4 uppercase tracking-widest">Awaiting initialization of new architectural constructs.</p>
                </div>
            )}
        </div>
    );
}
