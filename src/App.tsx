/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect, CSSProperties } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, FileText, Settings, Layout, Sparkles, MonitorPause, ChevronLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResumeData, SAMPLE_RESUME_DATA } from "./types";
import { useResumeStore } from "./store/useResumeStore";
import ResumeForm from "./components/ResumeForm";
import TemplateSelector from "./components/TemplateSelector";
import ModernTemplate from "./components/templates/ModernTemplate";
import ProfessionalTemplate from "./components/templates/ProfessionalTemplate";
import MinimalTemplate from "./components/templates/MinimalTemplate";
import CreativeTemplate from "./components/templates/CreativeTemplate";
import ExecutiveTemplate from "./components/templates/ExecutiveTemplate";
import TechnicalTemplate from "./components/templates/TechnicalTemplate";
import AcademicTemplate from "./components/templates/AcademicTemplate";
import IndigoTemplate from "./components/templates/IndigoTemplate";
import BrutalistTemplate from "./components/templates/BrutalistTemplate";
import ElegantTemplate from "./components/templates/ElegantTemplate";
import CompactTemplate from "./components/templates/CompactTemplate";
import DesignerTemplate from "./components/templates/DesignerTemplate";
import SourceSidebar from "./components/SourceSidebar";
import Logo from "./components/Logo";
import { cn } from "./lib/utils";

