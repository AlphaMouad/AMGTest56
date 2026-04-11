import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Map, { Marker, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  MapPin, Maximize, ArrowRight, Zap, Key,

  ChevronDown, Crosshair, Shield, Globe, TrendingUp,
  CheckCircle2, XCircle, Activity
} from 'lucide-react';
import { nodes, ViewType, NodeData, PackData } from './data/packs';

// Use environment variable for Mapbox token to avoid hardcoding secrets
const ENV_MAPBOX_TOKEN = (import.meta as any).env?.VITE_MAPBOX_TOKEN || (process as any).env?.VITE_MAPBOX_TOKEN || "";

export default function App() {
  const [userToken, setUserToken] = useState<string>(() => localStorage.getItem('amg_mapbox_token') || '');
  const [tempTokenInput, setTempTokenInput] = useState('');
  const MAPBOX_TOKEN = ENV_MAPBOX_TOKEN || userToken;

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempTokenInput.trim()) {
      localStorage.setItem('amg_mapbox_token', tempTokenInput.trim());
      setUserToken(tempTokenInput.trim());
    }
  };
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0].id);
  const [selectedPackId, setSelectedPackId] = useState<string>(nodes[0].packs[0].id);
  const [view, setView] = useState<ViewType>('INSTITUTIONAL');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const selectedPack = selectedNode.packs.find(p => p.id === selectedPackId) || selectedNode.packs[0];
  const isFDI = view === 'INSTITUTIONAL';

  const handleNodeSelect = (node: NodeData) => {
    setSelectedNodeId(node.id);
    setSelectedPackId(node.packs[0].id);
    setExpandedSection(null);
    
    mapRef.current?.flyTo({
      center: [node.lng, node.lat],
      zoom: 12.5,
      duration: 2000,
      pitch: 60,
      essential: true
    });
  };

  return (
    <div className="h-screen w-full bg-[#161103] text-white font-sans flex flex-col overflow-hidden selection:bg-amg-gold/30 relative">
      
      {/* Global Noise Texture Overlay for Elite Depth */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-screen z-50" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* SECTION 1: GLOBAL HEADER */}
      <header className="h-20 shrink-0 border-b border-white/[0.05] bg-[#000000]/90 backdrop-blur-2xl flex items-center px-8 z-40 relative">
        {/* Logo */}
        <div className="flex items-center w-72 shrink-0 group cursor-pointer">
          <div className="relative">
            <img 
              src="https://amg-building.com/wp-content/uploads/2025/04/Logo.svg" 
              alt="AMG Building" 
              className="h-6 w-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -inset-4 bg-amg-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>

        {/* Ticker */}
        <div className="flex-1 flex items-center justify-center overflow-hidden mask-edges">
          <div className="flex items-center gap-6 animate-ticker whitespace-nowrap">
            <span className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase mr-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amg-gold" strokeWidth={1.5} /> The AMG Domination Moat:
            </span>
            <Badge icon={<Globe className="w-3.5 h-3.5" strokeWidth={1.5} />} text="Dubai SPV Liquid Exit" />
            <Badge icon={<Shield className="w-3.5 h-3.5" strokeWidth={1.5} />} text="Pre-Cleared VNA Guarantees" />
            <Badge icon={<Maximize className="w-3.5 h-3.5" strokeWidth={1.5} />} text="The 4:1 Spatial Ratio" />
            <Badge icon={<TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />} text="Capped Syndic OPEX" />
            {/* Duplicate for seamless loop */}
            <Badge icon={<Globe className="w-3.5 h-3.5" strokeWidth={1.5} />} text="Dubai SPV Liquid Exit" />
            <Badge icon={<Shield className="w-3.5 h-3.5" strokeWidth={1.5} />} text="Pre-Cleared VNA Guarantees" />
            <Badge icon={<Maximize className="w-3.5 h-3.5" strokeWidth={1.5} />} text="The 4:1 Spatial Ratio" />
            <Badge icon={<TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />} text="Capped Syndic OPEX" />
          </div>
        </div>
        
        <div className="w-72 shrink-0 flex justify-end">
          <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-white/40">
            <div className="w-1.5 h-1.5 rounded-full bg-amg-gold animate-pulse" />
            System Online
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* SECTION 2: INTERACTIVE MAP PANEL (Left) */}
        <div className="w-1/2 h-full relative bg-[#161103] border-r border-white/[0.05] overflow-hidden flex flex-col">
          
          {!MAPBOX_TOKEN ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center z-10 bg-[#161103] relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amg-gold/5 via-transparent to-transparent opacity-40 pointer-events-none" />
              <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-amg-gold/10 flex items-center justify-center mb-8 border border-amg-gold/20 shadow-[0_0_50px_rgba(222,168,33,0.15)] relative">
                  <div className="absolute inset-0 border border-amg-gold/30 rounded-full animate-[spin_8s_linear_infinite]" />
                  <MapPin className="w-10 h-10 text-amg-gold relative z-10" strokeWidth={1.5} />
                </div>
                <h2 className="font-heading text-3xl tracking-[0.2em] text-white uppercase mb-4 text-center">System Offline</h2>
                <p className="text-white/60 text-[15px] leading-relaxed font-light mb-10 text-center">
                  The geospatial intelligence matrix requires a valid Mapbox authentication token to establish an uplink. Initialize the system below to proceed.
                </p>

                <div className="w-full bg-[#000000]/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amg-gold/50 to-transparent opacity-50" />
                  <h3 className="font-heading text-[10px] tracking-[0.2em] text-amg-gold uppercase mb-6 flex items-center gap-2 justify-center">
                    <Key className="w-3.5 h-3.5" /> Authentication Required
                  </h3>

                  <form onSubmit={handleTokenSubmit} className="flex flex-col gap-5">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Shield className="w-4 h-4 text-white/30 group-focus-within:text-amg-gold transition-colors duration-300" />
                      </div>
                      <input
                        type="text"
                        value={tempTokenInput}
                        onChange={(e) => setTempTokenInput(e.target.value)}
                        placeholder="Enter Mapbox Public Token (pk.ey...)"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[13px] font-mono text-white placeholder-white/20 focus:outline-none focus:border-amg-gold/50 focus:bg-white/[0.05] transition-all duration-300 shadow-inner"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!tempTokenInput.trim()}
                      className="w-full bg-amg-gold hover:bg-[#F9D976] text-[#000000] font-heading text-[11px] font-bold tracking-[0.2em] uppercase py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(222,168,33,0.2)] hover:shadow-[0_0_30px_rgba(222,168,33,0.4)] flex items-center justify-center gap-2"
                    >
                      Establish Uplink <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-2 text-center">
                    <p className="text-white/40 text-[11px] font-light">Don't have a token? Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-amg-gold hover:underline">mapbox.com</a></p>
                    <p className="text-white/30 text-[10px] font-light mt-1">Alternatively, configure the <code className="font-mono text-white/40">VITE_MAPBOX_TOKEN</code> environment variable.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
          <Map
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{
              longitude: nodes[0].lng,
              latitude: nodes[0].lat,
              zoom: 12.5,
              pitch: 60,
              bearing: -17.6
            }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            attributionControl={false}
          >
            {/* Map Nodes / Markers */}
            {nodes.map((node) => {
              const isActive = selectedNodeId === node.id;
              return (
                <Marker 
                  key={node.id} 
                  longitude={node.lng} 
                  latitude={node.lat} 
                  anchor="center"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    handleNodeSelect(node);
                  }}
                >
                  <div className="relative cursor-pointer group z-20">
                    {/* Targeting Reticle */}
                    <div className="relative w-20 h-20 flex items-center justify-center -translate-y-4">
                      {/* Localized Radar Sweep */}
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                          animate={{ opacity: 0.4, scale: 1, rotate: 360 }}
                          transition={{ 
                            opacity: { duration: 1 },
                            scale: { duration: 1, ease: "easeOut" },
                            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                          }}
                          className="absolute inset-[-100px] origin-center pointer-events-none mix-blend-screen z-0"
                        >
                          <div className="w-1/2 h-1/2 bg-gradient-to-br from-amg-gold/0 via-amg-gold/20 to-amg-gold/60 rounded-tl-full border-l-2 border-t-2 border-amg-gold/50 shadow-[inset_0_0_30px_rgba(222,168,33,0.2)]" />
                        </motion.div>
                      )}

                      {/* Outer Spin */}
                      <div className={`absolute inset-0 border border-dashed rounded-full transition-all duration-1000 ${isActive ? 'border-amg-gold/80 animate-[spin_8s_linear_infinite]' : 'border-white/10 group-hover:border-amg-gold/30'}`} />
                      
                      {/* Corner Brackets (HUD Style) */}
                      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-500 ${isActive ? 'border-amg-gold' : 'border-white/20'}`} />
                      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors duration-500 ${isActive ? 'border-amg-gold' : 'border-white/20'}`} />
                      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors duration-500 ${isActive ? 'border-amg-gold' : 'border-white/20'}`} />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-500 ${isActive ? 'border-amg-gold' : 'border-white/20'}`} />

                      {/* Inner Ring */}
                      <div className={`absolute inset-4 border rounded-full transition-all duration-700 ${isActive ? 'border-amg-gold/90 scale-100 bg-amg-gold/10 backdrop-blur-md' : 'border-white/20 scale-75 group-hover:scale-90 bg-black/40 backdrop-blur-sm'}`} />
                      
                      {/* Core Dot */}
                      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isActive ? 'bg-amg-gold shadow-[0_0_25px_rgba(222,168,33,1)]' : 'bg-white/40 group-hover:bg-amg-gold/70'}`} />
                      
                      {/* Scanning Line */}
                      {isActive && (
                        <motion.div 
                          animate={{ 
                            top: ['20%', '80%', '20%'],
                            opacity: [0.4, 0.8, 0.4]
                          }}
                          transition={{ 
                            top: { duration: 2, repeat: Infinity, ease: "linear" },
                            opacity: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                          }}
                          className="absolute left-4 right-4 h-[1px] bg-amg-gold shadow-[0_0_10px_rgba(222,168,33,0.8)] z-10"
                        />
                      )}
                    </div>

                    {/* Node Label */}
                    <div className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded bg-[#0a0a0a]/95 backdrop-blur-xl border transition-all duration-500 ${
                      isActive 
                        ? 'border-amg-gold/40 text-amg-gold shadow-[0_8px_30px_rgba(0,0,0,0.8)] opacity-100 translate-y-0' 
                        : 'border-white/10 text-white/60 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg'
                    }`}>
                      <span className="font-heading text-[10px] tracking-[0.2em] uppercase">{node.name}</span>
                    </div>
                  </div>
                </Marker>
              );
            })}
          </Map>
          )}

          {/* Map Overlay Gradients & Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#000000]/80 via-transparent to-[#000000]/90 pointer-events-none" />
          
          {/* High-Tech Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

          {/* HUD Scanlines Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 3px)' }} />

          {/* Zone Data Overlay (Classified Dossier Style) */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedNodeId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-8 left-8 right-8 p-6 rounded-[2rem] bg-[#161103]/90 backdrop-blur-2xl border border-white/[0.05] shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amg-gold/30 to-transparent" />
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F9D976] to-[#DEA821] border border-white/20 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(222,168,33,0.3)]">
                  <MapPin className="w-6 h-6 text-[#000000]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading text-[11px] tracking-[0.25em] text-amg-gold font-bold uppercase mb-2">Active Zone Intelligence</h3>
                  <p className="text-[15px] text-white/90 leading-relaxed font-light tracking-wide">{selectedNode.zoneData}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SECTION 3: DYNAMIC DATA DASHBOARD (Right) */}
        <div className="w-1/2 h-full overflow-y-auto bg-[#000000] relative custom-scrollbar">
          
          {/* Sub-navigation for Packs (Segmented Control Style) */}
          {selectedNode.packs.length > 1 && (
            <div className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-2xl border-b border-white/[0.05] p-4">
              <div className="flex p-1.5 bg-white/[0.03] border border-white/[0.05] rounded-lg relative">
                {selectedNode.packs.map(pack => (
                  <button
                    key={pack.id}
                    onClick={() => {
                      setSelectedPackId(pack.id);
                      setExpandedSection(null);
                    }}
                    className={`relative flex-1 py-3 font-futura rounded-full text-[11px] tracking-[0.15em] uppercase z-10 transition-colors duration-300 ${
                      selectedPackId === pack.id ? 'text-[#000000]' : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    {selectedPackId === pack.id && (
                      <motion.div
                        layoutId="activePackTab"
                        className="absolute inset-0 bg-amg-gold rounded-full -z-10 shadow-[0_0_20px_rgba(222,168,33,0.2)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {pack.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* A. HERO MEDIA & QUICK STATS */}
                <div className="relative h-80 rounded-[2.5rem] overflow-hidden mb-10 border border-white/[0.05] group shadow-2xl">
                  <div className="absolute inset-0 bg-white/5 transition-transform duration-1000 group-hover:scale-105" 
                       style={{
                         backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop")',
                         backgroundSize: 'cover',
                         backgroundPosition: 'center'
                       }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent" />
                  <div className="absolute inset-0 bg-amg-gold/5 mix-blend-overlay" />
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-[#F9D976] to-[#DEA821] border border-white/20 backdrop-blur-xl mb-6 shadow-[0_0_30px_rgba(222,168,33,0.4)]"
                    >
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_15px_rgba(255,255,255,1)]" />
                      <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-[#000000] font-black">Classified Dossier</span>
                    </motion.div>
                    <h2 className="font-heading text-5xl md:text-6xl tracking-tighter text-white mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                      {selectedPack.name}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-12">
                  <StatCard label="Scale" value={selectedPack.quickStats.scale} delay={0.1} />
                  <StatCard label="Typology" value={selectedPack.quickStats.typology} delay={0.2} />
                  <StatCard label="Plot / Built" value={selectedPack.quickStats.plotBuilt} delay={0.3} />
                  <StatCard label="Base Price" value={selectedPack.quickStats.basePrice} highlight delay={0.4} />
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-[#161103] border border-white/[0.05] rounded-[2rem] p-10 mb-12 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-amg-gold/50" />
                  
                  <h3 className="font-heading text-[10px] tracking-[0.3em] text-amg-gold uppercase mb-8 flex items-center gap-3">
                    <Zap className="w-4 h-4" strokeWidth={1.5} /> The Executive Edge
                  </h3>
                  <ul className="space-y-6 relative z-10">
                    {selectedPack.theEdge.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-white/70 text-[15px] leading-relaxed font-light">
                        <div className="w-1.5 h-1.5 rounded-full bg-amg-gold/40 mt-2.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* C. THE DUAL-VIEW INTERFACE */}
                <div className="flex flex-col items-center justify-center p-12 bg-[#161103] border border-white/[0.05] rounded-[2.5rem] mb-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amg-gold/5 via-transparent to-transparent opacity-40" />
                  
                  <span className="font-heading text-[9px] tracking-[0.3em] text-white/30 uppercase mb-8 relative z-10">Contextual Data Matrix</span>
                  
                  <div className="flex p-1 bg-[#000000] border border-white/5 rounded-full relative w-full max-w-md z-10">
                    {['INSTITUTIONAL', 'RETAIL'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setView(t as ViewType)}
                        className={`relative flex-1 py-3 font-heading rounded-full text-[10px] font-bold tracking-[0.25em] uppercase z-10 transition-all duration-500 ${
                          view === t ? 'text-[#000000]' : 'text-white/30 hover:text-white/60'
                        }`}
                      >
                        {view === t && (
                          <motion.div
                            layoutId="activeToggle"
                            className="absolute inset-0 bg-amg-gold rounded-full -z-10 shadow-[0_0_30px_rgba(222,168,33,0.3)]"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        {t === 'INSTITUTIONAL' ? 'Institutional' : 'Retail'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* D. DEEP DIVE EXPANDERS */}
                <div className="space-y-4 mb-16">
                  {/* Expander 1: Financial & Lifestyle */}
                  <Accordion 
                    title={isFDI ? selectedPack.institutionalData.title : selectedPack.retailData.title}
                    isOpen={expandedSection === 'metrics'}
                    onClick={() => setExpandedSection(expandedSection === 'metrics' ? null : 'metrics')}
                    icon={<Activity className="w-5 h-5" strokeWidth={1.5} />}
                  >
                    <ul className="space-y-5">
                      {(isFDI ? selectedPack.institutionalData.points : selectedPack.retailData.points).map((point, idx) => (
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={idx} 
                          className="flex items-start gap-4 text-white/80 text-[15px] leading-relaxed font-light"
                        >
                          <CheckCircle2 className="w-5 h-5 text-amg-gold shrink-0 mt-0.5" strokeWidth={1.5} />
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </Accordion>

                  {/* Expander 2: Competitive Kill-Screen */}
                  <Accordion 
                    title="Competitive Kill-Screen"
                    isOpen={expandedSection === 'killscreen'}
                    onClick={() => setExpandedSection(expandedSection === 'killscreen' ? null : 'killscreen')}
                    icon={<Crosshair className="w-5 h-5" strokeWidth={1.5} />}
                  >
                    <div className="bg-[#161103] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
                      
                      <h4 className="font-heading text-xs tracking-[0.15em] text-white mb-8 border-b border-white/[0.05] pb-5 uppercase">
                        {selectedPack.killScreen.title}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Competitor Weakness */}
                        <div className="space-y-5">
                          <div className="flex items-center gap-3 text-white/60">
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
                              <XCircle className="w-4 h-4" strokeWidth={1.5} />
                            </div>
                            <span className="font-heading text-[10px] tracking-[0.2em] uppercase">Competitor Flaw</span>
                          </div>
                          <p className="text-[15px] text-white/60 leading-relaxed font-light border-l-2 border-white/10 pl-5">
                            {selectedPack.killScreen.competitorWeakness}
                          </p>
                        </div>
                        
                        {/* AMG Strength */}
                        <div className="space-y-5">
          <div className="flex items-center gap-3 text-[#000000]">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#F9D976] to-[#DEA821] flex items-center justify-center border border-white/10 shadow-lg">
                              <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                            </div>
                            <span className="font-heading text-[10px] tracking-[0.2em] uppercase text-amg-gold">AMG Advantage</span>
                          </div>
                          <p className="text-[15px] text-white/90 leading-relaxed font-light border-l-2 border-amg-gold/30 pl-5">
                            {selectedPack.killScreen.amgAdvantage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Accordion>
                </div>

                {/* E. ACTION FOOTER */}
                <div className="pt-8 border-t border-white/[0.05]">
                  <button className="btn primary w-full py-6 px-10 flex items-center justify-center gap-6 text-[11px] tracking-[0.3em] group shadow-[0_10px_40px_rgba(166,124,0,0.4)]">
                    <span className="font-black">Greenlight: Initiate Dubai SPV for {selectedPack.name}</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" strokeWidth={1.5} />
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Global CSS for Ticker Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f1f22;
          border-radius: 10px;
          border: 2px solid #000000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}} />
    </div>
  );
}

// --- Helper Components ---

function Badge({ icon, text }: { icon: ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-full shrink-0 shadow-sm">
      <div className="text-amg-gold">{icon}</div>
      <span className="font-heading text-[9px] tracking-[0.2em] text-white/60 uppercase">{text}</span>
    </div>
  );
}

function StatCard({ label, value, highlight = false, delay = 0 }: { label: string, value: string, highlight?: boolean, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative p-8 rounded-[2rem] overflow-hidden group ${highlight ? 'bg-amg-gold/[0.08] border-amg-gold/40' : 'bg-[#161103] border-white/[0.05]'} border transition-all duration-700 hover:border-white/20`}
    >
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${highlight ? 'via-amg-gold' : 'via-white/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
      <span className="font-heading block text-[10px] tracking-[0.4em] text-white/20 uppercase mb-4 font-bold transition-colors duration-500 group-hover:text-white/40">{label}</span>
      <span className={`block font-mono tracking-tighter ${highlight ? 'text-amg-gold text-5xl font-black drop-shadow-[0_0_15px_rgba(222,168,33,0.3)]' : 'text-white text-4xl font-extralight opacity-80 group-hover:opacity-100 transition-opacity duration-500'}`}>{value}</span>
    </motion.div>
  );
}

function Accordion({ title, isOpen, onClick, children, icon }: { title: string, isOpen: boolean, onClick: () => void, children: ReactNode, icon?: ReactNode }) {
  return (
    <div className={`border transition-all duration-500 rounded-[2rem] overflow-hidden ${isOpen ? 'bg-[#161103] border-amg-gold/20' : 'bg-[#161103] border-white/[0.05] hover:border-white/20'}`}>
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-8"
      >
        <div className="flex items-center gap-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-amg-gold text-[#000000]' : 'bg-white/[0.02] border border-white/[0.05] text-amg-gold'}`}>
            {icon}
          </div>
          <span className={`font-heading text-[11px] tracking-[0.25em] uppercase transition-colors duration-500 ${isOpen ? 'text-white font-bold' : 'text-white/50'}`}>{title}</span>
        </div>
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-amg-gold border-amg-gold text-[#000000]' : 'bg-transparent border-white/10 text-white/30'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 mt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
