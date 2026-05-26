import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { toPng } from 'html-to-image'; 
import { 
  Play, ChevronDown, TrendingUp, Activity, List, Clock, Cpu, Download, Loader2, Check, Search, Square, CheckSquare, Filter
} from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { useData } from '../lib/DataContext'; 

// === CONSTANTS & MOCK DATA ===
const TARGET_OPTIONS = ["DEV-1", "LPU-MAIN", "RADAR-SYS", "SVD-CAM"];

const MOCK_HIERARCHY = {
  "R1-SAMBALPUR TO MANGULI": ["R1.02-MANESWAR", "R1.03-NEAR NATIO...", "R1.04-JUJUMURA", "R1.05-HATIBARI"],
  "R2-DAITARI TO CHANDIKHOL": ["R2.01-DANAGADI", "R2.02-JAJPUR", "R2.03-PANIKOILI"],
  "R3-BARBILL TO PANIKOILI": ["R3.01-RIMULI", "R3.02-KEONJHAR"],
  "R4-PITRI TO PALLAHARA": ["R4.01-PITRI", "R4.02-PALLAHARA"],
  "R10-KUJANG TO BHUTAMUNDAI": ["R10.01-KUJANG", "R10.02-PARADIP"]
};

const ALL_ROUTES = Object.keys(MOCK_HIERARCHY);

