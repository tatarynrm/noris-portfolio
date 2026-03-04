"use client";

import { useUser } from "@/features/auth/hooks/useAuth";

export default function AdminDashboard() {
    const { data: user } = useUser();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black tracking-tighter">
                    Welcome back, <span className="text-blue-500">{user?.name}</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    Here&apos;s a quick overview of your portfolio performance and status.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Projects', value: '12', trend: '+2 this month', color: 'from-blue-500 to-indigo-500' },
                    { label: 'Total Translations', value: '482', trend: '5 languages', color: 'from-purple-500 to-pink-500' },
                    { label: 'Active Users', value: '24', trend: 'Administrators only', color: 'from-orange-500 to-red-500' },
                    { label: 'System Health', value: '100%', trend: 'Operational', color: 'from-green-500 to-emerald-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0a0a14] border border-white/5 p-6 rounded-3xl shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-4xl font-black mt-2 tracking-tighter">{stat.value}</h3>
                        <p className="text-xs text-gray-400 mt-2">{stat.trend}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0a0a14] border border-white/5 p-8 rounded-[40px] shadow-2xl h-[400px] flex items-center justify-center">
                    <p className="text-gray-600 font-medium italic underline decoration-blue-500/50 underline-offset-8">Activity Graph Placeholder</p>
                </div>
                <div className="bg-[#0a0a14] border border-white/5 p-8 rounded-[40px] shadow-2xl h-[400px]">
                    <h3 className="text-xl font-bold mb-6">Recent Translations</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                                        <span className="font-bold text-xs">EN</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Experience.title_1</p>
                                        <p className="text-xs text-gray-500">2 hours ago</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-gray-600">Updated</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
