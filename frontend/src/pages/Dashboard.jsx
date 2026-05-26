import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { 
  RefreshCw, Activity, MapPin, Cpu, Upload, 
  CheckCircle2, ChevronDown, Download, FileText, Check, File, X
} from 'lucide-react';
import { useNotifications } from '../lib/NotificationContext';
import { useData } from '../lib/DataContext';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext'; 

// ==========================================
// === GLOBAL DEBUG CONFIGURATION ===
// ==========================================
const DEBUG = true; // Set to false in production

const log = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

// === CONSTANTS & SECURE CONFIG ===
const DEFAULT_PROJECT = "combined"; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// DEFAULT FALLBACK DEVICE OPTIONS
const DEVICE_OPTIONS = [
  "GATEWAY_IP", "GATEWAY", "DNS_IP", "ALTERNATE_DNS", 
  "UPS1_SNMP_IP", "UPS2_SNMP_IP", "SMART_PDU_IP", "SMART_PDU2_IP", 
  "SWITCH_IP", "SWITCH_LHS", "SVD_LHS", "VIDS_LHS_1", "VIDS_LHS_2", 
  "VIDS_LHS_3", "OVC_LHS", "SECURITY_CAM", "RADAR_LHS", "MINI_PC_LHS", 
  "LPU_LHS", "SWITCH_RHS", "SVD_RHS", "VIDS_RHS_1", "VIDS_RHS_2", 
  "VIDS_RHS_3", "OVC_RHS", "RADAR_RHS", "MINI_PC_RHS", "LPU_RHS"
];

