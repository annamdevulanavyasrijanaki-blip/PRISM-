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

import { AdContainer, ScriptAd } from "./components/AdBanner";

export default function App() {
  const [view, setView] = useState<"landing" | "editor" | "privacy" | "terms" | "contact">("landing");
  const { data, setData, resetData, sidebarOpen, toggleSidebar, formOpen, toggleForm } = useResumeStore();
  const [isImporting, setIsImporting] = useState(false);
  const [zoom, setZoom] = useState(0.8);
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
      
      // Capture the element as an image
      const imgData = await toPng(printRef.current, {
        quality: 1.0,
        pixelRatio: 2, 
        backgroundColor: "#ffffff",
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const imgWidth = pdfWidth;
      const calculatedImgHeight = (img.height * imgWidth) / img.width;
      
      // If the content is slightly over one page, scale it down to fit one page
      // This fulfills the user's request to "reduce font" to fit content
      const threshold = pdfHeight * 1.25; // 25% tolerance
      if (calculatedImgHeight > pdfHeight && calculatedImgHeight <= threshold) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      } else if (calculatedImgHeight <= pdfHeight) {
        // Fits perfectly on one page
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, calculatedImgHeight, undefined, 'FAST');
      } else {
        // Handle multiple pages for very long resumes
        let heightLeft = calculatedImgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedImgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - calculatedImgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedImgHeight, undefined, 'FAST');
          heightLeft -= pdfHeight;
        }
      }
      
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

  if (view === "privacy") {
    return (
      <div className="min-h-screen bg-white p-12 max-w-4xl mx-auto space-y-8 font-sans">
        <button onClick={() => setView("landing")} className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest mb-12">
          <ChevronLeft size={16} /> Back to Home
        </button>
        <h1 className="text-6xl font-black tracking-tighter">Privacy Policy</h1>
        <div className="my-8 py-4 bg-gray-50 flex items-center justify-center rounded-2xl border border-gray-100 overflow-hidden">
          <ScriptAd 
            src="https://glamourpicklessteward.com/c1a1fd1c38b67f937be1735b780adca9/invoke.js"
            options={{
              'key' : 'c1a1fd1c38b67f937be1735b780adca9',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            }}
          />
        </div>
        <p className="text-gray-600 leading-relaxed font-medium">Your privacy is our priority. Prism Resume Studio operates entirely on the client-side. This means your personal data, resume content, and uploaded images are stored locally in your browser's session storage and are never transmitted to our servers. We do not maintain a database of your personal information.</p>
        <h2 className="text-2xl font-black">Data Usage</h2>
        <p className="text-gray-500">We do not track your personal identity. We use standard analytical tools to improve the user interface and performance of the application without collecting PII (Personally Identifiable Information).</p>
      </div>
    );
  }

  if (view === "terms") {
    return (
      <div className="min-h-screen bg-white p-12 max-w-4xl mx-auto space-y-8 font-sans">
        <button onClick={() => setView("landing")} className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest mb-12">
          <ChevronLeft size={16} /> Back to Home
        </button>
        <h1 className="text-6xl font-black tracking-tighter">Terms & Conditions</h1>
        <div className="my-8 py-4 bg-gray-50 flex items-center justify-center rounded-2xl border border-gray-100 overflow-hidden">
          <AdContainer id="a870fdd741d63cdfaeb2898e965a37bb" className="shadow-sm" />
        </div>
        <p className="text-gray-600 leading-relaxed font-medium font-medium">By using Prism Resume Studio, you agree to these terms. This tool is provided as-is for personal resume creation. You are responsible for the content you create and ensuring you have the rights to use any images or information provided.</p>
        <h2 className="text-2xl font-black">Usage License</h2>
        <p className="text-gray-500">You may use the resumes generated for any legal professional purpose. You may not reverse engineer, redistribute, or sell the core application engine without explicit permission.</p>
      </div>
    );
  }

  if (view === "contact") {
    return (
      <div className="min-h-screen bg-white p-12 max-w-4xl mx-auto space-y-8 font-sans">
        <button onClick={() => setView("landing")} className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest mb-12">
          <ChevronLeft size={16} /> Back to Home
        </button>
        <h1 className="text-6xl font-black tracking-tighter">Get in Touch</h1>
        <p className="text-gray-600 leading-relaxed font-medium">Have questions, feedback, or need support? Our team is ready to help you build your best professional identity.</p>
        <div className="p-12 bg-blue-50 border border-blue-100 rounded-[40px] text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-4">Official Contact Email</p>
            <a href="mailto:thenewyouai@gmail.com" className="text-2xl md:text-3xl font-black text-blue-600 hover:underline">thenewyouai@gmail.com</a>
        </div>
      </div>
    );
  }

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#F0F2F5] text-gray-900 font-sans selection:bg-blue-100 overflow-x-hidden relative">
        {/* Advanced Mesh Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[150px] transition-all duration-[10s]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-400/10 rounded-full blur-[100px]" />
        </div>

        <nav className="relative z-50 px-4 md:px-12 py-6 flex justify-between items-center max-w-[1600px] mx-auto">
          <Logo />
          <div className="hidden md:flex items-center gap-10">
             {/* Ad space */}
          </div>
          <button 
            onClick={() => setView("editor")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
          >
            Start Now
          </button>
        </nav>

        <main className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-12 pt-8 md:pt-24 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-8 md:space-y-12"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-50 rounded-full border border-green-100 shadow-sm">
                <Sparkles size={14} className="text-green-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700">100% Free Forever • No Login Needed</span>
              </div>
              
              <div className="relative">
                <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[90px] font-black tracking-tighter leading-[0.9] text-gray-900">
                  Best Free <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">Resume Builder.</span>
                </h2>
              </div>
              
              <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                Make your professional resume in minutes. Easy to use. 100% private. No hidden costs. Perfect for everyone.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <button 
                  onClick={() => setView("editor")}
                  className="w-full sm:w-auto group px-10 py-5 bg-gray-900 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all active:scale-95 shadow-2xl"
                >
                   Start Building <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} className="w-full h-full rounded-full object-cover" alt="User" />
                     </div>
                   ))}
                   <div className="pl-4">
                      <p className="text-[10px] font-black text-gray-900 uppercase">Used by Thousands</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Daily Users</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 md:gap-8 pt-10 border-t border-gray-200/50">
                <div className="space-y-1">
                   <p className="text-2xl font-black text-gray-900">FREE</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Forever</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-black text-gray-900">SAFE</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Total Privacy</p>
                </div>
                <div className="space-y-1">
                   <p className="text-2xl font-black text-gray-900">FAST</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Easy Export</p>
                </div>
              </div>
            </motion.div>

            {/* 3D Floating Hero Canvas - Refined Professional Look */}
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
                  rotateX: [5, 6, 5]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-[550px] aspect-[1/1.414] bg-white rounded-lg shadow-[0_100px_180px_-40px_rgba(37,99,235,0.2)] overflow-hidden group transition-all duration-700"
              >
                  {/* Professional Resume Mockup - Detailed & Elegant (Pinterest Style) */}
                  <div className="h-full bg-white flex flex-col md:flex-row">
                      {/* Sidebar */}
                      <div className="w-[35%] bg-slate-50 border-r border-gray-100 p-10 flex flex-col gap-10">
                          <div className="relative group/photo">
                            <div className="w-full aspect-square bg-white shadow-xl rounded-2xl overflow-hidden border-2 border-white flex items-center justify-center p-4">
                                <FileText size={48} className="text-blue-100 group-hover/photo:scale-110 transition-transform" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-3">
                               <div className="w-[50%] h-3 bg-gray-900 rounded-sm" />
                               <div className="w-[85%] h-1.5 bg-gray-300 rounded-sm" />
                               <div className="w-[75%] h-1.5 bg-gray-300 rounded-sm" />
                            </div>
                            <div className="space-y-3">
                               <div className="w-[40%] h-3 bg-gray-900 rounded-sm" />
                               <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                          <div className="w-[90%] h-full bg-blue-500 rounded-full" />
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                          <div className="w-[70%] h-full bg-blue-500 rounded-full" />
                                      </div>
                                  </div>
                               </div>
                            </div>
                          </div>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 p-14 flex flex-col gap-12">
                          <div className="space-y-4">
                              <div className="w-[70%] h-8 bg-gray-900 rounded-sm" />
                              <div className="w-[40%] h-4 bg-blue-600 rounded-sm" />
                              <p className="w-[90%] h-2 bg-gray-100 rounded-sm" />
                              <p className="w-[85%] h-2 bg-gray-100 rounded-sm" />
                          </div>

                          <div className="space-y-10">
                             <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">01</div>
                                   <div className="w-[45%] h-4 bg-gray-900 rounded-sm" />
                                </div>
                                <div className="pl-12 space-y-4">
                                   <div className="flex justify-between items-center">
                                      <div className="w-[35%] h-3.5 bg-gray-800 rounded-sm" />
                                      <div className="w-[15%] h-2.5 bg-gray-200 rounded-sm" />
                                   </div>
                                   <div className="space-y-2.5">
                                      <div className="w-full h-2 bg-gray-50 rounded-sm" />
                                      <div className="w-full h-2 bg-gray-50 rounded-sm" />
                                      <div className="w-[80%] h-2 bg-gray-50 rounded-sm" />
                                   </div>
                                </div>
                             </div>
                             
                             <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">02</div>
                                   <div className="w-[45%] h-4 bg-gray-900 rounded-sm" />
                                </div>
                                <div className="pl-12 space-y-4">
                                   <div className="flex justify-between items-center">
                                      <div className="w-[35%] h-3.5 bg-gray-800 rounded-sm" />
                                      <div className="w-[15%] h-2.5 bg-gray-200 rounded-sm" />
                                   </div>
                                   <div className="space-y-2.5">
                                      <div className="w-full h-2 bg-gray-50 rounded-sm" />
                                      <div className="w-full h-2 bg-gray-50 rounded-sm" />
                                      <div className="w-[85%] h-2 bg-gray-50 rounded-sm" />
                                   </div>
                                </div>
                             </div>
                          </div>
                      </div>
                  </div>
                  
                  {/* Premium Subtle Shine */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/[0.03] pointer-events-none" />
              </motion.div>

              {/* Floating Accents */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -right-12 z-20 bg-white shadow-2xl p-4 rounded-2xl border border-gray-100 flex items-center gap-3"
              >
                  <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">ATS Optimized</span>
              </motion.div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
            </motion.div>
          </div>

          <section className="mt-24 md:mt-48 space-y-16 px-4 md:px-0">
            <div className="text-center space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Free Styles</h3>
              <h4 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight text-gray-900">Explore Templates.</h4>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Select a template to start building</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[
                { 
                  id: "modern", 
                  name: "Modern", 
                  desc: "Clean and simple look for any job.", 
                  color: "from-blue-600 to-indigo-600",
                  component: <ModernTemplate data={{ ...SAMPLE_RESUME_DATA, template: "modern" }} />
                },
                { 
                  id: "professional", 
                  name: "Professional", 
                  desc: "Standard format for formal companies.", 
                  color: "from-gray-700 to-gray-900",
                  component: <ProfessionalTemplate data={{ ...SAMPLE_RESUME_DATA, template: "professional" }} />
                },
                { 
                  id: "creative", 
                  name: "Creative", 
                  desc: "Bright design for creative jobs.", 
                  color: "from-purple-600 to-pink-600",
                  component: <CreativeTemplate data={{ ...SAMPLE_RESUME_DATA, template: "creative" }} />
                },
                { 
                  id: "technical", 
                  name: "Engineering", 
                  desc: "Focused look for technical roles.", 
                  color: "from-emerald-600 to-teal-600",
                  component: <TechnicalTemplate data={{ ...SAMPLE_RESUME_DATA, template: "technical" }} />
                },
                { 
                  id: "academic", 
                  name: "Academic", 
                  desc: "Formal structure for schools and research.", 
                  color: "from-stone-500 to-stone-700",
                  component: <AcademicTemplate data={{ ...SAMPLE_RESUME_DATA, template: "academic" }} />
                },
                { 
                  id: "executive", 
                  name: "Executive", 
                  desc: "Bold layout for leadership roles.", 
                  color: "from-amber-600 to-orange-700",
                  component: <ExecutiveTemplate data={{ ...SAMPLE_RESUME_DATA, template: "executive" }} />
                },
                { 
                  id: "minimal", 
                  name: "Minimal", 
                  desc: "Simple design with no distractions.", 
                  color: "from-slate-400 to-slate-600",
                  component: <MinimalTemplate data={{ ...SAMPLE_RESUME_DATA, template: "minimal" }} />
                },
                { 
                  id: "indigo", 
                  name: "Vibrant", 
                  desc: "Modern layout with colorful accents.", 
                  color: "from-indigo-400 to-blue-500",
                  component: <ModernTemplate data={{ ...SAMPLE_RESUME_DATA, template: "modern" }} />
                }
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => { setData({ ...data, template: template.id as any }); setView("editor"); }}
                  className="group relative bg-white rounded-[24px] p-4 border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2 text-left flex flex-col"
                >
                  <div className="w-full aspect-[1/1.414] bg-gray-50 rounded-xl mb-4 overflow-hidden relative border border-gray-100 group-hover:border-blue-400 transition-all shadow-inner">
                    <div className="absolute inset-0 origin-top-left scale-[0.25] w-[400%] h-[400%] overflow-hidden bg-white">
                      {template.component}
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-lg font-black uppercase tracking-tighter group-hover:text-blue-600 leading-none">{template.name}</h5>
                      <span className={cn("w-2 h-2 rounded-full", template.color)} />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold leading-tight mb-4 uppercase tracking-widest">{template.desc}</p>
                    
                    <div className="flex items-center justify-end pt-4 border-t border-gray-50 mt-auto">
                       <div className="px-4 py-2 bg-gray-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-colors">
                          Pick
                       </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative p-8 md:p-16 bg-gray-900 rounded-[32px] md:rounded-[48px] overflow-hidden group shadow-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div className="space-y-6">
                       <h4 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">Privacy <br className="hidden md:block" />First.</h4>
                       <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-md">Your data stays with you. No login. No database. 100% free and safe.</p>
                       <button 
                        onClick={startBlank}
                        className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-xl"
                       >
                         Start From Blank
                       </button>
                    </div>
                    <div className="hidden md:flex gap-6">
                        <div className="w-28 h-28 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2">
                           <FileText size={20} className="text-white" />
                           <span className="text-[8px] font-black text-white uppercase">Safe</span>
                        </div>
                        <div className="w-28 h-28 bg-blue-600 rounded-2xl flex flex-col items-center justify-center gap-2">
                           <Sparkles size={20} className="text-white" />
                           <span className="text-[8px] font-black text-white uppercase">Free</span>
                        </div>
                    </div>
                  </div>
            </div>
            
            <footer className="pt-20 pb-12 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-8">
               <Logo className="opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all" />
               <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <button onClick={() => setView("privacy")} className="hover:text-gray-900">Privacy</button>
                  <button onClick={() => setView("terms")} className="hover:text-gray-900">Terms</button>
                  <button onClick={() => setView("contact")} className="hover:text-gray-900">Contact</button>
               </div>
               <p className="text-[9px] font-bold text-gray-400 uppercase">Free Forever • Built for you</p>
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

      <main className="max-w-none mx-auto px-2 md:px-8 py-6 md:pt-12 no-print relative">
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
                  
                  <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                    <ScriptAd 
                      src="https://glamourpicklessteward.com/c1a1fd1c38b67f937be1735b780adca9/invoke.js"
                      options={{
                        'key' : 'c1a1fd1c38b67f937be1735b780adca9',
                        'format' : 'iframe',
                        'height' : 250,
                        'width' : 300,
                        'params' : {}
                      }}
                      className="rounded-xl overflow-hidden shadow-sm"
                    />
                  </div>
                </section>

                <div className="text-center pt-8 pb-12 opacity-30 group hover:opacity-100 transition-opacity">
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
            "transition-all duration-500 ease-in-out w-full relative z-20",
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

        {/* Dedicated Non-Intrusive Ad Footer Area within Main - Absolute Bottom */}
        <div className="mt-32 pb-16 border-t border-gray-100 flex flex-col items-center gap-12 no-print relative z-10">
          <div className="flex flex-wrap justify-center gap-12 pt-12">
            <AdContainer id="a870fdd741d63cdfaeb2898e965a37bb" className="shadow-sm rounded-lg overflow-hidden" />
            <ScriptAd 
              src="https://glamourpicklessteward.com/c1a1fd1c38b67f937be1735b780adca9/invoke.js"
              options={{
                'key' : 'c1a1fd1c38b67f937be1735b780adca9',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
              }}
              className="flex justify-center border border-gray-50 rounded-lg p-2"
            />
          </div>
          
          <div className="text-center space-y-4 opacity-50">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-900">
              Prism Studio v4.0.2
            </p>
            <div className="flex gap-8 justify-center">
              <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-gray-400 underline decoration-gray-200">System Status: Optimal</span>
              <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-gray-400 underline decoration-gray-200">A4 Vector Engine: Active</span>
            </div>
          </div>
        </div>
      </main>

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

