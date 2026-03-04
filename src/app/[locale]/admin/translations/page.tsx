"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authApi from "@/shared/api/axios.instance";
import { useState, useMemo, useRef } from "react";
import { Search, Plus, Edit2, Save, X, Globe, ChevronLeft, ChevronRight, Check, Download, Upload, Loader2, AlertCircle, Layers } from "lucide-react";

interface Translation {
    translation_id: string;
    locale: string;
    key: string;
    value: string;
    namespace: string | null;
}

const LOCALES = ["en", "uk", "pl", "fr", "de", "nl"];

// Helper to nest flat keys (e.g., "auth.login.title") into an object
const nestKeys = (data: Record<string, string>) => {
    const result: any = {};
    for (const key in data) {
        const keys = key.split('.');
        let current = result;
        for (let i = 0; i < keys.length; i++) {
            const part = keys[i];
            if (i === keys.length - 1) {
                current[part] = data[key];
            } else {
                current[part] = current[part] || {};
                current = current[part];
            }
        }
    }
    return result;
};

// Helper to flatten nested object into dot-notation keys
const flattenObject = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc: any, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
};

interface ImportLog {
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: Date;
}

export default function AdminTranslations() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [newKey, setNewKey] = useState("");
    const [newValues, setNewValues] = useState<Record<string, string>>(
        LOCALES.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {})
    );

    const handleOpenModal = (key?: string) => {
        if (key) {
            setIsEditingMode(true);
            setNewKey(key);
            const existing = translations?.filter(t => t.key === key) || [];
            const values = LOCALES.reduce((acc, lang) => {
                const found = existing.find(t => t.locale === lang);
                return { ...acc, [lang]: found ? found.value : "" };
            }, {});
            setNewValues(values);
        } else {
            setIsEditingMode(false);
            setNewKey("");
            setNewValues(LOCALES.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}));
        }
        setIsModalOpen(true);
    };

    // Import State
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0, file: "" });
    const [importLogs, setImportLogs] = useState<ImportLog[]>([]);

    const { data: translations, isLoading } = useQuery<Translation[]>({
        queryKey: ["admin", "translations"],
        queryFn: async () => {
            const res = await authApi.get("/admin/translations");
            return res.data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, value }: { id: string; value: string }) => {
            const translation = translations?.find(t => t.translation_id === id);
            if (!translation) return;
            return authApi.post("/translations/upsert", {
                locale: translation.locale,
                key: translation.key,
                value,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "translations"] });
            setEditingId(null);
        },
    });

    const batchAddMutation = useMutation({
        mutationFn: async () => {
            const promises = Object.entries(newValues)
                .filter(([_, val]) => val.trim() !== "")
                .map(([lang, val]) =>
                    authApi.post("/translations/upsert", {
                        locale: lang,
                        key: newKey,
                        value: val,
                    })
                );
            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "translations"] });
            setIsModalOpen(false);
            setNewKey("");
            setNewValues(LOCALES.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}));
        },
    });

    const filteredTranslations = useMemo(() => {
        if (!translations) return [];
        return translations.filter(
            (t) =>
                t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [translations, searchTerm]);

    // Export Logic
    const handleExport = (locale: string) => {
        if (!translations) return;
        const localeData = translations
            .filter(t => t.locale === locale)
            .reduce((acc, t) => ({ ...acc, [t.key]: t.value }), {});

        const nestedData = nestKeys(localeData);
        const blob = new Blob([JSON.stringify(nestedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${locale}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Import Logic
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsImporting(true);
        setImportLogs([{ type: 'info', message: `Starting import of ${files.length} file(s)...`, timestamp: new Date() }]);

        let totalKeys = 0;
        const tasks: { locale: string, key: string, value: string }[] = [];

        // 1. Read files and parse
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const locale = file.name.split('.')[0];
            if (!LOCALES.includes(locale)) {
                setImportLogs(prev => [...prev, { type: 'error', message: `Skipping ${file.name}: invalid locale name.`, timestamp: new Date() }]);
                continue;
            }

            try {
                const text = await file.text();
                const json = JSON.parse(text);
                const flat = flattenObject(json);
                Object.entries(flat).forEach(([key, value]) => {
                    tasks.push({ locale, key, value: String(value) });
                });
                setImportLogs(prev => [...prev, { type: 'success', message: `Parsed ${file.name} (${Object.keys(flat).length} keys)`, timestamp: new Date() }]);
            } catch (err) {
                setImportLogs(prev => [...prev, { type: 'error', message: `Failed to parse ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`, timestamp: new Date() }]);
            }
        }

        totalKeys = tasks.length;
        setImportProgress({ current: 0, total: totalKeys, file: "Processing keys..." });

        // 2. Sequential Upload
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            setImportProgress(prev => ({ ...prev, current: i + 1, file: `Updating [${task.locale}] ${task.key}` }));

            try {
                await authApi.post("/translations/upsert", {
                    locale: task.locale,
                    key: task.key,
                    value: task.value,
                });
            } catch (err) {
                setImportLogs(prev => [...prev, { type: 'error', message: `Error updating ${task.key} (${task.locale}): ${err instanceof Error ? err.message : 'Upload failed'}`, timestamp: new Date() }]);
            }
        }

        setImportLogs(prev => [...prev, { type: 'info', message: "Import completed!", timestamp: new Date() }]);
        queryClient.invalidateQueries({ queryKey: ["admin", "translations"] });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Pagination Logic
    const totalItems = filteredTranslations.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedTranslations = filteredTranslations.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">Translations</h1>
                    <p className="text-gray-500 mt-1">Manage all localized strings across the platform ({totalItems} total).</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <input
                        type="file"
                        multiple
                        accept=".json"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImport}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl font-bold transition-all"
                    >
                        <Upload size={18} /> Import JSON
                    </button>
                    <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                        {LOCALES.map(loc => (
                            <button
                                key={loc}
                                onClick={() => handleExport(loc)}
                                title={`Export ${loc}.json`}
                                className="px-3 py-1 hover:bg-white/10 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-1"
                            >
                                <Download size={14} /> {loc}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={20} /> Add New
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search by key or value..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to page 1 on search
                    }}
                    className="w-full bg-[#0a0a14] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 outline-none transition-colors"
                />
            </div>

            <div className="bg-[#0a0a14] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Locale</th>
                                <th className="px-6 py-4">Key</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(() => {
                                const keyCounts = translations?.reduce((acc: Record<string, number>, t) => {
                                    acc[t.key] = (acc[t.key] || 0) + 1;
                                    return acc;
                                }, {}) || {};

                                return paginatedTranslations.map((t) => (
                                    <tr key={t.translation_id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2 w-fit px-3 py-1 bg-gray-500/10 text-gray-400 rounded-lg text-xs font-bold uppercase">
                                                <Globe size={12} /> {t.locale}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-sm text-blue-400 font-mono bg-blue-500/5 px-2 py-1 rounded">
                                                {t.key}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            {editingId === t.translation_id ? (
                                                <textarea
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg p-2 text-sm focus:border-blue-500 outline-none min-h-[80px]"
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-300 line-clamp-2">{t.value}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {editingId === t.translation_id ? (
                                                    <>
                                                        <button
                                                            onClick={() => updateMutation.mutate({ id: t.translation_id, value: editValue })}
                                                            className="p-2 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg transition-colors"
                                                        >
                                                            <Save size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {keyCounts[t.key] < 3 && (
                                                            <button
                                                                onClick={() => handleOpenModal(t.key)}
                                                                title="Edit all locales"
                                                                className="opacity-0 group-hover:opacity-100 p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all flex items-center gap-1 text-xs font-bold"
                                                            >
                                                                <Layers size={16} /> Edit All
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(t.translation_id);
                                                                setEditValue(t.value);
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-lg transition-all"
                                                        >
                                                            <Edit2 size={18} className="text-gray-500" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ));
                            })()}
                            {paginatedTranslations.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-gray-600">
                                        No translations found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .map((p, i, arr) => (
                                        <div key={p} className="flex items-center">
                                            {i > 0 && arr[i - 1] !== p - 1 && <span className="text-gray-600 mx-1">...</span>}
                                            <button
                                                onClick={() => setCurrentPage(p)}
                                                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === p
                                                    ? "bg-blue-500 text-white"
                                                    : "hover:bg-white/5 text-gray-500"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Import Progress Modal */}
            {isImporting && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                    <div className="relative bg-[#0d0d1a] border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <Loader2 className="animate-spin text-blue-500" size={24} />
                                <h2 className="text-xl font-bold tracking-tight">Syncing Translations</h2>
                            </div>
                            {importProgress.current === importProgress.total && (
                                <button
                                    onClick={() => setIsImporting(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Overall Progress</p>
                                        <p className="text-sm font-mono text-blue-400">{importProgress.current} / {importProgress.total} keys</p>
                                    </div>
                                    <span className="text-2xl font-black">{Math.round((importProgress.current / (importProgress.total || 1)) * 100)}%</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                        style={{ width: `${(importProgress.current / (importProgress.total || 1)) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 font-mono truncate bg-black/40 p-2 rounded-lg border border-white/5">
                                    {importProgress.file}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Activity Log</p>
                                <div className="bg-black/60 rounded-2xl border border-white/5 p-4 h-48 overflow-y-auto custom-scrollbar space-y-2 font-mono text-[11px]">
                                    {importLogs.map((log, i) => (
                                        <div key={i} className={`flex gap-3 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-gray-400'}`}>
                                            <span className="opacity-30">{log.timestamp.toLocaleTimeString([], { hour12: false })}</span>
                                            <span className="flex-1">{log.message}</span>
                                        </div>
                                    ))}
                                    {importLogs.length === 0 && <p className="text-gray-600 italic">Initializing...</p>}
                                </div>
                            </div>
                        </div>

                        {importProgress.current === importProgress.total && (
                            <div className="px-8 py-6 border-t border-white/5 flex justify-end bg-white/[0.02]">
                                <button
                                    onClick={() => setIsImporting(false)}
                                    className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Translation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative bg-[#0a0a14] border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h2 className="text-xl font-bold tracking-tight">
                                {isEditingMode ? `Edit Key: ${newKey}` : "Add New Translation"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {!isEditingMode && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                        Translation Key
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Hero.welcome_title"
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-blue-500/50 outline-none transition-all font-mono text-blue-400"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {LOCALES.map((lang) => (
                                    <div key={lang}>
                                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                            <span className="w-8 h-5 bg-gray-500/10 flex items-center justify-center rounded text-[10px] text-gray-400">
                                                {lang.toUpperCase()}
                                            </span>
                                            {lang === 'en' ? 'English' : lang === 'uk' ? 'Ukrainian' : lang === 'pl' ? 'Polish' : lang === 'fr' ? 'French' : lang === 'de' ? 'German' : 'Dutch'}
                                        </label>
                                        <textarea
                                            placeholder={`Enter ${lang} translation...`}
                                            value={newValues[lang]}
                                            onChange={(e) => setNewValues({ ...newValues, [lang]: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500/50 outline-none transition-all min-h-[60px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-8 py-6 border-t border-white/5 flex justify-end gap-3 bg-white/[0.02]">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 rounded-xl font-bold hover:bg-white/5 transition-colors"
                                disabled={batchAddMutation.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => batchAddMutation.mutate()}
                                disabled={!newKey || Object.values(newValues).every(v => v.trim() === "") || batchAddMutation.isPending}
                                className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {batchAddMutation.isPending ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Check size={20} />
                                )}
                                {isEditingMode ? "Update All" : "Save All"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