const Dashboard = () => {
  // === CONTEXT & HOOKS ===
  const { syncNotifications } = useNotifications();
  const { primaryColor, isDarkMode } = useTheme(); 
  const { authUser } = useAuth(); 
  
  const {
    isAutoMode, setIsAutoMode,
    selectedFile, setSelectedFile,
    activeFilters, setActiveFilters,
    excelRawData, setExcelRawData,
    networkData, setNetworkData,
    archives, setArchives,
    searchQuery
  } = useData();

  // === LOCAL STATE ===
  const [loading, setLoading] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState(null);
  
  // DYNAMIC PROTOCOLS/NODES STATE
  const [protocolOptions, setProtocolOptions] = useState(DEVICE_OPTIONS);
  const [isLoadingProtocols, setIsLoadingProtocols] = useState(true);

  // === REFS ===
  const filterRef = useRef(null);

  // === LIFECYCLE EFFECTS ===
  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/filters/${DEFAULT_PROJECT}/devices`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        
        if (response.ok) {
          const data = await response.json();
          if(data && data.length > 0) {
            setProtocolOptions(data); 
          }
        }
      } catch (error) {
        console.error("Failed to fetch dynamic nodes/protocols:", error);
      } finally {
        setIsLoadingProtocols(false);
      }
    };
    fetchProtocols();
  }, []);

  useEffect(() => {
    if (archives.length === 0) {
      const mockArchives = Array.from({ length: 5 }, (_, i) => ({
        id: `mock-${i}`,
        name: `NOC_System_Log_May_${21 - i}_2026.pdf`,
        size: `${(Math.random() * 2 + 1).toFixed(1)}MB`,
        date: `${21 - i} May 2026`,
        blobUrl: null 
      }));
      setArchives(mockArchives);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === EVENT HANDLERS ===
  const handleFileUpload = async (e) => {
    log("==================================");
    log("📂 FILE UPLOAD STARTED");
    log("==================================");
    
    const file = e.target.files[0];
    if (!file) {
      log("❌ No file selected");
      return;
    }

    log("✅ File Selected");
    log("📄 File Name:", file.name);
    log("📦 File Size:", file.size);
    log("🕒 Upload Time:", new Date().toLocaleString());
    
    setSelectedFile(file);
    setNetworkData([]);
    syncNotifications([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      log("==================================");
      log("📊 EXCEL PARSING STARTED");
      log("==================================");

      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      
      log("✅ Excel Parsed Successfully");
      log("📈 Total Rows Found:", data.length);
      log("🧪 First Row Sample:", data[0]);
      log("🧪 Last Row Sample:", data[data.length - 1]);

      const formattedData = data.map((item, index) => ({
        id: `excel-node-${index}`, 
        slNo: index + 1,
        stretch: item.Stretch || item.STRETCH || "UNKNOWN STRETCH",
        location: item.Location || item.LOCATION || "UNKNOWN LOCATION",
        tag: item.Tag || item.TAG || "N/A",
        status: "PENDING",
        failedList: [],
        remarks: "Excel loaded, ready for Ping execution..."
      }));
      
      log("✅ Data Formatting Complete");
      log("📊 Formatted Rows:", formattedData.length);
      log("🧪 First Formatted Row:", formattedData[0]);

      setExcelRawData(formattedData);
      setNetworkData([]); 
    };
    reader.readAsBinaryString(file);
  };

  const executePing = async () => {
    log("==================================");
    log("🚀 EXECUTE PING STARTED");
    log("==================================");
    
    setLoading(true);
    log("⏳ Loading State Enabled");

    try {
      const token = localStorage.getItem("token");
      log("⚙️ Current Mode:", isAutoMode ? "AUTO MODE" : "EXCEL MODE");

      // ===============================
      // AUTO MODE OFF → EXCEL FLOW
      // ===============================
      if (!isAutoMode) {
        log("==================================");
        log("📁 EXCEL MODE EXECUTION");
        log("==================================");

        if (!selectedFile) {
          alert("Please upload Excel file");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        log("📡 Sending Excel File To Backend");
        log("🌐 API URL:", `${API_BASE_URL}/api/monitor/${DEFAULT_PROJECT}/process`);
        log("📄 File Being Sent:", selectedFile?.name);

        const response = await fetch(
          `${API_BASE_URL}/api/monitor/${DEFAULT_PROJECT}/process`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
          }
        );

        if (!response.ok) throw new Error("Excel Monitoring Failed");

        const result = await response.json();
        log("✅ Backend Response Received");
        log("📦 Full Response:", result);

        const rawData = result.data?.results || [];
        log("📊 Raw Result Count:", rawData.length);

        const fetchedData = rawData.map((item, index) => {
          const failedList = item.failedDevices || item.failed_devices || [];
          return {
            id: index,
            slNo: index + 1,
            stretch: item.stretch || "N/A",
            location: item.location || "N/A",
            tag: item.device || item.tag || "N/A",
            status: item.current_status || item.status || "UNKNOWN",
            failedList: failedList,
            remarks: failedList.length > 0 
              ? failedList.map(d => `${d} : DOWN`).join('\n') 
              : (item.remark || item.message || "All Devices Online")
          };
        });

        log("✅ Frontend Mapping Complete");
        log("📊 Final Table Data Count:", fetchedData.length);

        setNetworkData(fetchedData);
        log("✅ Table State Updated");
        log("🖥️ Rows Rendered To UI:", fetchedData.length);
      }

      // ===============================
      // AUTO MODE ON → DATABASE FLOW
      // ===============================
      else {
        log("==================================");
        log("🤖 AUTO MODE EXECUTION");
        log("==================================");
        log("📡 Fetching Database Monitoring Data");
        log("🌐 API URL:", `${API_BASE_URL}/api/monitor/${DEFAULT_PROJECT}/run`);

        const response = await fetch(
          `${API_BASE_URL}/api/monitor/${DEFAULT_PROJECT}/run`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!response.ok) throw new Error("Database Monitoring Failed");

        const result = await response.json();
        log("✅ Backend Response Received");
        log("📦 Full Response:", result);

        const rawData = result.data?.results || [];
        log("📊 Raw Result Count:", rawData.length);

        const fetchedData = rawData.map((item, index) => {
          const failedList = item.failedDevices || item.failed_devices || [];
          return {
            id: index,
            slNo: index + 1,
            stretch: item.stretch || "N/A",
            location: item.location || "N/A",
            tag: item.device || item.tag || "N/A",
            status: item.current_status || item.status || "UNKNOWN",
            failedList: failedList,
            remarks: failedList.length > 0 
              ? failedList.map(d => `${d} : DOWN`).join('\n') 
              : (item.remark || item.message || "All Devices Online")
          };
        });

        log("✅ Frontend Mapping Complete");
        log("📊 Final Table Data Count:", fetchedData.length);

        setNetworkData(fetchedData);
        log("✅ Table State Updated");
        log("🖥️ Rows Rendered To UI:", fetchedData.length);
      }

    } catch (error) {
      log("==================================");
      log("❌ EXECUTION FAILED");
      log("==================================");
      console.error("🔥 Monitoring Error:", error);
      log("📛 Error Message:", error.message);
      
      alert("Monitoring execution failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleProtocol = (protocol, e) => {
    e.stopPropagation();
    log("🎯 Filter Clicked:", protocol);
    
    if (activeFilters.includes(protocol)) {
      setActiveFilters(activeFilters.filter(p => p !== protocol));
    } else {
      setActiveFilters([...activeFilters, protocol]);
    }
  };

  // === DATA PROCESSING ===
  const displayedData = useMemo(() => {
    log("📺 Recalculating Displayed Data");
    let filtered = networkData;

    if (activeFilters.length > 0) {
      filtered = filtered.filter(node => 
        activeFilters.some(filter => 
          (node.tag && node.tag.toUpperCase() === filter.toUpperCase()) || 
          (node.remarks && node.remarks.toUpperCase().includes(filter.toUpperCase()))
        )
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(node =>
        (node.stretch && node.stretch.toLowerCase().includes(query)) ||
        (node.location && node.location.toLowerCase().includes(query)) ||
        (node.tag && node.tag.toLowerCase().includes(query)) ||
        (node.status && node.status.toLowerCase().includes(query))
      );
    }

    log("📊 Final Displayed Rows:", filtered.length);
    return filtered;
  }, [networkData, searchQuery, activeFilters]);

  useEffect(() => {
    if (networkData.length > 0 && networkData[0].status !== 'PENDING') {
      syncNotifications(displayedData);
    } else if (networkData.length === 0) {
      syncNotifications([]); 
    }
  }, [displayedData]);

  // === REPORT GENERATION (PDF) ===
  const generatePDF = () => {
    if (displayedData.length === 0 || (displayedData[0] && displayedData[0].status === 'PENDING')) {
      alert("No Data Available: Please execute a ping or perform a valid search to populate the matrix before generating a report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(0, 82, 255); 
    doc.text("NOC Intelligence Report", 14, 22);
    
    let filterText = 'ALL NODES';
    if (activeFilters.length > 0) {
      filterText = activeFilters.length > 3 ? `${activeFilters.slice(0, 3).join(', ')} +${activeFilters.length - 3} more` : activeFilters.join(', ');
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Active Filters: ${filterText} | Search: ${searchQuery || 'None'}`, 14, 35);
    doc.text(`Total Nodes Analyzed: ${displayedData.length}`, 14, 40);

    // EXACT PDF FORMAT HEADINGS
    const tableColumn = ["Sl No", "Stretch Name", "Tag Id", "Location", "Location Status", "Individual IPs Status"];
    const tableRows = [];

    displayedData.forEach((node, i) => {
      // Setup the Individual IPs formatting (New Line Separated just like PDF)
      const individualIpsText = node.failedList && node.failedList.length > 0
        ? node.failedList.map(d => `${d} : DOWN`).join('\n')
        : node.remarks;

      tableRows.push([
        (i + 1).toString(),
        node.stretch, 
        node.tag, 
        node.location, 
        node.status, 
        individualIpsText
      ]);
    });

    autoTable(doc, {
      startY: 48,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [0, 82, 255], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        // Ensure that newlines render correctly as block text for IPs
        5: { cellWidth: 'auto', whiteSpace: 'pre-line' } 
      },
      didParseCell: function(data) {
        // Location Status Column (Index 4)
        if (data.section === 'body' && data.column.index === 4) {
          if (data.cell.raw === 'UP') {
            data.cell.styles.textColor = [5, 150, 105]; 
            data.cell.styles.fontStyle = 'bold';
          } else if (data.cell.raw === 'DOWN' || data.cell.raw === 'CRITICAL FAIL' || data.cell.raw === 'PARTIAL') {
            data.cell.styles.textColor = [239, 68, 68]; 
            data.cell.styles.fontStyle = 'bold';
          }
        }
        // Individual IPs Status Column (Index 5)
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw.includes('DOWN')) {
            data.cell.styles.textColor = [239, 68, 68]; // Highlight Failed IP strings
          }
        }
      }
    });

    const fileName = `Network_Device_Ping_Report_${new Date().getTime()}.pdf`;
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    doc.save(fileName);

    const newArchive = {
      id: Date.now(),
      name: fileName,
      size: `${(pdfBlob.size / 1024).toFixed(1)}KB`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      blobUrl: pdfUrl 
    };
    
    setArchives([newArchive, ...archives].slice(0, 10)); 
  };

  const handleDownloadPreview = () => {
    if (previewReport?.blobUrl) {
      const link = document.createElement('a');
      link.href = previewReport.blobUrl;
      link.download = previewReport.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Trigger Backend Download: The mock file requires a backend stream for download.");
    }
  };

  // === UI RENDER ===
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 relative">
      
      {/* --- CONTROL PANEL --- */}
      <div className={`p-6 rounded-[24px] border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Input Dataset</p>
          {isAutoMode ? (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 transition-all">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-tight">Database Linked</span>
            </div>
          ) : (
            <label 
              className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 border-dashed cursor-pointer transition-all group overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-300' : 'bg-blue-50/50 border-blue-200 hover:bg-blue-50'}`}
              style={!isDarkMode ? { color: primaryColor } : {}}
            >
              <Upload className="w-5 h-5 shrink-0 group-hover:-translate-y-1 transition-transform" />
              <span className="text-xs font-black truncate">
                {selectedFile ? selectedFile.name : "UPLOAD EXCEL"}
              </span>
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx, .xls" />
            </label>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Watch Engine</p>
          <div className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
            <div className={`flex items-center gap-2 text-xs font-black uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <RefreshCw className={`w-4 h-4 ${isAutoMode ? 'animate-spin' : 'text-slate-400'}`} style={isAutoMode ? { color: primaryColor } : {}} />
              Auto Sync
            </div>
            <div 
              onClick={() => {
                log("==================================");
                log("🔄 TOGGLE SWITCH CLICKED");
                log("==================================");
                
                const nextMode = !isAutoMode;
                log("⚙️ Previous Mode:", isAutoMode ? "AUTO" : "EXCEL");
                log("⚙️ New Mode:", nextMode ? "AUTO" : "EXCEL");

                setIsAutoMode(nextMode);
                setNetworkData([]);
                setActiveFilters([]);
                syncNotifications([]);

                if (nextMode) {
                  setSelectedFile(null);
                  setExcelRawData([]);
                }
              }}
              className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 shadow-inner ${isAutoMode ? '' : 'bg-slate-300'}`}
              style={isAutoMode ? { backgroundColor: primaryColor } : {}}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${isAutoMode ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        </div>

        <div className="space-y-2 relative" ref={filterRef}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Device Filter</p>
          <div 
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)} 
            className={`w-full h-[48px] px-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between relative ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50/50 border-slate-200 text-slate-600'}`}
          >
            <span className="text-[11px] font-black uppercase truncate pr-4">
              {isLoadingProtocols ? 'LOADING...' : (activeFilters.length === 0 ? 'ALL DEVICES' : `${activeFilters.length} SELECTED`)}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {isFilterDropdownOpen && !isLoadingProtocols && (
            <div 
              className={`absolute top-[calc(100%+8px)] left-0 w-full rounded-2xl shadow-2xl z-50 py-2 border flex flex-col animate-in fade-in slide-in-from-top-2 overflow-y-auto ${isDarkMode ? 'bg-[#18181b] border-slate-800' : 'bg-white border-slate-100'}`}
              style={{ maxHeight: '300px' }} 
            >
              <div 
                onClick={(e) => { e.stopPropagation(); setActiveFilters([]); }}
                className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors border-b sticky top-0 z-10 ${isDarkMode ? 'hover:bg-slate-800/50 border-slate-700/50 bg-[#18181b]' : 'hover:bg-slate-50 border-slate-100 bg-white'}`}
              >
                <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-all ${activeFilters.length === 0 ? 'border-transparent' : isDarkMode ? 'border-slate-600' : 'border-slate-300'}`} style={activeFilters.length === 0 ? { backgroundColor: primaryColor } : {}}>
                  {activeFilters.length === 0 && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-[11px] font-black uppercase tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  ALL DEVICES
                </span>
              </div>
              
              {protocolOptions.map(protocol => {
                const isSelected = activeFilters.includes(protocol);
                return (
                  <div 
                    key={protocol}
                    onClick={(e) => toggleProtocol(protocol, e)}
                    className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-transparent' : isDarkMode ? 'border-slate-600' : 'border-slate-300'}`} style={isSelected ? { backgroundColor: primaryColor } : {}}>
                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {protocol.replace(/_/g, ' ')}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="pt-6">
          <button 
            onClick={executePing}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 h-[48px] rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
              loading 
                ? (isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-300 text-slate-500 cursor-not-allowed') 
                : 'text-white hover:opacity-90'
            }`}
            style={!loading ? { backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` } : {}}
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            {loading ? 'Executing...' : 'Execute Ping'}
          </button>
        </div>
      </div>

      {/* --- SURVEILLANCE MATRIX --- */}
      <div className={`rounded-[32px] border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className={`p-8 flex justify-between items-center border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-50/50'}`}>
          <div className="border-l-4 pl-4" style={{ borderColor: primaryColor }}>
            <h2 className={`text-xl font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Surveillance Matrix</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Node Architecture Status</p>
          </div>
          
          <button 
            onClick={generatePDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs font-black border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" /> GENERATE NOC REPORT
          </button>
        </div>

        <div className="overflow-auto max-h-[500px] w-full px-8 pb-8 custom-scrollbar">
          <table className="w-full relative">
            <thead className="sticky top-0 z-10 shadow-sm">
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${isDarkMode ? 'bg-[#1E293B] text-slate-400 border-slate-700' : 'bg-white text-slate-400 border-slate-50'}`}>
                {/* PDF Mapped Headings */}
                <th className={`text-center py-4 ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>Sl No</th>
                <th className={`text-left py-4 pl-4 ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>Stretch Name</th>
                <th className={`text-center py-4 ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>Tag Id</th>
                <th className={`text-left py-4 pl-4 ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>Location</th>
                <th className={`text-center py-4 ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>Location Status</th>
                <th className={`text-left py-4 pl-8 ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>Individual IPs Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
              {displayedData.length > 0 ? displayedData.map((node, i) => (
                <tr key={i} className={`transition-all group ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/50'}`}>
                  <td className="py-4 text-center">
                    <span className={`text-xs font-black ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{node.slNo}</span>
                  </td>
                  <td className="py-4 pl-4">
                    <span className={`text-xs font-black uppercase ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{node.stretch}</span>
                  </td>
                  <td className="py-4 text-center">
                    <span 
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'border-blue-100/50'}`}
                      style={!isDarkMode ? { backgroundColor: `${primaryColor}15`, color: primaryColor } : {}}
                    >
                      <Cpu className="w-3 h-3 mr-1.5" /> {node.tag}
                    </span>
                  </td>
                  <td className="py-4 pl-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold max-w-[200px] truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {node.location}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      node.status === 'UP' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : node.status === 'PENDING' ? (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400') : 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    }`}>
                      {node.status}
                    </span>
                  </td>
                  <td className="py-4 pl-8" title={node.remarks}>
                    {/* Maps Offline Devices Line-by-Line just like PDF Requirements */}
                    <div className={`w-full max-w-[350px] rounded-xl py-2 px-4 border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 group-hover:bg-slate-700' : 'bg-slate-50 border-slate-100 group-hover:bg-white'}`}>
                      {node.failedList && node.failedList.length > 0 ? (
                         <ul className="text-[10px] font-bold text-red-500 list-none space-y-1">
                           {node.failedList.map((failedItem, fIdx) => (
                             <li key={fIdx} className="truncate break-words">{failedItem} : DOWN</li>
                           ))}
                         </ul>
                      ) : (
                         <span className={`text-[10px] font-bold ${node.status === 'DOWN' || node.status === 'CRITICAL FAIL' ? 'text-red-500' : 'text-slate-500'}`}>
                           {node.remarks}
                         </span>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                       <Activity className="w-10 h-10 mb-3 opacity-20" />
                       <p className="font-black uppercase tracking-widest text-xs">No Data Loaded Yet</p>
                       <p className="text-[10px] mt-1 font-bold">Please upload an Excel file and click 'Execute Ping' to populate the matrix.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ADMIN ONLY SECTION ================= */}
      {authUser?.role === 'ADMIN' && (
        <>
          <div className={`rounded-[32px] border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`p-6 border-b flex items-center gap-3 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-50 bg-slate-50/30'}`}>
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
                 <FileText className="w-4 h-4" style={{ color: primaryColor }} />
              </div>
              <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Recent NOC Archives (Top 10)</h3>
            </div>
            
            <div className="p-2">
              {archives.length > 0 ? archives.map((report, idx) => (
                <div 
                  key={report.id} 
                  onClick={() => setPreviewReport(report)}
                  className={`flex items-center justify-between p-4 mx-2 my-1 rounded-2xl cursor-pointer transition-all ${isDarkMode ? 'hover:bg-slate-800/80' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <p className={`text-xs font-black tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {(idx + 1).toString().padStart(2, '0')}
                    </p>
                    <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                      <File className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {report.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {report.date}
                    </p>
                    <p className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {report.size}
                    </p>
                  </div>
                </div>
              )) : (
                 <p className="text-xs font-bold text-slate-400 italic py-8 text-center">No archived reports available.</p>
              )}
            </div>
          </div>

          {previewReport && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
              <div className={`w-full max-w-5xl h-full md:h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {previewReport.name}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Document Preview Mode</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleDownloadPreview}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-md active:scale-95"
                    >
                      <Download className="w-4 h-4" /> Download File
                    </button>
                    <div className={`h-6 w-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <button 
                      onClick={() => setPreviewReport(null)}
                      className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-black'}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className={`flex-1 flex flex-col items-center justify-center p-4 md:p-8 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-slate-100'}`}>
                   {previewReport.blobUrl ? (
                     <iframe 
                       src={`${previewReport.blobUrl}#toolbar=0`} 
                       className="w-full h-full rounded-xl shadow-sm border-none bg-white" 
                       title="PDF Preview" 
                     />
                   ) : (
                     <div className={`w-full max-w-2xl h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-white/50'}`}>
                        <File className="w-16 h-16 text-slate-300 mb-4" />
                        <h2 className={`text-lg font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Preview Container
                        </h2>
                        <p className="text-xs font-bold text-slate-400 max-w-md mt-2">
                          When the backend API is integrated, the file stream or Blob URL generated from the database will be rendered directly inside this frame.
                        </p>
                     </div>
                   )}
                </div>
              </div>
            </div>,
            document.body 
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;