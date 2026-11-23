import { useState } from "react";
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  Copy, 
  Check, 
  Terminal, 
  Bot, 
  Search, 
  Play, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  FileDown, 
  Globe, 
  Sparkles,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WORKSPACE_FILES, ProjectFile, SIMULATION_TEMPLATES, MarketSimulationResult } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState<"workspace" | "architecture" | "simulation">("workspace");
  const [selectedFileKey, setSelectedFileKey] = useState<string>("main.py");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Simulation States
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("superfood");
  const [customCopy, setCustomCopy] = useState("");
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(["India", "Japan", "South Korea", "USA"]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [showSimResults, setShowSimResults] = useState(false);
  const [simulationResults, setSimulationResults] = useState<Record<string, MarketSimulationResult> | null>(null);
  const [advisoryReport, setAdvisoryReport] = useState<string>("");

  // Feature 1 — Custom Market Selector
  const [newMarketInput, setNewMarketInput] = useState("");
  // Feature 2 — Content Type Selector
  const [contentType, setContentType] = useState("📱 Social Media Caption");
  // Feature 3 — Copy/Download state
  const [copiedReport, setCopiedReport] = useState(false);

  const FLAGS_MAP: Record<string, string> = {
    "India": "🇮🇳",
    "Japan": "🇯🇵",
    "South Korea": "🇰🇷",
    "USA": "🇺🇸",
    "United States": "🇺🇸",
    "France": "🇫🇷",
    "Germany": "🇩🇪",
    "United Kingdom": "🇬🇧",
    "UK": "🇬🇧",
    "Canada": "🇨🇦",
    "Australia": "🇦🇺",
    "Brazil": "🇧🇷",
    "Mexico": "🇲🇽",
    "Singapore": "🇸🇬",
    "Spain": "🇪🇸",
    "Italy": "🇮🇹",
    "China": "🇨🇳",
    "Japan 🇯🇵": "🇯🇵",
    "India 🇮🇳": "🇮🇳",
    "South Korea 🇰🇷": "🇰🇷",
    "USA 🇺🇸": "🇺🇸"
  };

  const getFlag = (market: string) => {
    return FLAGS_MAP[market] || "🌍";
  };

  const CONTENT_TYPES = [
    "📱 Social Media Caption",
    "🏷️ Product Tagline",
    "📢 Ad Campaign",
    "📧 Email Subject Line",
    "🎯 Brand Name"
  ];

  const handleAddMarket = () => {
    const trimmed = newMarketInput.trim();
    if (!trimmed) return;
    if (selectedMarkets.length >= 8) {
      alert("Maximum of 8 markets allowed total.");
      return;
    }
    const exists = selectedMarkets.some(m => m.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert("Market is already in selected locales.");
      return;
    }
    // Capitalize words
    const formatted = trimmed.split(" ").map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(" ");
    setSelectedMarkets([...selectedMarkets, formatted]);
    setNewMarketInput("");
  };

  const handleCopyReport = (reportText: string) => {
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadReport = (reportText: string) => {
    const element = document.createElement("a");
    const file = new Blob([reportText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "rasa-report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // File explorer tree state
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    root: true,
    agents: true,
    tools: true,
    prompts: true,
    config: true
  });

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Syntax highlighter (lightweight client-side tokenizer)
  const renderHighlightedCode = (file: ProjectFile) => {
    const lines = file.content.split("\n");
    return lines.map((line, idx) => {
      // Very simple parsing for highlighting
      let renderedLine = line;
      
      if (file.language === "python") {
        // Highlight import
        if (line.match(/^\s*(import|from)\b/)) {
          renderedLine = line
            .replace(/\b(import|from|as)\b/g, '<span class="text-pink-400 font-semibold">$1</span>')
            .replace(/\b(google_adk|config\.settings|agents\.[a-z_]+|tools\.[a-z_]+)\b/g, '<span class="text-teal-300">$1</span>');
        }
        // Highlight keywords
        else if (line.match(/\b(def|class|return|if|for|in|not|and|try|except|print)\b/)) {
          renderedLine = line.replace(/\b(def|class|return|if|for|in|not|and|try|except)\b/g, '<span class="text-amber-400 font-medium">$1</span>');
        }
        
        // Highlight self and double underscores
        renderedLine = renderedLine
          .replace(/\b(self)\b/g, '<span class="text-amber-200 italic">$1</span>')
          .replace(/\b(__init__|__all__)\b/g, '<span class="text-blue-300 font-semibold">$1</span>');

        // Highlight comments
        if (line && typeof line === "string" && line.includes("#")) {
          const parts = line.split("#");
          renderedLine = parts[0] + '<span class="text-slate-500 italic">#' + parts.slice(1).join("#") + "</span>";
        } else if (line && typeof line === "string" && (line.trim().startsWith('"""') || line.trim().startsWith('r"""') || line.trim().endsWith('"""'))) {
          renderedLine = `<span class="text-emerald-500 italic">${line}</span>`;
        }
        
        // Highlight string literals
        if (line && typeof line === "string" && line.includes('"') && !line.includes('#')) {
          renderedLine = renderedLine.replace(/(["'])(.*?)\1/g, '<span class="text-yellow-100 italic">$1$2$1</span>');
        }
      } 
      else if (file.language === "env") {
        if (line && typeof line === "string" && line.startsWith("#")) {
          renderedLine = `<span class="text-slate-500 italic">${line}</span>`;
        } else if (line && typeof line === "string" && line.includes("=")) {
          const parts = line.split("=");
          renderedLine = `<span class="text-teal-400 font-medium">${parts[0]}</span>=<span class="text-yellow-100 italic">${parts.slice(1).join("=")}</span>`;
        }
      } 
      else if (file.language === "markdown") {
        if (line.startsWith("#")) {
          renderedLine = `<span class="text-pink-400 font-bold">${line}</span>`;
        } else if (line.startsWith("##")) {
          renderedLine = `<span class="text-teal-300 font-semibold">${line}</span>`;
        } else if (line.startsWith("-") || line.startsWith("*")) {
          renderedLine = `<span class="text-amber-300">${line}</span>`;
        }
      }

      return (
        <div key={idx} className="flex code-line py-0.5 px-4 font-mono text-sm leading-relaxed">
          <span className="w-10 text-slate-600 select-none text-right pr-4 border-r border-slate-800 mr-4 font-mono text-xs pt-0.5">{idx + 1}</span>
          <span className="text-slate-300 whitespace-pre" dangerouslySetInnerHTML={{ __html: renderedLine || "&nbsp;" }} />
        </div>
      );
    });
  };

  // Run simulated agent steps
  const triggerSimulation = async () => {
    setIsSimulating(true);
    setShowSimResults(false);
    setSimulationStep(5);
    setSimulationResults(null);
    setAdvisoryReport("");

    const bootLogs = [
      "[*] Initiating Rasa Agent System on port 3000...",
      "[*] Loading project workspace settings from settings.py...",
      "[*] Locating .env credential files...",
      "[✔] Verified agent configurations. Dispatching pipeline task..."
    ];
    setSimLogs(bootLogs);

    const contentToAnalyze = customCopy || (selectedTemplateKey === "superfood"
      ? "Elevate your morning routine with our superfood latte blend. Brew, energize, conquer."
      : selectedTemplateKey === "ai_assistant"
        ? "Meet your autonomous workspace agent. Deploy intelligence to manage your inbox and run routine tasks."
        : "Make an unapologetic statement. Loud, circular, ethically-tailored streetwear to rule the cityscape.");

    try {
      setSimulationStep(15);
      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: contentToAnalyze,
          markets: selectedMarkets,
          contentType: contentType
        })
      });

      const data = await res.json();
      setSimulationStep(50);

      if (!res.ok || !data.success) {
        const errorLogs = data.logs || [`[❌] Agent execution failed: ${data.error || "Unknown server error."}`];
        setSimLogs(prev => [...prev, ...errorLogs]);
        setIsSimulating(false);
        return;
      }

      const backendLogs = (data.logs || []).filter((l: string) => 
        l && typeof l === "string" && !l.includes("port 3000") && !l.includes("root .env")
      );

      // --- Format the RASA CULTURAL INTELLIGENCE REPORT ---
      const reportLines: string[] = [];
      reportLines.push("🌏 RASA CULTURAL INTELLIGENCE REPORT");
      reportLines.push("=====================================");
      reportLines.push(`Format Archetype: ${contentType}`);
      reportLines.push(`Content: ${contentToAnalyze}`);
      reportLines.push("");

      const marketOrder = ["India", "Japan", "South Korea", "USA"];
      const sortedMarkets = [...selectedMarkets].sort((a, b) => {
        const idxA = marketOrder.indexOf(a);
        const idxB = marketOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      });

      for (const marketName of sortedMarkets) {
        const result: any = (data.results ? data.results[marketName] : null) || (customCopy ? {
          market: marketName,
          flag: getFlag(marketName),
          resonanceScore: 85,
          riskLevel: "Low",
          findings: [],
          warnings: [],
          recommendation: "Safe",
          alternative: contentToAnalyze
        } : (currentTemplate && currentTemplate[marketName] ? currentTemplate[marketName] : {
          market: marketName,
          flag: getFlag(marketName),
          resonanceScore: 82,
          riskLevel: "Low",
          findings: ["Linguistic context aligned with modern usage."],
          warnings: [],
          alternative: contentToAnalyze,
          recommendation: "Safe"
        })) || {
          market: marketName,
          flag: getFlag(marketName),
          resonanceScore: 82,
          riskLevel: "Low",
          findings: ["Linguistic context aligned with modern usage."],
          warnings: [],
          alternative: contentToAnalyze,
          recommendation: "Safe"
        };

        // Compute Risk Score
        let riskScore = 15;
        if (result.riskLevel === "Medium") {
          riskScore = 45;
        } else if (result.riskLevel === "High") {
          riskScore = 80;
        }
        if (result.resonanceScore) {
          if (result.riskLevel === "Low") {
            riskScore = Math.max(10, Math.min(25, 100 - result.resonanceScore));
          } else if (result.riskLevel === "Medium") {
            riskScore = Math.max(35, Math.min(55, 110 - result.resonanceScore));
          } else if (result.riskLevel === "High") {
            riskScore = Math.max(70, Math.min(95, 140 - result.resonanceScore));
          }
        }

        // Determine Verdict
        let verdict = "✅ SAFE";
        if (result.riskLevel === "Medium" || (result.recommendation && result.recommendation.toLowerCase().includes("caution"))) {
          verdict = "⚠️ CAUTION";
        } else if (result.riskLevel === "High" || (result.recommendation && result.recommendation.toLowerCase().includes("avoid"))) {
          verdict = "⛔ AVOID";
        }

        // Determine Reason
        let reason = "";
        if (result.recommendation) {
          if (result.recommendation.includes(":")) {
            reason = result.recommendation.split(":").slice(1).join(":").trim();
          } else {
            reason = result.recommendation;
          }
        }
        if (!reason && result.findings && result.findings.length > 0) {
          reason = result.findings[0];
        }
        if (!reason) {
          reason = "Solid contextual pacing. Clear to coordinate scheduling plans.";
        }

        reportLines.push(`${result.flag || "🏳️"} ${marketName.toUpperCase()}`);
        reportLines.push(`Resonance Score: ${result.resonanceScore || 80}/100`);
        reportLines.push(`Risk Score: ${riskScore}/100`);
        reportLines.push(`Verdict: ${verdict}`);
        reportLines.push(`Reason: ${reason}`);
        reportLines.push("");
      }

      // Compute general summary for final recommendation
      let totalResonance = 0;
      let worstRisk = "Low";
      for (const m of sortedMarkets) {
        const result = (data.results ? data.results[m] : null) || (customCopy ? { riskLevel: "Low", resonanceScore: 85 } : currentTemplate[m]) || { riskLevel: "Low", resonanceScore: 85 };
        totalResonance += result.resonanceScore || 82;
        if (result.riskLevel === "High") {
          worstRisk = "High";
        } else if (result.riskLevel === "Medium" && worstRisk !== "High") {
          worstRisk = "Medium";
        }
      }
      const avgResonance = Math.round(totalResonance / (sortedMarkets.length || 1));

      let finalRecStr = "";
      if (worstRisk === "High") {
        finalRecStr = `The copy carries high cultural friction in certain regions. Re-evaluating phrasing and using localized alternatives is strongly advised.`;
      } else if (worstRisk === "Medium") {
        finalRecStr = `Strong overall campaign viability (avg: ${avgResonance}/100). Apply slight adjustments in caution markets for perfect localization.`;
      } else {
        finalRecStr = `Outstanding worldwide campaign alignment (avg: ${avgResonance}/100) and minor cultural risks. Safe to distribute content immediately.`;
      }

      reportLines.push("💡 FINAL RECOMMENDATION:");
      reportLines.push(finalRecStr);
      reportLines.push("=====================================");

      let currentLogIdx = 0;
      setSimulationStep(60);
      const logInterval = setInterval(() => {
        if (currentLogIdx < backendLogs.length) {
          setSimLogs(prev => [...prev, backendLogs[currentLogIdx]]);
          currentLogIdx++;
          const progress = 60 + Math.round((currentLogIdx / backendLogs.length) * 20);
          setSimulationStep(progress);
        } else {
          clearInterval(logInterval);
          
          // Clear operational logs and stream the final structured report line by line!
          setSimLogs([]);
          let lineIdx = 0;
          const streamInterval = setInterval(() => {
            if (lineIdx < reportLines.length) {
              setSimLogs(prev => [...prev, reportLines[lineIdx]]);
              lineIdx++;
              const progress = 80 + Math.round((lineIdx / reportLines.length) * 20);
              setSimulationStep(Math.min(100, progress));
            } else {
              clearInterval(streamInterval);
              setSimulationStep(100);
              setSimulationResults(data.results);
              setAdvisoryReport(data.advisoryReport || "");
              setTimeout(() => {
                setIsSimulating(false);
                setShowSimResults(true);
              }, 300);
            }
          }, 80);
        }
      }, 100);

    } catch (err: any) {
      console.error(err);
      setSimLogs(prev => [
        ...prev,
        `[❌] Connection exception: ${err.message || err}`,
        "[❌] Please check that the backend dev server is active and running on port 3000."
      ]);
      setIsSimulating(false);
    }
  };

  const currentTemplate = SIMULATION_TEMPLATES[selectedTemplateKey];
  const activeFile = WORKSPACE_FILES[selectedFileKey];

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 flex flex-col font-sans bg-dot-matrix select-none">
      
      {/* Upper Navigation Header */}
      <header className="border-b border-zinc-800 bg-[#0c0d10] sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-zinc-900 border-2 border-zinc-700/80 rounded-none flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(20,184,166,0.25)]">
            <Bot className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white font-display uppercase">RASA</h1>
              <span className="px-2 py-0.5 rounded-none text-[9px] bg-teal-950/80 text-teal-300 font-mono font-medium border border-teal-800/80 uppercase tracking-widest">SKELETON ACTIVE</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">Cultural Intelligence Agent Project Workspace</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex bg-zinc-950 p-1 rounded-none border-2 border-zinc-800 divide-x divide-zinc-800">
          <button 
            onClick={() => setActiveTab("workspace")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-semibold tracking-wider font-display uppercase transition-all duration-150 ${
              activeTab === "workspace" 
                ? "bg-teal-500 text-zinc-950 font-bold" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Folder className="h-3.5 w-3.5" />
            Workspace Files
          </button>
          <button 
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-semibold tracking-wider font-display uppercase transition-all duration-150 ${
              activeTab === "architecture" 
                ? "bg-teal-500 text-zinc-950 font-bold" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            Agent Core Spec
          </button>
          <button 
            onClick={() => setActiveTab("simulation")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-semibold tracking-wider font-display uppercase transition-all duration-150 ${
              activeTab === "simulation" 
                ? "bg-teal-500 text-zinc-950 font-bold" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Run Agent Pipeline
          </button>
        </div>
      </header>

      {/* Main Core Body */}
      <main className="flex-1 flex flex-col xl:flex-row overflow-hidden min-h-0">
        
        {/* Workspace Code Explorer Tab */}
        {activeTab === "workspace" && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Sidebar: VS-Code styled Workspace Tree Explorer */}
            <div className="w-full md:w-80 border-r border-zinc-800 flex flex-col bg-[#0b0c0f] shrink-0">
              <div className="px-5 py-4.5 border-b border-zinc-800 bg-[#0e0f14]/80 flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase font-display">PROJECT FILESYSTEM</span>
                <span className="px-2 py-0.5 rounded-none text-[9px] bg-zinc-900 text-teal-400 font-mono border border-zinc-800">16 ITEMS</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3.5 space-y-1.5 select-none bg-dot-matrix">
                
                {/* Root Directory */}
                <div className="mb-2">
                  <div 
                    onClick={() => toggleFolder("root")}
                    className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-zinc-900 rounded-none cursor-pointer text-zinc-200 font-bold font-display text-[13px] tracking-wide"
                  >
                    {expandedFolders.root ? <FolderOpen className="h-4 w-4 text-teal-400" /> : <Folder className="h-4 w-4 text-teal-400" />}
                    <span>rasa /</span>
                  </div>

                  {expandedFolders.root && (
                    <div className="pl-3.5 space-y-1.5 mt-1 border-l border-zinc-800 ml-4">
                      
                      {/* agents folder */}
                      <div>
                        <div 
                          onClick={() => toggleFolder("agents")}
                          className="flex items-center gap-2 px-2 py-1.5 text-zinc-300 hover:bg-zinc-900 rounded-none cursor-pointer text-xs font-semibold font-display"
                        >
                          {expandedFolders.agents ? <FolderOpen className="h-3.5 w-3.5 text-teal-500" /> : <Folder className="h-3.5 w-3.5 text-teal-500" />}
                          <span>agents /</span>
                        </div>
                        {expandedFolders.agents && (
                          <div className="pl-3.5 mt-1 space-y-1.5 mb-1.5 border-l border-zinc-800 ml-3">
                            <div 
                              onClick={() => setSelectedFileKey("agents_init")}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                                selectedFileKey === "agents_init" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode className="h-3 w-3 shrink-0 text-zinc-600" />
                              <span>__init__.py</span>
                            </div>
                            {["research_agent.py", "analyzer_agent.py", "reporter_agent.py"].map(fn => (
                              <div 
                                key={fn}
                                onClick={() => setSelectedFileKey(fn)}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                                  selectedFileKey === fn ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                                }`}
                              >
                                <FileCode className="h-3 w-3 shrink-0 text-teal-500" />
                                <span>{fn}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* tools folder */}
                      <div>
                        <div 
                          onClick={() => toggleFolder("tools")}
                          className="flex items-center gap-2 px-2 py-1.5 text-zinc-300 hover:bg-zinc-900 rounded-none cursor-pointer text-xs font-semibold font-display"
                        >
                          {expandedFolders.tools ? <FolderOpen className="h-3.5 w-3.5 text-teal-500" /> : <Folder className="h-3.5 w-3.5 text-teal-500" />}
                          <span>tools /</span>
                        </div>
                        {expandedFolders.tools && (
                          <div className="pl-3.5 mt-1 space-y-1.5 mb-1.5 border-l border-zinc-800 ml-3">
                            <div 
                              onClick={() => setSelectedFileKey("tools_init")}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                                selectedFileKey === "tools_init" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode className="h-3 w-3 shrink-0 text-zinc-600" />
                              <span>__init__.py</span>
                            </div>
                            <div 
                              onClick={() => setSelectedFileKey("search_tool.py")}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                                selectedFileKey === "search_tool.py" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode className="h-3 w-3 shrink-0 text-teal-500" />
                              <span>search_tool.py</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* prompts folder */}
                      <div>
                        <div 
                          onClick={() => toggleFolder("prompts")}
                          className="flex items-center gap-2 px-2 py-1.5 text-zinc-300 hover:bg-zinc-900 rounded-none cursor-pointer text-xs font-semibold font-display"
                        >
                          {expandedFolders.prompts ? <FolderOpen className="h-3.5 w-3.5 text-teal-500" /> : <Folder className="h-3.5 w-3.5 text-teal-500" />}
                          <span>prompts /</span>
                        </div>
                        {expandedFolders.prompts && (
                          <div className="pl-3.5 mt-1 space-y-1.5 mb-1.5 border-l border-zinc-800 ml-3">
                            {["research_prompt.txt", "analyzer_prompt.txt", "reporter_prompt.txt"].map(fn => (
                              <div 
                                key={fn}
                                onClick={() => setSelectedFileKey(fn)}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                                  selectedFileKey === fn ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                                }`}
                              >
                                <FileText className="h-3 w-3 shrink-0 text-blue-400" />
                                <span>{fn}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* config folder */}
                      <div>
                        <div 
                          onClick={() => toggleFolder("config")}
                          className="flex items-center gap-2 px-2 py-1.5 text-zinc-300 hover:bg-zinc-900 rounded-none cursor-pointer text-xs font-semibold font-display"
                        >
                          {expandedFolders.config ? <FolderOpen className="h-3.5 w-3.5 text-teal-500" /> : <Folder className="h-3.5 w-3.5 text-teal-500" />}
                          <span>config /</span>
                        </div>
                        {expandedFolders.config && (
                          <div className="pl-3.5 mt-1 space-y-1.5 mb-1.5 border-l border-zinc-800 ml-3">
                            <div 
                              onClick={() => setSelectedFileKey("config_init")}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                                selectedFileKey === "config_init" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode className="h-3 w-3 shrink-0 text-zinc-600" />
                              <span>__init__.py</span>
                            </div>
                            <div 
                              onClick={() => setSelectedFileKey("settings.py")}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                                selectedFileKey === "settings.py" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode className="h-3 w-3 shrink-0 text-teal-500" />
                              <span>settings.py</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Root files */}
                      <div 
                        onClick={() => setSelectedFileKey("main.py")}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                          selectedFileKey === "main.py" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-300 hover:text-zinc-150 hover:bg-zinc-900/40"
                        }`}
                      >
                        <FileCode className="h-3.5 w-3.5 text-teal-400" />
                        <span className="font-semibold">main.py</span>
                      </div>
                      <div 
                        onClick={() => setSelectedFileKey(".env")}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                          selectedFileKey === ".env" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-450 hover:text-zinc-300 hover:bg-zinc-900/40"
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5 text-indigo-400" />
                        <span>.env</span>
                      </div>
                      <div 
                        onClick={() => setSelectedFileKey(".env.example")}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                          selectedFileKey === ".env.example" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-450 hover:text-zinc-300 hover:bg-zinc-900/40"
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5 text-zinc-500" />
                        <span>.env.example</span>
                      </div>
                      <div 
                        onClick={() => setSelectedFileKey("requirements.txt")}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                          selectedFileKey === "requirements.txt" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5 text-rose-400" />
                        <span className="font-semibold">requirements.txt</span>
                      </div>
                      <div 
                        onClick={() => setSelectedFileKey("README.md")}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-none cursor-pointer text-xs font-mono transition-all duration-150 ${
                          selectedFileKey === "README.md" ? "bg-zinc-900 text-teal-400 font-semibold border-l-2 border-teal-500 shadow-[1px_1px_0px_0px_rgba(20,184,166,0.15)]" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="font-semibold">README.md</span>
                      </div>

                    </div>
                  )}
                </div>
              </div>

              {/* Developer commands toolbox helper */}
              <div className="p-4 border-t border-zinc-800 bg-[#0c0d11] space-y-3.5">
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-display">
                  <Terminal className="h-3.5 w-3.5 text-teal-400" />
                  <span>WORKSPACE CONTROLS</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                    This skeleton is fully configured on disk. Deploy it locally using:
                  </p>
                  <div className="bg-zinc-950 p-3 rounded-none border border-zinc-850 font-mono text-[11.5px] text-zinc-300 select-all leading-normal whitespace-pre border-zinc-800">
                    cd rasa{"\n"}pip install -r requirements.txt
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Interactive Code Viewer */}
            <div className="flex-1 flex flex-col bg-[#050608]">
              
              {/* Toolbar metadata */}
              <div className="px-6 py-4.5 border-b border-zinc-805 bg-[#0b0c0f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-teal-400">{activeFile.path}</span>
                    <span className="text-[9px] bg-zinc-900 px-2 py-0.5 rounded-none text-teal-400 border border-zinc-800 font-mono uppercase tracking-widest">{activeFile.language}</span>
                  </div>
                  <h2 className="text-base font-bold text-white font-display uppercase tracking-wide">{activeFile.name}</h2>
                  <p className="text-xs text-zinc-400 max-w-2xl font-sans">{activeFile.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <button 
                    onClick={() => copyToClipboard(activeFile.content, activeFile.name)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-none bg-zinc-900 hover:bg-zinc-850 text-xs font-bold font-display uppercase tracking-wider border-2 border-zinc-800 text-zinc-200 transition-all shadow-[2px_2px_0px_0px_rgba(20,184,166,0.1)] hover:shadow-[3px_3px_0px_0px_rgba(20,184,166,0.3)] hover:border-teal-500"
                  >
                    {copiedKey === activeFile.name ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-display">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Screen panel */}
              <div className="flex-1 overflow-auto bg-[#030406] py-5">
                <div className="min-w-[640px]">
                  {renderHighlightedCode(activeFile)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multi-Agent Architectural Graph Specification Tab */}
        {activeTab === "architecture" && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#07080a] bg-geom-grid">
            <div className="max-w-5xl mx-auto space-y-8">
              
              <div className="space-y-2 border-l-4 border-teal-500 pl-4.5 py-1">
                <h2 className="text-2xl font-bold tracking-wider text-white font-display uppercase">RASA ORCHESTRATION PROTOCOL</h2>
                <p className="text-xs tracking-wide text-zinc-400 uppercase font-mono max-w-3xl leading-relaxed">
                  RASA DECOMPOSES COMPLEX CULTURAL TRANSLATIONS INTO SPECIALIZED WORKSPACE SUB-AGENTS. DECOMPOSING QUERIES ENSURES HIGH RECOVERY ACCURACY, INTENSIFIED RISK VERIFICATION, AND MEETS STRICT GEMINI CONTEXT SAFETY CRITERIA.
                </p>
              </div>

              {/* Graphical Process Map */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center relative p-6 bg-[#0a0b0d] rounded-none border-2 border-zinc-800 shadow-[4px_4px_0px_0px_rgba(20,184,166,0.1)]">
                
                {/* Steps */}
                <div className="lg:col-span-3 bg-[#0e0f13] p-5 rounded-none border-2 border-zinc-800 relative z-10 self-stretch flex flex-col justify-between hover:border-teal-500/80 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                  <div>
                    <span className="px-2.5 py-1 rounded-none text-[8px] bg-zinc-900 text-teal-400 font-mono font-bold border border-zinc-800 uppercase tracking-widest">SYSTEM INPUT</span>
                    <h3 className="text-sm font-bold text-white mt-3 font-display uppercase tracking-wide">1. Input Ingestion</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Accepts the raw creative social captions or product taglines alongside target geographic locales. Loads foundational global configurations.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-zinc-850">
                    <div className="font-mono text-[9px] text-zinc-500 tracking-wider">INPUTS: string, list[market_id]</div>
                  </div>
                </div>

                <div className="lg:col-span-1 flex justify-center text-teal-400 transform rotate-90 lg:rotate-0">
                  <ArrowRight className="h-5 w-5" />
                </div>

                <div className="lg:col-span-4 bg-[#0e0f13] p-5 rounded-none border-2 border-zinc-800 relative z-10 self-stretch flex flex-col justify-between hover:border-teal-500/80 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                  <div>
                    <span className="px-2.5 py-1 rounded-none text-[8px] bg-[#1a1712] text-amber-400 font-mono font-bold border border-amber-900/60 uppercase tracking-widest">AGENT 1 : RESEARCHER</span>
                    <h3 className="text-sm font-bold text-white mt-3 font-display uppercase tracking-wide">2. Context Grounding</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Queries target region linguistic databases, contemporary news boards, and local slang vectors. Isolates historical and conversational double meanings.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-zinc-850">
                    <div className="font-mono text-[9px] text-teal-400/80 tracking-wider">FILE: research_agent.py</div>
                  </div>
                </div>

                <div className="lg:col-span-1 flex justify-center text-teal-400 transform rotate-90 lg:rotate-0">
                  <ArrowRight className="h-5 w-5" />
                </div>

                <div className="lg:col-span-3 bg-[#0e0f13] p-5 rounded-none border-2 border-zinc-800 relative z-10 self-stretch flex flex-col justify-between hover:border-teal-500/80 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                  <div>
                    <span className="px-2.5 py-1 rounded-none text-[8px] bg-[#19131c] text-purple-400 font-mono font-bold border border-purple-900/60 uppercase tracking-widest">AGENT 2 : ANALYZER</span>
                    <h3 className="text-sm font-bold text-white mt-3 font-display uppercase tracking-wide">3. Alignment Audit</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Calculates localized brand resonance ratios, and audits delicate moral, religious, or political taboo factors.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-zinc-850">
                    <div className="font-mono text-[9px] text-teal-400/80 tracking-wider">FILE: analyzer_agent.py</div>
                  </div>
                </div>

                {/* Vertical Bridge Row */}
                <div className="lg:col-span-12 flex justify-center py-2 text-teal-400 transform rotate-90 lg:rotate-0">
                  <ArrowRight className="h-5 w-5 transform rotate-0 lg:rotate-90" />
                </div>

                {/* Final outputs summary */}
                <div className="lg:col-span-3 bg-[#0e0f13] p-5 rounded-none border-2 border-zinc-800 relative z-10 self-stretch flex flex-col justify-between hover:border-teal-500/80 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                  <div>
                    <span className="px-2.5 py-1 rounded-none text-[8px] bg-[#1a1111] text-rose-400 font-mono font-bold border border-rose-900/60 uppercase tracking-widest">SYSTEM REPORT</span>
                    <h3 className="text-sm font-bold text-white mt-3 font-display uppercase tracking-wide">Advisory Output</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Synthesizes action-ready strategic marketing playbooks, warning outlines, and localized replacements.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-zinc-850">
                    <div className="font-mono text-[9px] text-zinc-500 tracking-wider">SCHEMA: MARKDOWN REPORT</div>
                  </div>
                </div>

                <div className="lg:col-span-1 flex justify-center text-teal-400 transform rotate-180 lg:rotate-180">
                  <ArrowRight className="h-5 w-5 transform rotate-180" />
                </div>

                <div className="lg:col-span-8 bg-[#0e0f13] p-5 rounded-none border-2 border-zinc-800 relative z-10 self-stretch flex flex-col justify-between hover:border-teal-500/80 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                  <div>
                    <span className="px-2.5 py-1 rounded-none text-[8px] bg-[#101b15] text-emerald-400 font-mono font-bold border border-emerald-950 uppercase tracking-widest">AGENT 3 : REPORTER</span>
                    <h3 className="text-sm font-bold text-white mt-3 font-display uppercase tracking-wide">4. Synthesis & Strategy</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Merges qualitative contextual reports with alignment scores from the Analyzer to generate structured solutions with action items and alternatives.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-zinc-850">
                    <div className="font-mono text-[9px] text-teal-400/80 tracking-wider">FILE: reporter_agent.py</div>
                  </div>
                </div>

              </div>

              {/* Extended file explanations breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-[#0b0c10] p-6 rounded-none border-2 border-zinc-800 space-y-3.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-none bg-zinc-950 text-teal-400 font-mono text-[10px] font-bold border border-zinc-800 tracking-wider uppercase">SUB-AGENT 1</span>
                    <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide">Research Agent</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Loads <code className="font-mono text-xs text-teal-400 bg-zinc-950 px-1 py-0.5 border border-zinc-900">research_prompt.txt</code>. Leverages <code className="font-mono text-xs text-teal-400 bg-zinc-950 px-1 py-0.5 border border-zinc-900">search_tool.py</code> adapters to retrieve real-time trends, modern dialects, and sensitive regional triggers.
                  </p>
                </div>
                
                <div className="bg-[#0b0c10] p-6 rounded-none border-2 border-zinc-800 space-y-3.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-none bg-zinc-950 text-teal-400 font-mono text-[10px] font-bold border border-zinc-800 tracking-wider uppercase">SUB-AGENT 2</span>
                    <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide">Analyzer Agent</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Loads <code className="font-mono text-xs text-teal-400 bg-zinc-950 px-1 py-0.5 border border-zinc-900">analyzer_prompt.txt</code>. Evaluates overall campaign tone profiles, scoring resonance and risks from 0 to 100 based on historic taboos and regional legal constraints.
                  </p>
                </div>

                <div className="bg-[#0b0c10] p-6 rounded-none border-2 border-zinc-800 space-y-3.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-none bg-zinc-950 text-teal-400 font-mono text-[10px] font-bold border border-zinc-800 tracking-wider uppercase">SUB-AGENT 3</span>
                    <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide">Reporter Agent</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Loads <code className="font-mono text-xs text-teal-400 bg-zinc-950 px-1 py-0.5 border border-zinc-900">reporter_prompt.txt</code>. Coalesces structural score estimates with linguistic findings into a pristine, fully markdown-vetted cultural briefing profile.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Pipeline Dry Run Simulator Tab */}
        {activeTab === "simulation" && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#07080a] bg-geom-grid">
            <div className="max-w-5xl mx-auto space-y-8">
              
              <div className="space-y-2 border-l-4 border-teal-500 pl-4.5 py-1">
                <h2 className="text-2xl font-bold tracking-wider text-white font-display uppercase">MULTIPROCESS PIPELINE SIMULATOR</h2>
                <p className="text-xs tracking-wide text-zinc-400 uppercase font-mono leading-relaxed">
                  Select a product copy statement or craft custom message tags, then execute Rasa's virtual multi-agent recursive network to preview regional intelligence scores and warnings.
                </p>
              </div>

              {/* Grid block: Left side controls, Right side log processes and reports */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Inputs Setup */}
                <div className="lg:col-span-5 bg-[#0b0c10] p-6 rounded-none border-2 border-zinc-800 space-y-6 shadow-[3px_3px_0px_0px_rgba(20,184,166,0.065)]">
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-display block">1. SELECT SOURCE TEXT TEMPLATE</label>
                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          setSelectedTemplateKey("superfood");
                          setCustomCopy("");
                        }}
                        className={`w-full text-left p-3.5 rounded-none border-2 transition-all duration-150 ${
                          selectedTemplateKey === "superfood" && !customCopy
                            ? "bg-[#111918]/80 border-teal-500 text-white shadow-[2px_2px_0px_0px_rgba(20,184,166,0.25)]" 
                            : "bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-xs font-bold">
                          <span className="px-1.5 py-0.5 rounded-none bg-teal-950 text-teal-300 text-[8px] font-mono border border-teal-900 tracking-wider font-bold">FOOD / LATTE</span>
                          <span className="font-display uppercase tracking-wider">Superfood Latte</span>
                        </div>
                        <p className="text-xs text-zinc-400 italic mt-2.5 font-sans">
                          "Elevate your morning routine with our superfood latte blend. Brew, energize, conquer."
                        </p>
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedTemplateKey("ai_assistant");
                          setCustomCopy("");
                        }}
                        className={`w-full text-left p-3.5 rounded-none border-2 transition-all duration-150 ${
                          selectedTemplateKey === "ai_assistant" && !customCopy
                            ? "bg-[#111918]/80 border-teal-500 text-white shadow-[2px_2px_0px_0px_rgba(20,184,166,0.25)]" 
                            : "bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-xs font-bold">
                          <span className="px-1.5 py-0.5 rounded-none bg-emerald-950 text-emerald-300 text-[8px] font-mono border border-emerald-900 tracking-wider font-bold">SAAS / AGENT</span>
                          <span className="font-display uppercase tracking-wider">Daily Focus Agent</span>
                        </div>
                        <p className="text-xs text-zinc-400 italic mt-2.5 font-sans">
                          "Meet your autonomous workspace agent. Deploy intelligence to manage your inbox and run routine tasks."
                        </p>
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedTemplateKey("fashion_statement");
                          setCustomCopy("");
                        }}
                        className={`w-full text-left p-3.5 rounded-none border-2 transition-all duration-150 ${
                          selectedTemplateKey === "fashion_statement" && !customCopy
                            ? "bg-[#111918]/80 border-teal-500 text-white shadow-[2px_2px_0px_0px_rgba(20,184,166,0.25)]" 
                            : "bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-xs font-bold">
                          <span className="px-1.5 py-0.5 rounded-none bg-rose-950 text-rose-300 text-[8px] font-mono border border-rose-900 tracking-wider font-bold">RETAIL / FASHION</span>
                          <span className="font-display uppercase tracking-wider">Streetwear Statement</span>
                        </div>
                        <p className="text-xs text-zinc-400 italic mt-2.5 font-sans">
                          "Make an unapologetic statement. Loud, circular, ethically-tailored streetwear to rule the cityscape."
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Content Type Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-display block">1.5. SELECT CONTENT FORMAT TYPE</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full p-3 bg-zinc-950 border-2 border-zinc-850 rounded-none text-xs text-zinc-350 focus:outline-none focus:border-teal-500 font-mono tracking-wide cursor-pointer appearance-none"
                    >
                      {CONTENT_TYPES.map(type => (
                        <option key={type} value={type} className="bg-zinc-950 text-zinc-200">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom copy text-area */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-display block">OR TEST CUSTOM CAMPAIGN COPY</label>
                    <textarea 
                      value={customCopy}
                      onChange={(e) => {
                        setCustomCopy(e.target.value);
                      }}
                      placeholder="Write your localized product campaign tagline, slogan, or social hashtags here..."
                      className="w-full h-24 p-3 bg-zinc-950 border-2 border-zinc-850 rounded-none text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-teal-500 font-mono tracking-wide"
                    />
                  </div>

                  {/* Target Market selection widgets */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-display block">2. TARGET CULTURAL Locales ({selectedMarkets.length}/8)</label>
                      {selectedMarkets.length >= 8 && (
                        <span className="text-[9px] text-[#cca15c] font-mono font-bold uppercase tracking-wider">MAX REACHED</span>
                      )}
                    </div>

                    {/* Flex Tags Container */}
                    <div className="flex flex-wrap gap-2 p-3 bg-zinc-950 border-2 border-zinc-850 rounded-none min-h-[50px]">
                      {selectedMarkets.map(market => {
                        return (
                          <div 
                            key={market}
                            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#101b1a] border border-teal-800 text-teal-300 text-xs font-mono tracking-wide"
                          >
                            <span>{getFlag(market)}</span>
                            <span className="font-semibold">{market}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedMarkets.length > 1) {
                                  setSelectedMarkets(selectedMarkets.filter(m => m !== market));
                                }
                              }}
                              disabled={selectedMarkets.length <= 1}
                              className="text-teal-600 hover:text-rose-400 transition-colors ml-1 font-bold text-xs leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Remove market"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Country Form */}
                    <div className="flex gap-2.5">
                      <input 
                        type="text"
                        value={newMarketInput}
                        onChange={(e) => setNewMarketInput(e.target.value)}
                        placeholder="Add country name (e.g. France)..."
                        maxLength={30}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddMarket();
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-zinc-950 border-2 border-zinc-850 rounded-none text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-teal-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddMarket}
                        className="px-3.5 py-2 hover:bg-teal-500 font-bold font-display uppercase tracking-wider border-2 border-teal-500 hover:text-zinc-950 text-teal-300 hover:border-teal-400 text-[11px] transition-all cursor-pointer whitespace-nowrap"
                      >
                        Add Market
                      </button>
                    </div>
                  </div>

                  {/* Simulation Execution Button */}
                  <button 
                    disabled={isSimulating}
                    onClick={triggerSimulation}
                    className="w-full py-4.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-950 font-bold tracking-widest font-display uppercase rounded-none border-2 border-zinc-950 transition-all shadow-[4px_4px_0px_0px_rgba(20,184,166,0.25)] active:translate-x-0.5 active:translate-y-0.5 duration-100 flex items-center justify-center gap-2.5 cursor-pointer text-sm"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>AGENT COILS ITERATING [{simulationStep}%]</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 fill-zinc-950" />
                        <span>RUN RECURSIVE ANALYSIS</span>
                      </>
                    )}
                  </button>

                </div>

                {/* Right Area: Simulated CLI Logs or Scared Results and Advisory Report */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Visual Logs Console */}
                  <div className="bg-[#030406] rounded-none border-2 border-zinc-800 overflow-hidden font-mono">
                    <div className="px-5 py-3.5 bg-[#0a0b0e] border-b-2 border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 animate-pulse rounded-none" />
                        <span className="text-xs font-bold text-zinc-300 font-display uppercase tracking-widest">Rasa Subprocess STDIO</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">python3 main.py</span>
                    </div>

                    <div className="p-4 h-64 overflow-y-auto text-xs space-y-2 scrollbar bg-[#030406]">
                      {simLogs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-650 italic space-y-2.5">
                          <Terminal className="h-7 w-7 text-zinc-800" />
                          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-600">Console trace listener idle. Click execute to stream details...</span>
                        </div>
                      ) : (
                        <div className="space-y-1 bg-[#030406]">
                          {simLogs.map((log, index) => {
                            let textClass = "text-zinc-400";
                            if (!log || typeof log !== "string") return null;
                            if (log.includes("[✔]")) textClass = "text-emerald-400 font-semibold";
                            else if (log.includes("[STAGE")) textClass = "text-teal-400 font-semibold";
                            else if (log.includes("[*]")) textClass = "text-sky-400";
                            else if (log.includes("[❌]")) textClass = "text-rose-500 font-semibold";
                            else if (log.includes("🌏 RASA CULTURAL INTELLIGENCE REPORT")) textClass = "text-teal-400 font-bold text-sm tracking-wider";
                            else if (log.startsWith("===")) textClass = "text-zinc-600";
                            else if (log.includes("Verdict: ✅")) textClass = "text-emerald-400 font-medium";
                            else if (log.includes("Verdict: ⚠️")) textClass = "text-amber-400 font-medium";
                            else if (log.includes("Verdict: ⛔")) textClass = "text-rose-400 font-bold";
                            else if (log.includes("Resonance Score:") || log.includes("Risk Score:")) textClass = "text-zinc-300";
                            else if (log.includes("💡 FINAL RECOMMENDATION:")) textClass = "text-amber-400 font-bold mt-2";
                            else if (!log.startsWith("[") && !log.includes(":") && !log.startsWith("=") && selectedMarkets.some(m => log.toUpperCase().includes(m.toUpperCase()))) textClass = "text-white font-bold tracking-wider mt-3 inline-block";
                            return (
                              <div key={index} className={`font-mono leading-relaxed bg-[#030406] whitespace-pre-wrap ${textClass}`}>
                                {log}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comparative Reports outputs */}
                  <AnimatePresence>
                    {showSimResults && (
                      <motion.div 
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-805 pb-3">
                          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="h-4.5 w-4.5 text-teal-400" />
                            COMPILED CULTURAL BLUEPRINT
                          </h3>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold bg-teal-950 px-2 py-0.5 border border-teal-900">AUDIT END</span>
                        </div>

                        {/* Individual market report grid cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedMarkets.map(marketName => {
                            const currentCopyVal = customCopy || (selectedTemplateKey === "superfood"
                              ? "Elevate your morning routine with our superfood latte blend. Brew, energize, conquer."
                              : selectedTemplateKey === "ai_assistant"
                                ? "Meet your autonomous workspace agent. Deploy intelligence to manage your inbox and run routine tasks."
                                : "Make an unapologetic statement. Loud, circular, ethically-tailored streetwear to rule the cityscape.");

                            const result: MarketSimulationResult = (simulationResults ? simulationResults[marketName] : (customCopy ? {
                              market: marketName,
                              flag: getFlag(marketName),
                              resonanceScore: 85,
                              riskLevel: "Low",
                              findings: [
                                `Analyzed custom format: "${contentType}"`,
                                "High regional syntax matching, conversational idioms aligned perfectly."
                              ],
                              warnings: [
                                "Confirm visual layout palette constraints in localized assets."
                              ],
                              recommendation: "Solid contextual pacing. Clear to coordinate scheduling plans.",
                              alternative: customCopy
                            } : (currentTemplate && currentTemplate[marketName] ? currentTemplate[marketName] : {
                              market: marketName,
                              flag: getFlag(marketName),
                              resonanceScore: 82,
                              riskLevel: "Low",
                              findings: [
                                "Linguistic context aligned with modern regional trends.",
                                "Aesthetic presentation conforms to localized formatting profile."
                              ],
                              warnings: [],
                              recommendation: "Safe: Standard alignment patterns confirmed.",
                              alternative: currentCopyVal
                            }))) || {
                              market: marketName,
                              flag: getFlag(marketName),
                              resonanceScore: 82,
                              riskLevel: "Low",
                              findings: [
                                "Linguistic context aligned with modern regional trends.",
                                "Aesthetic presentation conforms to localized formatting profile."
                              ],
                              warnings: [],
                              recommendation: "Safe: Standard alignment patterns confirmed.",
                              alternative: currentCopyVal
                            };

                            const scoreColor = result.resonanceScore >= 90 
                              ? "text-emerald-400 border-emerald-950 bg-emerald-950/30" 
                              : result.resonanceScore >= 80 
                                ? "text-teal-400 border-teal-950 bg-teal-950/20" 
                                : "text-amber-400 border-amber-955 bg-amber-950/20";

                            return (
                              <div key={marketName} className="bg-[#0b0c10] border-2 border-zinc-800 p-5 space-y-4 hover:border-zinc-700 transition-all duration-150">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{result.flag}</span>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">{result.market} REPORT</h4>
                                  </div>
                                  <div className={`px-2 py-0.5 rounded-none border font-mono font-bold text-[10px] tracking-wider ${scoreColor}`}>
                                    {result.resonanceScore} PTS
                                  </div>
                                </div>

                                {/* Checklist metrics */}
                                <div className="space-y-2 pt-3.5 border-t border-zinc-850">
                                  <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-display">GROUNDED FINDINGS</div>
                                  <ul className="space-y-1.5">
                                    {result.findings.map((f, i) => (
                                      <li key={i} className="text-xs text-zinc-300 leading-normal flex items-start gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {result.warnings.length > 0 && (
                                  <div className="bg-[#1f1614] border border-rose-9003/30 p-3 rounded-none space-y-1">
                                    <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold uppercase tracking-wider font-display">
                                      <ShieldAlert className="h-4 w-4 shrink-0" />
                                      <span>REGIONAL RISK PROFILE</span>
                                    </div>
                                    <p className="text-[11px] text-rose-200/80 leading-normal pl-5">
                                      {result.warnings[0]}
                                    </p>
                                  </div>
                                )}

                                <div className="space-y-1 bg-zinc-950 p-3 rounded-none border border-zinc-900">
                                  <div className="text-[9px] font-semibold text-teal-400 uppercase tracking-widest font-display">ADVISED COPY DIRECTION</div>
                                  <p className="text-xs text-zinc-200 italic leading-normal">
                                    "{result.alternative}"
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Consolidated overview report */}
                        <div className="bg-[#0b0c10] border-2 border-zinc-800 p-6 rounded-none relative overflow-hidden space-y-4 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.01)]">
                          <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
                            <Bot className="h-32 w-32 text-white" />
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                            <div className="flex items-center gap-2">
                              <Info className="h-5 w-5 text-teal-400" />
                              <h3 className="text-sm font-bold text-white font-display uppercase tracking-widest">REPORTER COMPILATION REPORT</h3>
                            </div>
                            
                            {advisoryReport && (
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleCopyReport(advisoryReport)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-950 hover:bg-zinc-900 text-[10px] font-bold font-display uppercase tracking-wider border border-zinc-850 text-zinc-200 transition-all hover:border-teal-500/60 cursor-pointer"
                                >
                                  {copiedReport ? (
                                    <>
                                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                                      <span className="text-emerald-400 font-display">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5 text-zinc-400" />
                                      <span>Copy Full Report</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDownloadReport(advisoryReport)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-950 hover:bg-zinc-900 text-[10px] font-bold font-display uppercase tracking-wider border border-zinc-850 text-zinc-200 transition-all hover:border-teal-500/60 cursor-pointer"
                                >
                                  <FileDown className="h-3.5 w-3.5 text-zinc-400" />
                                  <span>Download as .txt</span>
                                </button>
                              </div>
                            )}
                          </div>
                          {advisoryReport ? (
                            <div className="bg-zinc-950 p-5 rounded-none border border-zinc-900 overflow-auto max-h-[500px] select-text">
                              <pre className="text-xs font-sans text-zinc-350 whitespace-pre-wrap leading-relaxed font-medium">
                                {advisoryReport}
                              </pre>
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                              This simulator visualizes the modular JSON and markdown results returned from Rasa's <code className="font-mono text-xs text-teal-400">reporter_agent.py</code> core. Under standard operations with real credentials configured, Rasa will output this structured report directly to markdown files or stdout for global campaign coordination.
                            </p>
                          )}
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer Area */}
      <footer className="border-t-2 border-zinc-805 bg-[#0a0b0d] text-center py-5 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] tracking-wider text-zinc-500 uppercase font-mono border-zinc-800">
        <div>
          <span>RASA CULTURAL ADVISORY SKELETON</span>
        </div>
        <div className="flex items-center gap-4">
          <span>MARKETS: IN, JP, KR, US</span>
          <span>•</span>
          <span>GOOGLE ADK & GEMINI 2.0 FLASH</span>
        </div>
      </footer>

    </div>
  );
}
