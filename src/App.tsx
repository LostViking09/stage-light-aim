import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Target, 
  ArrowDownToLine, 
  MoveUp, 
  Map, 
  Eye, 
  Navigation, 
  Sun, 
  Moon, 
  Sparkles, 
  Info,
  Compass,
  Save,
  Trash2,
  Edit2,
  Plus,
  X,
  Check,
  FolderKanban
} from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  lx: string;
  ly: string;
  hc: string;
  ht: string;
  tx: string;
  ty: string;
  tz: string;
}

// Default initial custom presets if none exist in localStorage
const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'p1',
    name: 'Standard Arena Hang',
    lx: '0.0', ly: '0.0',
    hc: '1.5', ht: '7.0',
    tx: '4.0', ty: '3.0', tz: '0.0'
  },
  {
    id: 'p2',
    name: 'Proscenium Stage Left',
    lx: '-3.0', ly: '1.0',
    hc: '1.5', ht: '6.5',
    tx: '2.0', ty: '5.0', tz: '1.2'
  }
];

interface NumberInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ComponentType<{ size: number; className?: string }>;
  unit?: string;
  theme: 'dark' | 'light';
}

const NumberInput = ({ label, value, onChange, icon: Icon, unit, theme }: NumberInputProps) => {
  const isDark = theme === 'dark';
  const parsed = parseFloat(value) || 0;
  
  const step = (amount: number) => {
    const newVal = parsed + amount;
    onChange(newVal.toFixed(1));
  };

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <label className={`text-[11px] font-bold mb-1 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {Icon && <Icon size={11} className={isDark ? 'text-sky-400' : 'text-sky-600'} />}
        <span className="truncate">{label}</span>
      </label>
      <div className="relative flex items-stretch h-9 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-sky-500/50 focus-within:border-sky-500 transition-all">
        <input 
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full text-left font-mono text-sm pl-2.5 pr-10 focus:outline-none bg-transparent ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}
          step="0.1"
        />
        <div className="absolute right-0 top-0 bottom-0 pr-1 flex items-center gap-1 bg-gradient-to-l from-white dark:from-slate-900 via-white dark:via-slate-900 to-white/0 dark:to-transparent pl-3 pointer-events-none">
          {unit && (
            <span className={`text-[10px] font-mono font-bold mr-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {unit}
            </span>
          )}
          <div className="flex flex-col justify-center h-full pointer-events-auto">
            <button
              type="button"
              onClick={() => step(0.1)}
              className={`p-0.5 text-[8px] leading-none hover:bg-sky-500/10 hover:text-sky-500 transition-colors ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
              title="Increase 0.1"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => step(-0.1)}
              className={`p-0.5 text-[8px] leading-none hover:bg-sky-500/10 hover:text-sky-500 transition-colors ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
              title="Decrease 0.1"
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [lx, setLx] = useState('0.0');
  const [ly, setLy] = useState('0.0');
  const [hc, setHc] = useState('1.5');
  const [ht, setHt] = useState('7.0');
  const [tx, setTx] = useState('4.0');
  const [ty, setTy] = useState('3.0');
  const [tz, setTz] = useState('0.0');

  const [activeTab, setActiveTab] = useState<'top' | 'side'>('top');
  
  // Custom presets state loaded from localStorage
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showPresetsPanel, setShowPresetsPanel] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Load presets on mount
  useEffect(() => {
    const saved = localStorage.getItem('stage_light_presets');
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch (e) {
        setPresets(DEFAULT_PRESETS);
      }
    } else {
      setPresets(DEFAULT_PRESETS);
      localStorage.setItem('stage_light_presets', JSON.stringify(DEFAULT_PRESETS));
    }
  }, []);

  // Save presets back to localStorage
  const savePresetsToStorage = (updated: Preset[]) => {
    setPresets(updated);
    localStorage.setItem('stage_light_presets', JSON.stringify(updated));
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newPreset: Preset = {
      id: 'p_' + Date.now(),
      name: newPresetName.trim(),
      lx, ly, hc, ht, tx, ty, tz
    };

    const updated = [...presets, newPreset];
    savePresetsToStorage(updated);
    setNewPresetName('');
  };

  const handleDeletePreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    savePresetsToStorage(updated);
  };

  const handleStartRename = (preset: Preset) => {
    setEditingPresetId(preset.id);
    setEditingName(preset.name);
  };

  const handleSaveRename = (id: string) => {
    const updated = presets.map(p => {
      if (p.id === id) {
        return { ...p, name: editingName.trim() || p.name };
      }
      return p;
    });
    savePresetsToStorage(updated);
    setEditingPresetId(null);
  };

  const loadPresetData = (p: Preset) => {
    setLx(p.lx);
    setLy(p.ly);
    setHc(p.hc);
    setHt(p.ht);
    setTx(p.tx);
    setTy(p.ty);
    setTz(p.tz);
  };

  const nLx = parseFloat(lx) || 0;
  const nLy = parseFloat(ly) || 0;
  const nHc = parseFloat(hc) || 0;
  const nHt = parseFloat(ht) || 0;
  const nTx = parseFloat(tx) || 0;
  const nTy = parseFloat(ty) || 0;
  const nTz = parseFloat(tz) || 0;

  // Geometry math
  const divisor = nHt - nTz;
  const ratio = divisor !== 0 ? nHc / divisor : 0;
  const nAx = nLx + (nTx - nLx) * ratio;
  const nAy = nLy + (nTy - nLy) * ratio;

  // Additional stats
  const dxTgt = nTx - nLx;
  const dyTgt = nTy - nLy;
  const rTarget = Math.hypot(dxTgt, dyTgt);
  const rAim = Math.hypot(nAx - nLx, nAy - nLy);

  // Elevation Angle
  const heightDifference = nHt - nTz;
  const pitchRad = heightDifference !== 0 ? Math.atan2(rTarget, heightDifference) : 0;
  const angleFromVertical = pitchRad * (180 / Math.PI);
  const angleFromHorizontal = 90 - angleFromVertical;

  // Pan Angle
  const panRad = Math.atan2(dyTgt, dxTgt);
  let panDegrees = panRad * (180 / Math.PI);
  if (panDegrees < 0) panDegrees += 360;

  const isDark = theme === 'dark';
  const mainBg = isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800';
  const cardBg = isDark ? 'bg-slate-900 border-slate-800/80 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-slate-100/50 shadow-sm';
  const headerBorder = isDark ? 'border-slate-850' : 'border-slate-200';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';
  const accentLight = isDark ? 'text-sky-400' : 'text-sky-600';
  const accentRose = isDark ? 'text-rose-400' : 'text-rose-600';

  return (
    <div className={`min-h-screen ${mainBg} p-3 sm:p-6 font-sans transition-colors duration-200 flex flex-col items-center`}>
      <div className="w-full max-w-5xl space-y-4">
        
        {/* Header Bar */}
        <div className={`flex items-center justify-between pb-3 border-b ${headerBorder}`}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
              <Compass size={18} />
            </div>
            <div>
              <h1 className={`text-base font-bold tracking-tight ${textTitle}`}>Stage Light Aim</h1>
              <p className={`text-[9px] uppercase tracking-wider font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Truss Alignment Utility
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-1.5 rounded-lg border transition-all ${
              isDark 
                ? 'bg-slate-900 border-slate-850 text-yellow-400 hover:bg-slate-800' 
                : 'bg-white border-slate-200 text-slate-750 hover:bg-slate-50 shadow-sm'
            }`}
            aria-label="Toggle light/dark mode"
            id="theme-toggle"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* 2-Column Responsive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Controls & Presets Column (Left on Large Screens) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Custom Presets Panel */}
            <div className={`border rounded-xl p-3 ${cardBg} space-y-2.5 transition-all`}>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowPresetsPanel(!showPresetsPanel)}
                  className="flex items-center gap-1.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors"
                >
                  <FolderKanban size={13} className="text-yellow-500" />
                  <span>Saved Custom Presets ({presets.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {showPresetsPanel ? '▲ Hide' : '▼ Manage'}
                  </span>
                </button>
              </div>

              {/* Quick-select horizontal list when collapsed */}
              {!showPresetsPanel && presets.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => loadPresetData(p)}
                      className={`text-[10px] py-1 px-2.5 rounded-md font-bold whitespace-nowrap transition-all border ${
                        isDark
                          ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Expanded presets panel for advanced management */}
              {showPresetsPanel && (
                <div className="space-y-3 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                  {presets.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-2 text-center italic">
                      No saved presets yet. Name and save your current configuration below!
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {presets.map((p) => (
                        <div 
                          key={p.id}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs ${
                            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-150'
                          }`}
                        >
                          {editingPresetId === p.id ? (
                            <div className="flex items-center gap-1.5 flex-1 mr-2">
                              <input 
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className={`px-1.5 py-0.5 text-xs rounded border w-full font-medium ${
                                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                                }`}
                                autoFocus
                              />
                              <button 
                                onClick={() => handleSaveRename(p.id)}
                                className="p-1 text-green-500 hover:bg-green-500/10 rounded"
                              >
                                <Check size={13} />
                              </button>
                              <button 
                                onClick={() => setEditingPresetId(null)}
                                className="p-1 text-slate-400 hover:bg-slate-500/10 rounded"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1 min-w-0 mr-2">
                              <div className="font-bold truncate text-slate-800 dark:text-slate-200">{p.name}</div>
                              <div className="text-[9px] text-slate-400 font-mono">
                                Fix: {p.lx}, {p.ly} | H: {p.hc}→{p.ht} | Tgt: {p.tx}, {p.ty}, {p.tz}
                              </div>
                            </div>
                          )}

                          {editingPresetId !== p.id && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => loadPresetData(p)}
                                className={`px-2 py-1 text-[10px] font-bold rounded ${
                                  isDark ? 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400' : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/50'
                                }`}
                              >
                                Load
                              </button>
                              <button
                                onClick={() => handleStartRename(p)}
                                className={`p-1 rounded ${
                                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                                }`}
                                title="Rename"
                              >
                                <Edit2 size={11} />
                              </button>
                              <button
                                onClick={() => handleDeletePreset(p.id)}
                                className="p-1 rounded hover:bg-rose-500/10 text-rose-500"
                                title="Delete"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Save current state as new preset form */}
                  <form onSubmit={handleSaveCurrent} className="flex gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <input 
                      type="text"
                      placeholder="New Preset Name..."
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      className={`flex-1 px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' 
                          : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Save size={12} />
                      <span>Save Current</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Form Grid */}
            <div className="space-y-3">
              {/* Light Section */}
              <div className={`border p-3 rounded-xl ${cardBg}`}>
                <h2 className={`text-xs font-bold mb-3 flex items-center gap-1.5 ${accentLight}`}>
                  <Lightbulb size={13} /> Hanging Truss Source (m)
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <NumberInput label="Fixture X" value={lx} onChange={setLx} unit="m" theme={theme} />
                    <NumberInput label="Fixture Y" value={ly} onChange={setLy} unit="m" theme={theme} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <NumberInput label="Lowered Height (Z)" value={hc} onChange={setHc} icon={ArrowDownToLine} unit="m" theme={theme} />
                    <NumberInput label="Raised Height (Z)" value={ht} onChange={setHt} icon={MoveUp} unit="m" theme={theme} />
                  </div>
                </div>
              </div>

              {/* Target Section */}
              <div className={`border p-3 rounded-xl ${cardBg}`}>
                <h2 className={`text-xs font-bold mb-3 flex items-center gap-1.5 ${accentRose}`}>
                  <Target size={13} /> Target Focal Spot (m)
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  <NumberInput label="Target X" value={tx} onChange={setTx} unit="m" theme={theme} />
                  <NumberInput label="Target Y" value={ty} onChange={setTy} unit="m" theme={theme} />
                  <NumberInput label="Target Z" value={tz} onChange={setTz} unit="m" theme={theme} />
                </div>
              </div>
            </div>
          </div>

          {/* Diagram, Visualizer & Results Column (Right on Large Screens) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Floor Aim Target Result */}
            <div className={`border rounded-xl p-4 text-center shadow-md relative overflow-hidden ${
              isDark 
                ? 'bg-sky-950/20 border-sky-800/30' 
                : 'bg-sky-50 border-sky-200/85 shadow-sky-100/30'
            }`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-rose-400" />
              <h3 className={`text-[10px] font-bold uppercase tracking-wider mb-2.5 flex items-center justify-center gap-1 ${
                isDark ? 'text-sky-300' : 'text-sky-850'
              }`}>
                <Navigation size={11} className="text-sky-500" />
                Stage Floor Alignment Coordinates (at Z=0)
              </h3>
              <div className="flex justify-center items-center gap-4">
                <div className={`px-4 py-1.5 rounded-lg border ${isDark ? 'bg-slate-950/60 border-transparent' : 'bg-white shadow-sm border-sky-100'}`}>
                  <span className={`text-[9px] font-bold block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>AIM X</span>
                  <span className={`text-xl font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{nAx.toFixed(2)}</span>
                  <span className="text-[10px] ml-0.5 text-sky-500 font-bold">m</span>
                </div>
                <div className={`px-4 py-1.5 rounded-lg border ${isDark ? 'bg-slate-950/60 border-transparent' : 'bg-white shadow-sm border-sky-100'}`}>
                  <span className={`text-[9px] font-bold block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>AIM Y</span>
                  <span className={`text-xl font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{nAy.toFixed(2)}</span>
                  <span className="text-[10px] ml-0.5 text-sky-500 font-bold">m</span>
                </div>
              </div>
              <p className={`text-[10px] mt-2.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                While lowered, aim beam directly at <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{nAx.toFixed(1)}, {nAy.toFixed(1)}</strong> on the stage floor.
              </p>
            </div>

            {/* Visualizer & View Mode */}
            <div className={`border rounded-xl overflow-hidden ${cardBg}`}>
              <div className={`flex border-b ${isDark ? 'border-slate-800' : 'border-slate-250'}`}>
                <button
                  onClick={() => setActiveTab('top')}
                  className={`flex-1 py-2.5 text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1 transition-all ${
                    activeTab === 'top' 
                      ? isDark 
                        ? 'text-sky-400 bg-slate-800/40 border-b border-sky-400' 
                        : 'text-sky-700 bg-slate-50 border-b border-sky-600'
                      : isDark
                        ? 'text-slate-500 hover:text-slate-350'
                        : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Map size={12} /> Top View (X-Y)
                </button>
                <button
                  onClick={() => setActiveTab('side')}
                  className={`flex-1 py-2.5 text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1 transition-all ${
                    activeTab === 'side' 
                      ? isDark 
                        ? 'text-sky-400 bg-slate-800/40 border-b border-sky-400' 
                        : 'text-sky-700 bg-slate-50 border-b border-sky-600'
                      : isDark
                        ? 'text-slate-500 hover:text-slate-350'
                        : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Eye size={12} /> Side View (Z)
                </button>
              </div>

              {/* SVG Frame - Clean, light-mode contrasting background grids */}
              <div className={`w-full aspect-[4/3] flex items-center justify-center transition-colors ${
                isDark ? 'bg-slate-950' : 'bg-slate-50'
              }`}>
                {activeTab === 'top' ? (
                  <TopView lx={nLx} ly={nLy} tx={nTx} ty={nTy} ax={nAx} ay={nAy} theme={theme} />
                ) : (
                  <SideView lx={nLx} ly={nLy} hc={nHc} ht={nHt} tx={nTx} ty={nTy} tz={nTz} ax={nAx} ay={nAy} theme={theme} />
                )}
              </div>

              {/* Clean Legend Bar */}
              <div className={`p-2 text-[9px] font-bold flex justify-center gap-4 border-t ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-650'
              }`}>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-yellow-300"></span>
                  <span>Fixture</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-300"></span>
                  <span>Target</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-sky-300"></span>
                  <span>Floor Aim</span>
                </div>
              </div>
            </div>

            {/* High-density focused tech specs (Simple Report) */}
            <div className={`border p-3 rounded-xl ${cardBg}`}>
              <h2 className={`text-xs font-bold mb-2 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Info size={13} className="text-sky-500" /> Focus Angles Sheet
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                <div className="flex justify-between py-1 border-b border-dashed border-slate-700/10">
                  <span className={textSub}>Pan Orientation:</span>
                  <span className={`font-mono font-bold ${textTitle}`}>{panDegrees.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-700/10">
                  <span className={textSub}>Pitch Tilt:</span>
                  <span className={`font-mono font-bold ${textTitle}`}>{angleFromVertical.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-700/10">
                  <span className={textSub}>Target H-Dist:</span>
                  <span className={`font-mono font-bold ${textTitle}`}>{rTarget.toFixed(1)}m</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-700/10">
                  <span className={textSub}>Floor Aim H-Dist:</span>
                  <span className={`font-mono font-bold ${textTitle}`}>{rAim.toFixed(1)}m</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// MINIMALIST TOP VIEW SVG
const TopView = ({ lx, ly, tx, ty, ax, ay, theme }: any) => {
  const isDark = theme === 'dark';
  
  const pts = [
    { x: lx, y: ly },
    { x: tx, y: ty },
    { x: ax, y: ay },
  ];
  const minX = Math.min(...pts.map(p => p.x)) - 1.5;
  const maxX = Math.max(...pts.map(p => p.x)) + 1.5;
  const minY = Math.min(...pts.map(p => p.y)) - 1.5;
  const maxY = Math.max(...pts.map(p => p.y)) + 1.5;
  
  const width = Math.max(maxX - minX, 4);
  const height = Math.max(maxY - minY, 3);

  const strokeGrid = isDark ? '#1e293b' : '#cbd5e1';
  const strokeAxis = isDark ? '#334155' : '#94a3b8';
  const textLabel = isDark ? '#64748b' : '#334155';
  const beamColor = isDark ? '#38bdf8' : '#0284c7';

  return (
    <svg viewBox={`${minX} ${minY} ${width} ${height}`} className="w-full h-full max-h-full">
      <defs>
        <pattern id="gridTopMini" width="1" height="1" patternUnits="userSpaceOnUse">
          <path d="M 1 0 L 0 0 0 1" fill="none" stroke={strokeGrid} strokeWidth="0.03" />
        </pattern>
      </defs>
      
      {/* Grid */}
      <rect x={minX} y={minY} width={width} height={height} fill="url(#gridTopMini)" />
      
      {/* X and Y Axes */}
      <line x1={0} y1={minY} x2={0} y2={maxY} stroke={strokeAxis} strokeWidth="0.05" />
      <line x1={minX} y1={0} x2={maxX} y2={0} stroke={strokeAxis} strokeWidth="0.05" />

      {/* Axis Directions */}
      <text x={maxX - 0.15} y={0.25} fill={textLabel} fontSize="0.14" textAnchor="end" fontWeight="bold">
        +X (Stage Left)
      </text>
      <text x={minX + 0.15} y={0.25} fill={textLabel} fontSize="0.14" textAnchor="start" fontWeight="bold">
        -X (Stage Right)
      </text>
      <text x={0.15} y={maxY - 0.1} fill={textLabel} fontSize="0.14" fontWeight="bold">
        +Y (Downstage)
      </text>
      <text x={0.15} y={minY + 0.2} fill={textLabel} fontSize="0.14" fontWeight="bold">
        -Y (Upstage)
      </text>

      {/* Vector Path */}
      <line x1={lx} y1={ly} x2={tx} y2={ty} stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="0.03" strokeDasharray="0.1 0.1" />
      <line x1={lx} y1={ly} x2={ax} y2={ay} stroke={beamColor} strokeWidth="0.06" />

      {/* Dots */}
      {/* Target */}
      <circle cx={tx} cy={ty} r="0.14" fill="#ef4444" stroke="#ffffff" strokeWidth="0.03" />
      <text x={tx} y={ty - 0.22} fill="#ef4444" fontSize="0.13" fontWeight="bold" textAnchor="middle">
        Tgt ({tx.toFixed(1)}, {ty.toFixed(1)})
      </text>

      {/* Aim point */}
      <circle cx={ax} cy={ay} r="0.16" fill={beamColor} stroke="#ffffff" strokeWidth="0.03" />
      <text x={ax} y={ay + 0.25} fill={beamColor} fontSize="0.13" fontWeight="bold" textAnchor="middle">
        Aim ({ax.toFixed(1)}, {ay.toFixed(1)})
      </text>

      {/* Light Source */}
      <circle cx={lx} cy={ly} r="0.18" fill="#eab308" stroke="#ffffff" strokeWidth="0.03" />
      <text x={lx} y={ly - 0.25} fill={isDark ? '#ca8a04' : '#a16207'} fontSize="0.13" fontWeight="bold" textAnchor="middle">
        Fixture ({lx.toFixed(1)}, {ly.toFixed(1)})
      </text>
    </svg>
  );
};

// MINIMALIST SIDE VIEW SVG
const SideView = ({ lx, ly, hc, ht, tx, ty, tz, ax, ay, theme }: any) => {
  const isDark = theme === 'dark';

  const rTarget = Math.hypot(tx - lx, ty - ly);
  const rAim = Math.hypot(ax - lx, ay - ly);

  const minR = -1;
  const maxR = Math.max(rTarget, rAim, 4) + 1.5;
  const minZ = -1;
  const maxZ = Math.max(ht, hc, tz, 4) + 1.5;

  const width = Math.max(maxR - minR, 4);
  const height = Math.max(maxZ - minZ, 3);

  const transform = `translate(0, ${maxZ}) scale(1, -1)`;

  const strokeGrid = isDark ? '#1e293b' : '#cbd5e1';
  const strokeAxis = isDark ? '#334155' : '#94a3b8';
  const textLabel = isDark ? '#64748b' : '#334155';
  const beamAimColor = isDark ? '#38bdf8' : '#0284c7';

  return (
    <svg viewBox={`${minR} ${minZ} ${width} ${height}`} className="w-full h-full max-h-full">
      <g transform={transform}>
        <defs>
          <pattern id="gridSideMini" width="1" height="1" patternUnits="userSpaceOnUse">
            <path d="M 1 0 L 0 0 0 1" fill="none" stroke={strokeGrid} strokeWidth="0.03" />
          </pattern>
        </defs>
        
        {/* Grid */}
        <rect x={minR} y={0} width={width} height={maxZ} fill="url(#gridSideMini)" />

        {/* Floor Line */}
        <line x1={minR} y1={0} x2={maxR} y2={0} stroke="#475569" strokeWidth="0.08" />

        {/* Truss axis line */}
        <line x1={0} y1={0} x2={0} y2={maxZ} stroke={strokeAxis} strokeWidth="0.05" />

        {/* Beam when raised */}
        <line x1={0} y1={ht} x2={rTarget} y2={tz} stroke="#ef4444" strokeWidth="0.04" strokeDasharray="0.1 0.1" />

        {/* Beam when lowered */}
        <line x1={0} y1={hc} x2={rAim} y2={0} stroke={beamAimColor} strokeWidth="0.06" />

        {/* Light fixtures */}
        <circle cx={0} cy={ht} r="0.18" fill="#eab308" fillOpacity="0.4" stroke="#ffffff" strokeWidth="0.03" />
        <circle cx={0} cy={hc} r="0.18" fill="#eab308" stroke="#ffffff" strokeWidth="0.03" />

        {/* Points */}
        <circle cx={rTarget} cy={tz} r="0.14" fill="#ef4444" stroke="#ffffff" strokeWidth="0.03" />
        <circle cx={rAim} cy={0} r="0.16" fill={beamAimColor} stroke="#ffffff" strokeWidth="0.03" />
      </g>

      {/* Axis Texts */}
      <text x={0.3} y={maxZ - ht + 0.05} fill={isDark ? '#facc15' : '#a16207'} fontSize="0.13" fontWeight="bold">
        Raised ({ht}m)
      </text>
      <text x={0.3} y={maxZ - hc + 0.05} fill={isDark ? '#facc15' : '#ca8a04'} fontSize="0.13" fontWeight="bold">
        Lowered ({hc}m)
      </text>

      {/* Target */}
      <text x={rTarget} y={maxZ - tz - 0.22} fill="#ef4444" fontSize="0.13" fontWeight="bold" textAnchor="middle">
        Tgt ({rTarget.toFixed(1)}m, Z={tz}m)
      </text>

      {/* Floor Aim */}
      <text x={rAim} y={maxZ - 0.25} fill={beamAimColor} fontSize="0.13" fontWeight="bold" textAnchor="middle">
        Aim ({rAim.toFixed(1)}m)
      </text>

      <text x={maxR - 0.1} y={maxZ + 0.25} fill={textLabel} fontSize="0.13" textAnchor="end" fontWeight="bold">
        Dist (R)
      </text>
    </svg>
  );
};