export default function App() {
  const [view, setView] = useState<"landing" | "editor">("landing");
  const { data, setData, resetData, sidebarOpen, toggleSidebar, formOpen, toggleForm } = useResumeStore();
  const [isImporting, setIsImporting] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [autoScale, setAutoScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Auto-scale calculation logic for 210mm (~794px)
  useEffect(() => {
    const calculateScale = () => {
      if (!wrapperRef.current) return;
      const containerWidth = wrapperRef.current.offsetWidth;
      // 210mm is 793.7px at 96 DPI
      const targetWidth = 794; 
      
      const padding = window.innerWidth < 768 ? 20 : 40;
      if (containerWidth < targetWidth + padding) {
        setAutoScale((containerWidth - padding) / targetWidth);
      } else {
        setAutoScale(1);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${data.personal.fullName.replace(/\s+/g, "_")}_Resume`,
  });

  const exportDirectPdf = async () => {
    if (!printRef.current) return;
    setIsImporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");
      
      const imgData = await toPng(printRef.current, {
        quality: 1.0,
        pixelRatio: 2, 
        backgroundColor: "#ffffff",
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`${data.personal.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Direct export failed. Use the 'Print / Save' button for traditional browser PDF saving.");
    } finally {
      setIsImporting(false);
    }
  };

  const startBlank = () => {
    resetData(true);
    setView("editor");
  };

  const renderTemplate = () => {
    switch (data.template) {
      case "modern": return <ModernTemplate data={data} />;
      case "professional": return <ProfessionalTemplate data={data} />;
      case "minimal": return <MinimalTemplate data={data} />;
      case "creative": return <CreativeTemplate data={data} />;
      case "executive": return <ExecutiveTemplate data={data} />;
      case "technical": return <TechnicalTemplate data={data} />;
      case "academic": return <AcademicTemplate data={data} />;
      case "indigo": return <IndigoTemplate data={data} />;
      case "brutalist": return <BrutalistTemplate data={data} />;
      case "elegant": return <ElegantTemplate data={data} />;
      case "compact": return <CompactTemplate data={data} />;
      case "designer": return <DesignerTemplate data={data} />;
      default: return <ModernTemplate data={data} />;
    }
  };

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#F0F2F5] text-gray-900 font-sans selection:bg-blue-100 overflow-x-hidden relative">
        {/* Advanced Mesh Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[150px] transition-all duration-[10s]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-400/10 rounded-full blur-[100px]" />
        </div>

        <nav className="relative z-50 px-8 md:px-12 py-8 flex justify-between items-center max-w-[1600px] mx-auto">
          <Logo />
          <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
             <button className="hover:text-blue-600 transition-colors">Frameworks</button>
             <button className="hover:text-blue-600 transition-colors">Showcase</button>
             <button className="hover:text-blue-600 transition-colors group flex items-center gap-2">
                Docs <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
          <button 
            onClick={() => setView("editor")}
            className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200"
          >
            Launch Studio
          </button>
        </nav>

        <main className="relative z-10 max-w-[1600px] mx-auto px-8 md:px-12 pt-12 md:pt-24 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-12"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur-md rounded-full border border-white/50 shadow-sm">
                <Sparkles size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">v4.0 Obsidian Update</span>
              </div>
              
              <div className="relative">
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-gray-900">
                  Precision <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Portfolios.</span>
                </h2>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000" />
              </div>
              
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                The high-performance resume engine for modern creators. Built on architectural principles of hierarchy, density, and 3D precision.
              </p>

              <div className="flex flex-wrap gap-8 pt-4">
                <button 
                  onClick={() => setView("editor")}
                  className="group px-12 py-6 bg-gray-900 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-6 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                >
                  Start Engineering <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-16 border-t border-gray-200/50">
                <div className="space-y-1">
                   <p className="text-2xl font-black text-gray-900">12</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Archetypes</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-black text-gray-900">3D</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Preview</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-black text-gray-900">A4</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Exports</p>
                </div>
              </div>
            </motion.div>

            {/* 3D Floating Hero Canvas */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }} 
              animate={{ opacity: 1, scale: 1, rotateY: -10 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative perspective-2000 hidden lg:block"
            >
              <motion.div 
                animate={{ 
                  y: [0, -20, 0],
                  rotateY: [-10, -5, -10],
                  rotateX: [5, 10, 5]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="relative z-10 w-[550px] aspect-[4/5] bg-white rounded-[40px] shadow-[0_100px_150px_-50px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden transform-style-3d group hover:scale-[1.02] transition-transform duration-700 hover:shadow-blue-500/10"
              >
                  {/* Internal 3D Structure Simulation */}
                  <div className="absolute inset-0 bg-white p-12 flex flex-col gap-10">
                      <div className="flex justify-between items-start">
                          <div className="space-y-4 flex-1">
                              <div className="w-[80%] h-6 bg-gray-900 rounded-lg group-hover:bg-blue-600 transition-colors" />
                              <div className="w-[50%] h-3 bg-gray-200 rounded-lg" />
                          </div>
                          <div className="w-16 h-16 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center">
                             <div className="w-8 h-8 bg-blue-500 rounded-lg animate-pulse" />
                          </div>
                      </div>
                      <div className="space-y-6">
                        <div className="w-[40%] h-2 bg-blue-100 rounded-full" />
                        <div className="space-y-3">
                          <div className="w-full h-1 bg-gray-100" />
                          <div className="w-full h-1 bg-gray-100" />
                          <div className="w-[85%] h-1 bg-gray-100" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <div className="w-[60%] h-3 bg-gray-100 rounded-md" />
                           <div className="w-full h-1 bg-gray-50" />
                           <div className="w-full h-1 bg-gray-50" />
                        </div>
                        <div className="space-y-4">
                           <div className="w-[60%] h-3 bg-gray-100 rounded-md" />
                           <div className="w-full h-1 bg-gray-50" />
                           <div className="w-full h-1 bg-gray-50" />
                        </div>
                      </div>
                      <div className="mt-auto flex justify-end gap-3">
                         <div className="w-20 h-2 bg-gray-100 rounded-full" />
                         <div className="w-8 h-2 bg-blue-600 rounded-full" />
                      </div>
                  </div>
                  
                  {/* Glossy Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/40 pointer-events-none" />
              </motion.div>

              {/* Decorative 3D Floating Elements */}
              <motion.div 
                animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -left-10 z-20 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 flex items-center gap-4"
              >
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center">
                    <Layout size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Adaptive Grid</p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">Responsive v4</p>
                  </div>
              </motion.div>

              <motion.div 
                animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-10 -right-10 z-20 bg-blue-600 p-6 rounded-3xl shadow-2xl flex items-center gap-4 text-white"
              >
                  <Download size={20} className="text-blue-200" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Pure A4 Vector</p>
                    <p className="text-[8px] text-white/60 font-bold uppercase mt-0.5 tracking-widest">Crystal Clarity</p>
                  </div>
              </motion.div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
            </motion.div>
          </div>

          <section className="mt-48 space-y-24">
            <div className="text-center space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-600">The Archetype Collection</h3>
              <h4 className="text-6xl md:text-7xl font-black tracking-tighter leading-none text-gray-900">Physical Design. <br />Digital Precision.</h4>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Select a framework to begin your story</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {[
                { 
                  id: "modern", 
                  name: "Modern", 
                  desc: "Strategic hierarchy with precision-aligned sidebars.", 
                  color: "from-blue-600 to-indigo-600",
                  component: <ModernTemplate data={{ ...SAMPLE_RESUME_DATA, template: "modern" }} />
                },
                { 
                  id: "professional", 
                  name: "Professional", 
                  desc: "The gold standard for established corporate careers.", 
                  color: "from-gray-700 to-gray-900",
                  component: <ProfessionalTemplate data={{ ...SAMPLE_RESUME_DATA, template: "professional" }} />
                },
                { 
                  id: "creative", 
                  name: "Creative", 
                  desc: "Bold layout logic for high-impact visual roles.", 
                  color: "from-purple-600 to-pink-600",
                  component: <CreativeTemplate data={{ ...SAMPLE_RESUME_DATA, template: "creative" }} />
                },
                { 
                  id: "technical", 
                  name: "Technical", 
                  desc: "Low-level system aesthetic for engineering leads.", 
                  color: "from-emerald-600 to-teal-600",
                  component: <TechnicalTemplate data={{ ...SAMPLE_RESUME_DATA, template: "technical" }} />
                },
                { 
                  id: "executive", 
                  name: "Executive", 
                  desc: "Densely packed high-value leadership profiles.", 
                  color: "from-amber-600 to-orange-700",
                  component: <ExecutiveTemplate data={{ ...SAMPLE_RESUME_DATA, template: "executive" }} />
                },
                { 
                  id: "minimal", 
                  name: "Minimal", 
                  desc: "Strict reductionist aesthetic for absolute clarity.", 
                  color: "from-zinc-400 to-zinc-600",
                  component: <MinimalTemplate data={{ ...SAMPLE_RESUME_DATA, template: "minimal" }} />
                }
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => { setData({ ...data, template: template.id as any }); setView("editor"); }}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-[48px] p-8 border border-white/50 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-4 text-left flex flex-col h-full overflow-hidden hover:rotate-1"
                >
                  <div className="w-full aspect-[4/5] bg-gray-50 rounded-3xl mb-10 overflow-hidden relative border border-gray-100 group-hover:border-blue-200 transition-all shadow-inner">
                    <div className="absolute inset-0 origin-top-left scale-[0.32] w-[312%] h-[312%] overflow-hidden bg-white">
                      {template.component}
                    </div>
                    {/* Perspective Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-2xl font-black uppercase tracking-tighter transition-colors group-hover:text-blue-600">{template.name}</h5>
                      <span className={cn("w-3 h-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-gradient-to-r", template.color)} />
                    </div>
                    <p className="text-xs text-gray-400 font-bold leading-relaxed mb-8 flex-grow">{template.desc}</p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                       <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">A4 Ready</span>
                       <div className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl group-hover:bg-blue-600 transition-all group-hover:scale-105">
                          Select Canvas
                       </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="container mx-auto px-4 md:px-0">
               <div className="bg-gray-900 rounded-[60px] p-12 md:p-24 relative overflow-hidden shadow-3xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay" />
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                       <h4 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">Complete <br />Sovereignty.</h4>
                       <p className="text-lg text-gray-400 leading-relaxed max-w-md">Your data never leaves your browser. We provide the engine, you provide the craft. 100% private, 100% free.</p>
                       <button 
                        onClick={startBlank}
                        className="px-10 py-5 bg-white text-gray-900 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all"
                       >
                         Start From Zero
                       </button>
                    </div>
                    <div className="flex justify-center md:justify-end">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="w-32 h-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center gap-3">
                             <FileText size={20} className="text-white" />
                             <span className="text-[8px] font-black text-white uppercase tracking-widest">SVG Render</span>
                          </div>
                          <div className="w-32 h-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center gap-3 active:scale-110 transition-transform">
                             <Download size={20} className="text-blue-400" />
                             <span className="text-[8px] font-black text-white uppercase tracking-widest">Vector PDF</span>
                          </div>
                          <div className="col-span-2 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl">
                             <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 leading-none">Security Protocol</p>
                             <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
            
            <footer className="pt-24 pb-12 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-8">
               <Logo className="opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all" />
               <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                  <a href="#" className="hover:text-gray-900">Privacy</a>
                  <a href="#" className="hover:text-gray-900">Terms</a>
                  <a href="#" className="hover:text-gray-900">GitHub</a>
               </div>
            </footer>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
      {/* High-End Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F8F9FA]/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-5">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <button onClick={() => setView("landing")} className="flex items-center gap-6 group">
            <div className="w-12 h-12 bg-gray-900 rounded-[20px] flex items-center justify-center text-white shadow-2xl transition-all group-hover:bg-blue-600 group-hover:rotate-12">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <div className="text-left">
              <h1 className="font-black text-xl leading-none tracking-tighter uppercase whitespace-nowrap">Prism Studio</h1>
              <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-black mt-1">Exit to Landing</p>
            </div>
          </button>

          <div className="flex items-center gap-6">
            {/* Quick Scale Control */}
            <div className="hidden xl:flex items-center gap-4 px-6 py-3 bg-white border border-gray-100/50 rounded-2xl shadow-sm">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Canvas Zoom</span>
                <span className="text-[10px] font-black text-blue-600">{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-32 h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportDirectPdf}
                disabled={isImporting}
                className="relative overflow-hidden group flex items-center gap-3 bg-gray-900 text-white px-8 py-3.5 rounded-2xl transition-all active:scale-95 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center gap-3">
                  {isImporting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download size={14} strokeWidth={3} />
                  )}
                  Export PDF
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-none mx-auto px-2 md:px-8 py-6 md:py-12 no-print">
        {/* Horizontal Toggle Shelf */}
        <div className="flex gap-4 mb-6 md:mb-8 no-print overflow-x-auto pb-2 scrollbar-hide">
          <AnimatePresence>
            {!sidebarOpen && (
              <motion.button
                key="show-source-btn"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => toggleSidebar(true)}
                className="px-4 md:px-6 py-3 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 group hover:bg-orange-100 transition-all shadow-sm shrink-0"
              >
                <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                   <FileText size={12} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600">Source</span>
              </motion.button>
            )}
            {!formOpen && (
              <motion.button
                key="show-editor-btn"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => toggleForm(true)}
                className="px-4 md:px-6 py-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 group hover:bg-blue-100 transition-all shadow-sm shrink-0"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Layout size={12} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">Editor</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start transition-all duration-500 ease-in-out">
          
          {/* Source Text Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div 
                key="source-sidebar-container"
                initial={{ opacity: 0, x: -300, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -300, width: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="hidden lg:block lg:col-span-3 xl:col-span-2 sticky top-32 h-[calc(100vh-160px)] no-print sidebar-source overflow-hidden sidebar-controls"
              >
                <SourceSidebar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Panel */}
          <AnimatePresence>
            {formOpen ? (
              <motion.div 
                key="form-editor-container"
                initial={{ opacity: 0, scale: 0.95, width: '100%' }}
                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                exit={{ opacity: 0, scale: 0.95, width: 0 }}
                className={cn(
                  "transition-all duration-500 ease-in-out lg:sticky lg:top-32 max-h-none lg:max-h-[calc(100vh-160px)] overflow-y-auto lg:pr-4 custom-scrollbar scroll-smooth no-print controls-sidebar w-full lg:min-w-[400px]",
                  sidebarOpen ? "lg:col-span-4 xl:col-span-4" : "lg:col-span-5 xl:col-span-5"
                )}
              >
                <section className="bg-white rounded-[32px] md:rounded-[40px] p-4 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 relative">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <Settings size={14} strokeWidth={3} />
                      </div>
                      <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">Editor</h2>
                    </div>
                    <button 
                      onClick={() => toggleForm(false)}
                      className="p-2 text-gray-300 hover:text-gray-900 transition-colors"
                      title="Hide Editor"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                  <ResumeForm />
                </section>
                
                <div className="text-center pt-4 pb-12 opacity-30 group hover:opacity-100 transition-opacity">
                   <p className="text-[9px] uppercase font-black tracking-[0.4em] text-gray-400">
                     Crafted for Performance & Clarity
                   </p>
                </div>
              </motion.div>
            ) : (
              <div key="form-editor-placeholder" className="lg:col-span-1 hidden" />
            )}
          </AnimatePresence>

          {/* Preview Canvas */}
          <div className={cn(
            "transition-all duration-500 ease-in-out w-full",
            sidebarOpen && formOpen ? "lg:col-span-5 xl:col-span-6" :
            !sidebarOpen && formOpen ? "lg:col-span-7 xl:col-span-7" :
            sidebarOpen && !formOpen ? "lg:col-span-8 xl:col-span-9" :
            "lg:col-span-11 xl:col-span-11"
          )}>
            <div className="relative group">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 no-print px-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-blue-600 rounded-full relative z-10" />
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Rendering {data.template} style</span>
                </div>
              </div>

              <div ref={wrapperRef} className="resume-viewport-wrapper no-print">
                <div 
                  className="resume-paper shadow-2xl transition-all duration-700 group-hover/canvas:shadow-[0_0_150px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden"
                  style={{ 
                    '--res-font-scale': data.settings?.fontSize || 1,
                    transform: `scale(${zoom * autoScale})`,
                    flexShrink: 0,
                    marginBottom: `calc((1 - ${zoom * autoScale}) * -297mm)` // Compensate for scaled space
                  } as CSSProperties}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={data.template}
                      initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        opacity: { duration: 0.2 } 
                      }}
                      className="print-container"
                    >
                      {renderTemplate()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Pristine Document Source (for PDF/Print) */}
              <div id="print-source-root" className="fixed top-0 left-[-9999px] print:static print:left-0 print:m-0 print:p-0">
                <div 
                  ref={printRef}
                  className="resume-paper shadow-none rounded-none print-container"
                  style={{ '--res-font-scale': data.settings?.fontSize || 1 } as CSSProperties}
                >
                  {renderTemplate()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chipp AI Chatbot Label */}
      <div className="fixed bottom-6 right-24 z-[9999] no-print pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-blue-100 shadow-lg"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
            Ask your questions to AI
          </span>
        </motion.div>
      </div>

      {/* Static Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 10px; 
          border: 2px solid transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        .preview-viewport {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

