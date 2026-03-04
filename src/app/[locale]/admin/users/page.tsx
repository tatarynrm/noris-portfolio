"use client";

import { useEffect, useState } from "react";
import { usersService } from "@/features/admin/api/users.service";
import {
    Users,
    Edit2,
    Save,
    X,
    Search,
    UserPlus,
    Shield,
    Mail,
    Calendar,
    MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await usersService.getAll();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: any) => {
        setEditingId(user.user_id);
        setEditForm({ ...user });
    };

    const handleSave = async (userId: string) => {
        try {
            await usersService.update(userId, editForm);
            setUsers(users.map(u => u.user_id === userId ? { ...u, ...editForm } : u));
            setEditingId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                        <Users className="text-blue-500" />
                        USER MANAGEMENT
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage system access, roles and user profiles.</p>
                </div>

                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-[#0a0a14] border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-blue-500/50 transition-all text-sm placeholder:text-gray-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table / List */}
            <div className="bg-[#0a0a14] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Retrieving Matrix Data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">User</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Role</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Registered</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode='popLayout'>
                                    {filteredUsers.map((user) => (
                                        <motion.tr
                                            key={user.user_id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        {user.picture ? (
                                                            <img src={user.picture} alt="" className="w-12 h-12 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform duration-300" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                                                                {user.name?.[0]?.toUpperCase() || 'U'}
                                                            </div>
                                                        )}
                                                        {user.role === 'admin' && (
                                                            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-[#0a0a14]">
                                                                <Shield size={8} className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {editingId === user.user_id ? (
                                                            <input
                                                                type="text"
                                                                className="bg-black/50 border border-blue-500/30 rounded px-2 py-1 text-sm focus:outline-none w-full"
                                                                value={editForm.name}
                                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                            />
                                                        ) : (
                                                            <p className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-none mb-1.5">
                                                                {user.name || 'Anonymous'}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                            <Mail size={12} />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm">
                                                {editingId === user.user_id ? (
                                                    <select
                                                        className="bg-black/50 border border-blue-500/30 rounded px-2 py-1 text-sm focus:outline-none"
                                                        value={editForm.role}
                                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                    >
                                                        <option value="user">USER</option>
                                                        <option value="admin">ADMIN</option>
                                                    </select>
                                                ) : (
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${user.role === 'admin'
                                                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                            : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Active</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
                                                        <Calendar size={12} className="text-gray-600" />
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {editingId === user.user_id ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleSave(user.user_id)}
                                                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all transform active:scale-95"
                                                            title="Save Changes"
                                                        >
                                                            <Save size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all transform active:scale-95"
                                                            title="Cancel"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 group-hover:bg-white/10"
                                                        title="Edit User"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {!loading && filteredUsers.length === 0 && (
                <div className="text-center py-20 bg-[#0a0a14] border border-dashed border-white/10 rounded-3xl">
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No users found in current grid sector.</p>
                </div>
            )}
        </div>
    );
}