// === EXTRACTED DROPDOWN COMPONENT ===
const DropdownMenu = ({ title, search, setSearch, items, selectedItems, toggleItem, handleAll, isDarkMode, primaryColor }) => {
  const filteredItems = items.filter(item => item.toLowerCase().includes(search.toLowerCase()));
  const allSelected = selectedItems.length > 0 && selectedItems.length === filteredItems.length;

  return (
    <div className={`absolute top-full left-0 mt-2 w-[480px] rounded-2xl shadow-2xl border z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden ${isDarkMode ? 'bg-[#18181B] border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className={`p-4 border-b flex items-center justify-between gap-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Select {title}
          </h3>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className={`flex items-center h-8 px-3 rounded-lg border w-48 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <Search className="w-3 h-3 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[11px] outline-none font-bold placeholder:text-slate-400"
              autoFocus 
            />
          </div>
          <div onClick={handleAll} className="flex items-center gap-2 cursor-pointer group">
            <span className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>All</span>
            {allSelected ? <CheckSquare className="w-4 h-4" style={{ color: primaryColor }} /> : <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-500" />}
          </div>
        </div>
      </div>

      <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
        {filteredItems.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-4 font-bold">No {title.toLowerCase()} found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredItems.map((item, idx) => {
              const isSelected = selectedItems.includes(item);
              return (
                <div 
                  key={idx} 
                  onClick={() => toggleItem(item)}
                  className={`px-3 py-2.5 rounded-xl border cursor-pointer text-[10px] font-black uppercase tracking-tight truncate transition-all ${
                    isSelected ? 'text-white border-transparent shadow-md' : isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  style={isSelected ? { backgroundColor: primaryColor } : {}} 
                  title={item}
                >
                  {item}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className={`px-4 py-2 text-[9px] font-bold italic border-t ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
        *You can choose multiple options
      </div>
    </div>
  );
};


const SignalAnalytics = () => {
  // === CONTEXT & STATE ===
  const { primaryColor, isDarkMode } = useTheme();
  const { 
    targetNodes, setTargetNodes,
    startDate, setStartDate,
    endDate, setEndDate,
    analyticsData, setAnalyticsData,
    aggregateUptime, setAggregateUptime 
  } = useData();
  
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); 
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);

  // === NEW FILTER STATES ===
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const [routeSearch, setRouteSearch] = useState('');
  const [locSearch, setLocSearch] = useState('');

  // === REFS ===
  const chartRef = useRef(null);
  const targetRef = useRef(null);
  const filterRef = useRef(null);

  // === LIFECYCLE EFFECTS ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (targetRef.current && !targetRef.current.contains(event.target)) {
        setIsTargetDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableLocations = useMemo(() => {
    if (selectedRoutes.length === 0) return [];
    let locs = [];
    selectedRoutes.forEach(route => {
      if (MOCK_HIERARCHY[route]) locs = [...locs, ...MOCK_HIERARCHY[route]];
    });
    return locs;
  }, [selectedRoutes]);

  useEffect(() => {
    setSelectedLocations(prev => prev.filter(loc => availableLocations.includes(loc)));
  }, [availableLocations]);


  // === EVENT HANDLERS ===
  const toggleRoute = (route) => {
    setSelectedRoutes(prev => prev.includes(route) ? prev.filter(r => r !== route) : [...prev, route]);
  };

  const toggleLocation = (loc) => {
    setSelectedLocations(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]);
  };

  const handleRouteAll = () => {
    const filteredRoutes = ALL_ROUTES.filter(r => r.toLowerCase().includes(routeSearch.toLowerCase()));
    if (selectedRoutes.length === filteredRoutes.length && filteredRoutes.length > 0) {
      setSelectedRoutes([]); 
    } else {
      setSelectedRoutes(filteredRoutes); 
    }
  };

  const handleLocAll = () => {
    const filteredLocs = availableLocations.filter(l => l.toLowerCase().includes(locSearch.toLowerCase()));
    if (selectedLocations.length === filteredLocs.length && filteredLocs.length > 0) {
      setSelectedLocations([]); 
    } else {
      setSelectedLocations(filteredLocs); 
    }
  };

  const toggleTarget = (node, e) => {
    e.stopPropagation();
    if (targetNodes.includes(node)) {
      setTargetNodes(targetNodes.filter(n => n !== node));
    } else {
      setTargetNodes([...targetNodes, node]);
    }
  };

  const handleAnalyze = () => {
    // Basic Configuration Checks
    if (!selectedRoutes || selectedRoutes.length === 0) {
      alert("Missing Configuration: Please select at least one route from the filter panel.");
      return;
    }
    if (!targetNodes || targetNodes.length === 0) {
      alert("Missing Configuration: Please select at least one target architecture.");
      return;
    }

    // === SMART DATE VALIDATION (OPTIONAL DATES) ===
    if (startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        alert("Invalid Timeline: Terminal time must occur after the origin time.");
        return;
      }
    } else if (startDate || endDate) {
      alert("Incomplete Timeline: Please specify both Origin and Terminal times, or leave both empty to fetch complete history.");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const generatedData = [];
      const times = ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30'];
      
      times.forEach((time, index) => {
        const isDown = index === 2 || index === 3; 
        generatedData.push({
          time: time,
          statusValue: isDown ? 0 : 100, 
          status: isDown ? 'DOWN' : 'UP',
          remarks: isDown ? 'Ping timeout across route' : 'Operational',
          nodeName: selectedRoutes[0] || 'UNKNOWN'
        });
      });
      
      setAnalyticsData(generatedData);
      setAggregateUptime("71.42%");
      setLoading(false);
    }, 1500);
  };

  // === REPORT GENERATION ===
  const generatePDF = async () => {
    if (analyticsData.length === 0) {
      alert("No Data Available: Please execute the analysis before generating a report.");
      return;
    }

    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const selectedTargetsString = targetNodes.join(', ');
    // Handle timeline text gracefully if dates were left empty
    const timelineText = (startDate && endDate) 
      ? `${startDate.replace('T', ' ')} TO ${endDate.replace('T', ' ')}` 
      : 'ALL TIME DATA (Full History)';

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      doc.setFontSize(22);
      doc.setTextColor(0, 82, 255); 
      doc.text("Signal Analytics Report", 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Date Generated: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Target Architecture: ${selectedTargetsString}`, 14, 35);
      doc.text(`Timeline: ${timelineText}`, 14, 40);
      doc.text(`Aggregate Uptime: ${aggregateUptime}`, 14, 45);

      if (chartRef.current) {
        const imgData = await toPng(chartRef.current, {
          backgroundColor: isDarkMode ? '#1E293B' : '#ffffff',
          pixelRatio: 2, 
          cacheBust: true, 
        });
        
        if (imgData) {
          doc.addImage(imgData, 'PNG', 14, 55, 180, 80); 
        }
      }

      const tableColumn = ["Timestamp", "Route Info", "Boolean Status", "System Remarks"];
      const tableRows = [];

      analyticsData.forEach(log => {
        tableRows.push([log.time, log.nodeName, log.status, log.remarks]);
      });

      autoTable(doc, {
        startY: 145, 
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [0, 82, 255], textColor: 255, fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8 },
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 2) {
            if (data.cell.raw === 'UP') {
              data.cell.styles.textColor = [5, 150, 105]; 
              data.cell.styles.fontStyle = 'bold';
            } else if (data.cell.raw === 'DOWN') {
              data.cell.styles.textColor = [239, 68, 68]; 
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });

      const fileName = `Analytics_Report_${new Date().getTime()}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("PDF generation failed: ", err);
      alert("Report Generation Failed: An unexpected error occurred. Please check the system logs.");
    } finally {
      setIsDownloading(false); 
    }
  };

  // === SUB-COMPONENTS ===
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isUp = payload[0].value === 100;
      return (
        <div className={`p-3 border shadow-xl rounded-xl z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <p className="text-[10px] font-black text-slate-400 uppercase">{label}</p>
          <p className={`text-xs font-black mt-1 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            STATUS: {isUp ? 'OPERATIONAL' : 'OFFLINE'}
          </p>
        </div>
      );
    }
    return null;
  };

  // === UI RENDER ===
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2">
      
      {/* --- DEPENDENT FILTER BAR --- */}
      <div className={`rounded-2xl border shadow-sm p-4 flex items-center gap-6 transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`} ref={filterRef}>
        
        <div className="flex items-center gap-2 text-slate-400 border-r pr-6 dark:border-slate-700">
          <Filter className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Network Scope</span>
        </div>

        <div className="flex gap-4 relative z-50">
          {/* Route Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'route' ? null : 'route')}
              className={`flex items-center justify-between gap-3 px-4 h-10 min-w-[200px] max-w-[250px] rounded-xl border text-xs font-black transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              style={selectedRoutes.length > 0 ? { borderColor: primaryColor } : {}}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Route:</span>
                <span className="truncate">{selectedRoutes.length > 0 ? `${selectedRoutes.length} Selected` : 'None'}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeDropdown === 'route' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'route' && (
              <DropdownMenu 
                title="Route" 
                search={routeSearch} setSearch={setRouteSearch} 
                items={ALL_ROUTES} selectedItems={selectedRoutes} 
                toggleItem={toggleRoute} handleAll={handleRouteAll} 
                isDarkMode={isDarkMode} primaryColor={primaryColor}
              />
            )}
          </div>

          {/* Location Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
              disabled={selectedRoutes.length === 0}
              className={`flex items-center justify-between gap-3 px-4 h-10 min-w-[200px] max-w-[250px] rounded-xl border text-xs font-black transition-all ${
                selectedRoutes.length === 0 
                  ? 'opacity-50 cursor-not-allowed ' + (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-600' : 'bg-slate-100 border-slate-200 text-slate-400')
                  : isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              style={selectedLocations.length > 0 ? { borderColor: primaryColor } : {}}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Location:</span>
                <span className="truncate">{selectedLocations.length > 0 ? `${selectedLocations.length} Selected` : 'All'}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeDropdown === 'location' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'location' && (
              <DropdownMenu 
                title="Location" 
                search={locSearch} setSearch={setLocSearch} 
                items={availableLocations} selectedItems={selectedLocations} 
                toggleItem={toggleLocation} handleAll={handleLocAll} 
                isDarkMode={isDarkMode} primaryColor={primaryColor}
              />
            )}
          </div>
        </div>
      </div>

      {/* --- CONTROL PANEL --- */}
      <div className={`p-6 rounded-[24px] border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-end transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
        
        <div className="space-y-2 relative" ref={targetRef}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Architecture</p>
          
          <div 
            onClick={() => setIsTargetDropdownOpen(!isTargetDropdownOpen)} 
            className={`w-full h-[48px] px-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between relative ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50/50 border-slate-200 text-slate-600'}`}
          >
            <span className="text-[11px] font-black uppercase truncate pr-4">
              {targetNodes.length === 0 ? 'SELECT TARGET' : targetNodes.join(', ')}
            </span>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {isTargetDropdownOpen && (
            <div className={`absolute top-[calc(100%+8px)] left-0 w-full rounded-2xl shadow-2xl z-40 py-2 border flex flex-col animate-in fade-in slide-in-from-top-2 ${isDarkMode ? 'bg-[#18181b] border-slate-800' : 'bg-white border-slate-100'}`}>
              {TARGET_OPTIONS.map(node => {
                const isSelected = targetNodes.includes(node);
                return (
                  <div 
                    key={node}
                    onClick={(e) => toggleTarget(node, e)}
                    className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-transparent' : isDarkMode ? 'border-slate-600' : 'border-slate-300'}`} style={isSelected ? { backgroundColor: primaryColor } : {}}>
                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {node}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Origin Time (Optional)</p>
          <input 
            type="datetime-local" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full h-[48px] px-4 rounded-2xl border text-[11px] font-black outline-none transition-all uppercase ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500 [color-scheme:dark]' : 'bg-slate-50/50 border-slate-200 text-slate-600 focus:ring-2 focus:ring-blue-100'}`}
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Terminal Time (Optional)</p>
          <input 
            type="datetime-local" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full h-[48px] px-4 rounded-2xl border text-[11px] font-black outline-none transition-all uppercase ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500 [color-scheme:dark]' : 'bg-slate-50/50 border-slate-200 text-slate-600 focus:ring-2 focus:ring-blue-100'}`}
          />
        </div>

        <div>
          <button 
            onClick={handleAnalyze}
            disabled={loading} 
            className={`w-full h-[48px] flex items-center justify-center gap-2 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
              loading 
                ? (isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-300 text-slate-500 cursor-not-allowed')
                : 'text-white hover:opacity-90'
            }`}
            style={!loading ? { backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` } : {}}
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {loading ? 'Fetching DB...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      {/* --- VISUALIZATION MATRIX --- */}
      <div className={`p-8 rounded-[32px] border shadow-sm transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                <TrendingUp className="w-6 h-6" />
             </div>
             <div>
                <h2 className={`text-xl font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Signal Availability Map</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Target: {targetNodes.length > 0 ? targetNodes.join(', ') : 'UNSELECTED'} | Routes: {selectedRoutes.length}
                </p>
             </div>
          </div>
          
          <div className="flex items-center gap-4 h-[48px]">
             <div className={`px-6 py-2 h-full flex flex-col justify-center rounded-2xl border text-center shadow-inner min-w-[150px] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-[#F8FAFC] border-slate-100'}`}>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aggregate Uptime</p>
               <p className="text-xl font-black tracking-tighter leading-tight" style={{ color: primaryColor }}>{aggregateUptime}</p>
             </div>

             <button 
               onClick={generatePDF}
               disabled={isDownloading}
               className="flex items-center justify-center gap-2 px-5 min-w-[170px] h-full bg-emerald-500/10 text-emerald-500 rounded-2xl text-[10px] font-black border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
             >
               {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
               {isDownloading ? 'GENERATING...' : 'DOWNLOAD REPORT'}
             </button>
          </div>

        </div>

        <div ref={chartRef} style={{ width: '100%', height: '350px' }} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/30 border-slate-50'}`}>
          {analyticsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94A3B8'}} dy={10} />
                <YAxis domain={[-10, 110]} hide />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area 
                  type="stepAfter" 
                  dataKey="statusValue" 
                  stroke={primaryColor} 
                  strokeWidth={3} 
                  fillOpacity={0.15} 
                  fill={primaryColor} 
                  isAnimationActive={false} 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <Activity className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest">Awaiting Analysis</p>
              <p className="text-[10px] font-bold mt-1">Select fields and run analysis to fetch data.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- LOG DATA TABLE --- */}
      <div className={`rounded-[32px] border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className={`p-6 border-b flex items-center gap-3 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-50 bg-slate-50/30'}`}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
            <List className="w-4 h-4" style={{ color: primaryColor }} />
          </div>
          <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Temporal Log Data</h3>
        </div>

        <div className="px-8 pb-8 pt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${isDarkMode ? 'text-slate-500 border-slate-700' : 'text-slate-400 border-slate-50'}`}>
                <th className="text-left py-4">Timestamp</th>
                <th className="text-left py-4">Route Info</th>
                <th className="text-center py-4">Boolean Status</th>
                <th className="text-left py-4 pl-8">System Remarks</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
              {analyticsData.length > 0 ? analyticsData.map((log, i) => (
                <tr key={i} className={`transition-all group ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/50'}`}>
                  <td className="py-4">
                    <span className={`flex items-center gap-2 text-xs font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Clock className="w-3 h-3 text-slate-400" /> {log.time}
                    </span>
                  </td>
                  <td className="py-4 text-left">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase truncate max-w-[200px] ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      <Cpu className="w-3 h-3 mr-1.5 shrink-0" /> {log.nodeName}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${
                      log.status === 'UP' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : 'bg-red-500 text-white shadow-red-500/20'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-4 pl-8">
                    <span className={`text-[10px] font-bold ${log.status === 'DOWN' ? 'text-red-500' : 'text-slate-500'}`}>
                      {log.remarks}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Run analysis to generate logs
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SignalAnalytics;