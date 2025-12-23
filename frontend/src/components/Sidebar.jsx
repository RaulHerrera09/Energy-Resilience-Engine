import React from 'react';
import { LayoutDashboard, Zap, ShieldAlert, BarChart3, Globe } from 'lucide-react';


const Sidebar = ({ selectedCountry, onCountryChange, activeView, onViewChange }) => {
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Regional Analysis', icon: <Globe size={20} /> },
        { name: 'Generation Mix', icon: <Zap size={20} /> },
        { name: 'Resilience Stats', icon: <ShieldAlert size={20} /> },
    ];


    const countries = [
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'ES', name: 'Spain' },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
            <div className="p-6">
                <div className="flex items-center gap-2 text-grid-green">
                    <BarChart3 className="text-grid-green" size={28} />
                    <h1 className="text-xl font-bold tracking-tight text-white">EnergyEngine</h1>
                </div>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">EU Grid Monitor</p>
            </div>

            <nav className="flex-1 px-4 space-y-8">
                {/* 1. */}
                <div className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}

                            onClick={() => onViewChange(item.name)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.name
                                    ? 'bg-energy-blue text-white shadow-lg shadow-blue-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            {item.icon} <span className="font-medium">{item.name}</span>
                        </button>
                    ))}
                </div>

                {/* 2. */}
                <div className="space-y-2">
                    <p className="px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Active Markets</p>
                    {countries.map((c) => (
                        <button
                            key={c.code}
                            onClick={() => onCountryChange(c.code)}
                            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all ${selectedCountry === c.code
                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs opacity-50">{c.code}</span>
                                <span>{c.name}</span>
                            </div>
                            {/* 3. */}
                            {selectedCountry === c.code && (
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
