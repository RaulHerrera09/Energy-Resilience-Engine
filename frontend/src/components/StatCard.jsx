import React from 'react';

const StatCard = ({ title, value, unit, trend, color }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className="text-slate-500 font-medium">{unit}</span>
        </div>
        <div className={`mt-2 text-xs font-semibold ${color}`}>
            {trend} vs last hour
        </div>
    </div>
);

export default StatCard;