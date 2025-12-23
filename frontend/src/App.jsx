import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { AlertTriangle, Activity, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import GenerationMixChart from './components/GenerationMixChart';

function App() {
  const [energyData, setEnergyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('DE');
  const [activeView, setActiveView] = useState('Dashboard');

  const countryNames = {
    'DE': 'Germany',
    'FR': 'France',
    'ES': 'Spain',
    'GB': 'United Kingdom'
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/energy-data/?country=${selectedCountry}`)
      .then(res => res.json())
      .then(data => {
        setEnergyData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Data pipeline connection failed:", err);
        setLoading(false);
      });
  }, [selectedCountry]);


  const processedStats = useMemo(() => {
    if (energyData.length === 0) return { totalGW: "0.0", renewPercent: 0, mae: "0.0", resources: [], chartData: [], allResources: [], resilienceScore: 0, alerts: [] };

    const totalMW = energyData.reduce((acc, curr) => acc + (curr.actual_generation_mw || 0), 0);

    // 1. 
    const validForecasts = energyData.filter(d => d.forecast_generation_mw !== null);
    const maeSum = validForecasts.reduce((acc, curr) =>
      acc + Math.abs(curr.actual_generation_mw - curr.forecast_generation_mw), 0);
    const mae = validForecasts.length > 0 ? (maeSum / validForecasts.length).toFixed(1) : "0.0";

    const renewKeywords = ['Wind', 'Solar', 'Hydro', 'Biomass', 'Geothermal'];
    const renewMW = energyData
      .filter(d => renewKeywords.some(key => d.resource_type.includes(key)))
      .reduce((acc, curr) => acc + (curr.actual_generation_mw || 0), 0);
    const renewPercent = totalMW > 0 ? (renewMW / totalMW) * 100 : 0;

    // 2. 
    const resourceMap = energyData.reduce((acc, curr) => {
      acc[curr.resource_type] = (acc[curr.resource_type] || 0) + (curr.actual_generation_mw || 0);
      return acc;
    }, {});

    const allResources = Object.entries(resourceMap)
      .map(([name, mw]) => ({
        name,
        gw: (mw / 1000).toFixed(2),
        percentage: totalMW > 0 ? ((mw / totalMW) * 100).toFixed(1) : "0",
        rawMW: mw
      }))
      .sort((a, b) => b.rawMW - a.rawMW);

    // 3. 
    const activeTypes = allResources.filter(r => r.rawMW > 0).length;
    const resilienceScore = Math.min(100, Math.max(0, (activeTypes * 8) + (renewPercent * 0.4))).toFixed(0);

    const alerts = [];
    if (renewPercent < 25) alerts.push({ id: 1, type: 'warning', title: 'Low Green Energy', desc: 'Renewable share is below safety threshold.' });
    if (activeTypes < 4) alerts.push({ id: 2, type: 'critical', title: 'Diversity Risk', desc: 'Few energy sources active. High grid vulnerability.' });

    return {
      totalGW: (totalMW / 1000).toFixed(1),
      renewPercent: renewPercent.toFixed(0),
      mae,
      resources: allResources.slice(0, 5).map(r => [r.name, r.rawMW]),
      chartData: allResources.slice(0, 5).map(r => ({ name: r.name, value: parseFloat(r.gw) })),
      allResources,
      resilienceScore,
      activeTypes,
      alerts
    };
  }, [energyData]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">European Grid Overview</h2>
            <p className="text-slate-400 mt-1">Real-time monitoring and resilience analysis.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-full flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <span className="text-sm font-medium text-slate-300 italic">
              {loading ? 'Awaiting ENTSO-E Feed...' : `Live: ${countryNames[selectedCountry] || selectedCountry} Network`}
            </span>
          </div>
        </header>

        {/*  */}
        {activeView === 'Dashboard' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard title="Total Generation" value={processedStats.totalGW} unit="GW" trend="+2.4%" color="text-emerald-400" />
              <StatCard title="Renewable Share" value={processedStats.renewPercent} unit="%" trend="+5%" color="text-sky-400" />
              <StatCard title="Forecast Error (MAE)" value={processedStats.mae} unit="MW" trend="Stable" color="text-slate-400" />
              <StatCard title="Carbon Intensity" value="240" unit="g/kWh" trend="-12%" color="text-emerald-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-6">Generation Timeline (MW)</h3>
                <div className="h-80"><GenerationMixChart data={energyData} /></div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-6">Top Resource Mix</h3>
                <div className="space-y-6">
                  {processedStats.resources.map(([name, val]) => (
                    <div key={name} className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{name}</span>
                        <span className="font-mono text-emerald-500">{(val / 1000).toFixed(1)} GW</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(val / (parseFloat(processedStats.totalGW) * 1000)) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : activeView === 'Regional Analysis' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Resource Magnitude (GW)</h3>
              <div className="h-80">
                <ResponsiveContainer><BarChart data={processedStats.chartData}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} /><XAxis dataKey="name" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} /><Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Generation Share (%)</h3>
              <div className="h-80">
                <ResponsiveContainer><PieChart><Pie data={processedStats.chartData} innerRadius={80} outerRadius={100} paddingAngle={8} dataKey="value">{processedStats.chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} /><Legend /></PieChart></ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : activeView === 'Generation Mix' ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                <tr><th className="px-6 py-4">Resource</th><th className="px-6 py-4">Output (GW)</th><th className="px-6 py-4">Grid Share</th><th className="px-6 py-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {processedStats.allResources.map(res => (
                  <tr key={res.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{res.name}</td>
                    <td className="px-6 py-4 font-mono text-emerald-400">{res.gw} GW</td>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-sky-500 h-full" style={{ width: `${res.percentage}%` }}></div></div><span>{res.percentage}%</span></div></td>
                    <td className="px-6 py-4"><span className="flex items-center gap-2 text-xs text-slate-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Operational</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeView === 'Resilience Stats' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90"><circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="8" fill="transparent" /><circle cx="80" cy="80" r="70" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * processedStats.resilienceScore) / 100} className="transition-all duration-1000" /></svg>
                <span className="absolute text-4xl font-black">{processedStats.resilienceScore}%</span>
              </div>
              <h3 className="text-xl font-bold">Resilience Score</h3>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {processedStats.alerts.length > 0 ? processedStats.alerts.map(a => (
                <div key={a.id} className={`p-6 rounded-2xl border flex gap-4 ${a.type === 'critical' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                  <AlertTriangle className={a.type === 'critical' ? 'text-rose-500' : 'text-amber-500'} />
                  <div><h4 className="font-bold">{a.title}</h4><p className="text-sm opacity-70">{a.desc}</p></div>
                </div>
              )) : (
                <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                  <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={48} />
                  <h4 className="text-lg font-bold text-emerald-500">Grid is Stable</h4>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;