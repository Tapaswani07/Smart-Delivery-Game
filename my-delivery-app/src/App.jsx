import React, { useState } from 'react';
import { 
  Bike, Home, Settings, RotateCcw, 
  Sun, Moon, Zap, Navigation, Clock, Activity, Ruler
} from 'lucide-react';

const API_BASE = "http://127.0.0.1:5000";

const NODES = [
  { id: 'H1', x: 100, y: 100, label: 'House 1' },
  { id: 'H2', x: 400, y: 80, label: 'House 2' },
  { id: 'H3', x: 700, y: 150, label: 'House 3' },
  { id: 'H4', x: 200, y: 350, label: 'House 4' },
  { id: 'H5', x: 550, y: 380, label: 'House 5' },
  { id: 'H6', x: 750, y: 450, label: 'House 6' },
];

const EDGES = [
  { from: 'H1', to: 'H2' }, { from: 'H1', to: 'H4' },
  { from: 'H2', to: 'H3' }, { from: 'H2', to: 'H5' },
  { from: 'H3', to: 'H5' }, { from: 'H3', to: 'H6' },
  { from: 'H4', to: 'H5' }, { from: 'H5', to: 'H6' },
];

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [startNode, setStartNode] = useState('H1');
  const [endNode, setEndNode] = useState('H6');
  const [loading, setLoading] = useState(false);
  const [activePath, setActivePath] = useState([]);
  const [truckPos, setTruckPos] = useState(null);
  const [distance, setDistance] = useState(0);
  const [prediction, setPrediction] = useState(null);

  const getNodeCoords = (id) => {
    const node = NODES.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const animateScooter = async (path) => {
    for (let i = 0; i < path.length; i++) {
      setTruckPos(getNodeCoords(path[i]));
      await new Promise(r => setTimeout(r, 600));
    }
  };

  const handleFetch = async (endpoint, params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE}/${endpoint}${query ? '?' + query : ''}`);
      const data = await response.json();
      
      if (endpoint === 'shortest' || endpoint === 'euler') {
        setActivePath(data.path);
        setDistance(data.distance || 0);
        animateScooter(data.path);
      } else if (endpoint === 'predict') {
        setPrediction(data.time);
      }
    } catch (err) {
      alert("Backend Offline! Run 'python app.py'");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <nav className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="p-2 bg-emerald-600 rounded-lg"><Bike size={20} className="text-white" /></div>
          <span>Scooter <span className="text-emerald-500">Dispatch</span></span>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-800 rounded-full">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
      </nav>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        <div className="lg:col-span-3 space-y-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-xs font-bold opacity-50 mb-4 uppercase flex items-center gap-2"><Settings size={14}/> Controls</h2>
            <div className="space-y-4">
              <select value={startNode} onChange={e => setStartNode(e.target.value)} className="w-full p-2.5 bg-slate-800 rounded-lg">
                {NODES.map(n => <option key={n.id} value={n.id}>{n.id} - {n.label}</option>)}
              </select>
              <select value={endNode} onChange={e => setEndNode(e.target.value)} className="w-full p-2.5 bg-slate-800 rounded-lg">
                {NODES.map(n => <option key={n.id} value={n.id}>{n.id} - {n.label}</option>)}
              </select>
              <button onClick={() => handleFetch('shortest', {start: startNode, end: endNode})} className="w-full bg-emerald-600 p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all"><Navigation size={18}/> Shortest Path</button>
              <button onClick={() => handleFetch('euler')} className="w-full border border-slate-700 p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"><Zap size={18} className="text-amber-500"/> Eulerian Path</button>
              <button onClick={() => handleFetch('predict')} className="w-full border border-slate-700 p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"><Clock size={18} className="text-blue-500"/> Predict Time (ML)</button>
              <button onClick={() => {setActivePath([]); setTruckPos(null); setDistance(0); setPrediction(null);}} className="w-full text-rose-500 text-sm font-bold flex items-center justify-center gap-2 pt-2"><RotateCcw size={14}/> Reset</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-900 rounded-3xl border border-slate-800 relative min-h-[550px] shadow-2xl overflow-hidden">
          <svg viewBox="0 0 900 600" className="w-full h-full p-4">
            {EDGES.map((edge, i) => {
              const from = getNodeCoords(edge.from);
              const to = getNodeCoords(edge.to);
              const isActive = activePath.some((n, idx) => (n === edge.from && activePath[idx+1] === edge.to) || (n === edge.to && activePath[idx+1] === edge.from));
              return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`${isActive ? 'stroke-emerald-500 stroke-[5px]' : 'stroke-slate-800 stroke-2'} transition-all duration-500`} />;
            })}
            {NODES.map(n => (
              <g key={n.id} transform={`translate(${n.x-20}, ${n.y-20})`}>
                <rect width="40" height="40" rx="10" className={startNode === n.id ? 'fill-emerald-600' : 'fill-slate-800'} />
                <Home size={20} className="text-white m-2.5 opacity-50" />
                <text x="20" y="55" textAnchor="middle" className="fill-white text-[10px] font-bold">{n.id}</text>
              </g>
            ))}
            {truckPos && (
              <g transform={`translate(${truckPos.x - 20}, ${truckPos.y - 20})`} className="transition-all duration-500">
                <circle cx="20" cy="20" r="22" className="fill-emerald-500/30 animate-ping" />
                <rect width="40" height="40" rx="20" className="fill-emerald-500 shadow-xl" />
                <Bike size={24} className="text-white m-2 animate-bounce" />
              </g>
            )}
          </svg>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-xs font-bold opacity-50 mb-4 uppercase flex items-center gap-2"><Activity size={14}/> Analysis Result</h2>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1 flex items-center gap-1"><Ruler size={12}/> Distance</p>
                <p className="text-3xl font-mono font-bold tracking-tighter">{distance} <span className="text-sm">km</span></p>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <p className="text-[10px] text-blue-400 font-bold uppercase mb-1 flex items-center gap-1"><Clock size={12}/> Est. Travel Time</p>
                <p className="text-3xl font-mono font-bold tracking-tighter">{prediction ? `${prediction} min` : '--'}</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-2xl">
                <p className="text-[10px] opacity-40 font-bold uppercase mb-2">Current Route</p>
                <div className="text-xs font-bold text-emerald-500 tracking-wider">
                  {activePath.length > 0 ? activePath.join(' → ') : 'Idle...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;