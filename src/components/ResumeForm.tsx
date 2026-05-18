import { Plus, Trash2, ChevronLeft, ChevronRight, Lightbulb, Sparkles, Upload, FileJson, FileText, ArrowRight, Save, RotateCcw, Image as ImageIcon, GripVertical, Eye, EyeOff, Layout, Type } from "lucide-react";
import React, { useState, useRef } from "react";
import { ResumeData, Experience, Education, Skill, Project, INITIAL_RESUME_DATA, Certification, Award, Volunteer, Language, Interest, CustomSection } from "../types";
import { cn } from "../lib/utils";
import { RESUME_SUGGESTIONS } from "../data/suggestions";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { useResumeStore } from "../store/useResumeStore";

type Step = "personal" | "experience" | "education" | "skills" | "projects" | "extras" | "layout" | "finish";

export default function ResumeForm() {
  const { 
    data, 
    setData, 
    updatePersonal, 
    setSectionOrder, 
    toggleSection, 
    resetData, 
    removeSectionCompletely: storeRemoveSection,
    addPage,
    removePage,
    setPages
  } = useResumeStore();
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [showSuggestions, setShowSuggestions] = useState<string | null>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps: { id: Step; label: string }[] = [
    { id: "personal", label: "Me" },
    { id: "experience", label: "Work" },
    { id: "education", label: "School" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "extras", label: "Other" },
    { id: "layout", label: "Layout" },
    { id: "finish", label: "Save" },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const updatePersonalField = (field: string, value: string) => {
    updatePersonal(field, value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG for smaller Base64
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        updatePersonalField("profileImage", compressedDataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          if (importedData.personal && Array.isArray(importedData.experience)) {
            setData(importedData);
            setCurrentStep("personal");
          } else {
            throw new Error("Invalid format");
          }
        } catch (err) {
          alert("Invalid file. Please use a .json file from this app.");
        }
      };
      reader.readAsText(file);
    }
  };

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.personal.fullName.replace(/\s+/g, "_")}_resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addSuggestionToDescription = (expId: string, point: string) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp) return;
    const currentDesc = exp.description;
    const newDesc = currentDesc ? `${currentDesc}\n• ${point}` : `• ${point}`;
    updateExperience(expId, "description", newDesc);
  };
  
  const addSuggestionToSummary = (point: string) => {
    const currentSummary = data.personal.summary;
    const newSummary = currentSummary ? `${currentSummary} ${point}` : point;
    updatePersonalField("summary", newSummary);
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setData({ ...data, experience: [...data.experience, newExp] });
    ensureSectionInOrder("experience");
  };

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = data.experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setData({ ...data, experience: updated });
  };

  const removeExperience = (id: string) => {
    setData({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setData({ ...data, education: [...data.education, newEdu] });
    ensureSectionInOrder("education");
  };

  const updateEducation = (id: string, field: string, value: any) => {
    const updated = data.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setData({ ...data, education: updated });
  };

  const removeEducation = (id: string) => {
    setData({ ...data, education: data.education.filter((e) => e.id !== id) });
  };

  const addSkill = () => {
    const newSkill: Skill = { id: crypto.randomUUID(), name: "", level: "Intermediate" };
    setData({ ...data, skills: [...data.skills, newSkill] });
    ensureSectionInOrder("skills");
  };

  const updateSkill = (id: string, field: string, value: string) => {
    const updated = data.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    setData({ ...data, skills: updated });
  };

  const removeSkill = (id: string) => {
    setData({ ...data, skills: data.skills.filter((s) => s.id !== id) });
  };

  const addProject = () => {
    const newProj: Project = { id: crypto.randomUUID(), name: "", description: "", link: "" };
    setData({ ...data, projects: [...data.projects, newProj] });
    ensureSectionInOrder("projects");
  };

  const updateProject = (id: string, field: string, value: string) => {
    const updated = data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    setData({ ...data, projects: updated });
  };

  const removeProject = (id: string) => {
    setData({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  const addCertification = () => {
    const newCert: Certification = { id: crypto.randomUUID(), name: "", issuer: "", date: "" };
    setData({ ...data, certifications: [...(data.certifications || []), newCert] });
    ensureSectionInOrder("certifications");
  };

  const removeCertification = (id: string) => {
    setData({ ...data, certifications: (data.certifications || []).filter(c => c.id !== id) });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    const updated = (data.certifications || []).map(c => c.id === id ? { ...c, [field]: value } : c);
    setData({ ...data, certifications: updated });
  };

  const addAward = () => {
    const newAward: Award = { id: crypto.randomUUID(), title: "", date: "", description: "" };
    setData({ ...data, awards: [...(data.awards || []), newAward] });
    ensureSectionInOrder("awards");
  };

  const removeAward = (id: string) => {
    setData({ ...data, awards: (data.awards || []).filter(a => a.id !== id) });
  };

  const updateAward = (id: string, field: string, value: string) => {
    const updated = (data.awards || []).map(a => a.id === id ? { ...a, [field]: value } : a);
    setData({ ...data, awards: updated });
  };

  const addVolunteer = () => {
    const newVol: Volunteer = { id: crypto.randomUUID(), organization: "", role: "", startDate: "", endDate: "", description: "" };
    setData({ ...data, volunteer: [...(data.volunteer || []), newVol] });
    ensureSectionInOrder("volunteer");
  };

  const removeVolunteer = (id: string) => {
    setData({ ...data, volunteer: (data.volunteer || []).filter(v => v.id !== id) });
  };

  const updateVolunteer = (id: string, field: string, value: string) => {
    const updated = (data.volunteer || []).map(v => v.id === id ? { ...v, [field]: value } : v);
    setData({ ...data, volunteer: updated });
  };

  const addLanguage = () => {
    const newLang: Language = { id: crypto.randomUUID(), name: "", proficiency: "Intermediate" };
    setData({ ...data, languages: [...(data.languages || []), newLang] });
    ensureSectionInOrder("languages");
  };

  const removeLanguage = (id: string) => {
    setData({ ...data, languages: (data.languages || []).filter(l => l.id !== id) });
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    const updated = (data.languages || []).map(l => l.id === id ? { ...l, [field]: value } : l);
    setData({ ...data, languages: updated });
  };

  const addInterest = () => {
    const newInt: Interest = { id: crypto.randomUUID(), name: "" };
    setData({ ...data, interests: [...(data.interests || []), newInt] });
    ensureSectionInOrder("interests");
  };

  const removeInterest = (id: string) => {
    setData({ ...data, interests: (data.interests || []).filter(i => i.id !== id) });
  };

  const updateInterest = (id: string, name: string) => {
    const updated = (data.interests || []).map(i => i.id === id ? { ...i, name } : i);
    setData({ ...data, interests: updated });
  };

  const addCustomSection = () => {
    const newSec: CustomSection = { id: crypto.randomUUID(), title: "New Section", items: [] };
    setData({ ...data, customSections: [...(data.customSections || []), newSec] });
    ensureSectionInOrder("custom");
  };

  const removeCustomSection = (id: string) => {
    setData({ ...data, customSections: (data.customSections || []).filter(s => s.id !== id) });
  };

  const updateCustomSection = (id: string, field: string, value: string) => {
    const updated = (data.customSections || []).map(s => s.id === id ? { ...s, [field]: value } : s);
    setData({ ...data, customSections: updated });
  };

  const addCustomItem = (sectionId: string) => {
    const newItem = { id: crypto.randomUUID(), label: "New Label", value: "Value" };
    const updated = (data.customSections || []).map(s => 
      s.id === sectionId ? { ...s, items: [...(s.items || []), newItem] } : s
    );
    setData({ ...data, customSections: updated });
  };

  const updateCustomItem = (sectionId: string, itemId: string, field: 'label' | 'value', value: string) => {
    const updated = (data.customSections || []).map(s => 
      s.id === sectionId ? { 
        ...s, 
        items: s.items.map(item => item.id === itemId ? { ...item, [field]: value } : item) 
      } : s
    );
    setData({ ...data, customSections: updated });
  };

  const removeCustomItem = (sectionId: string, itemId: string) => {
    const updated = (data.customSections || []).map(s => 
      s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
    );
    setData({ ...data, customSections: updated });
  };

  const ALL_SECTIONS = [
    { id: "summary", label: "Professional Summary" },
    { id: "experience", label: "Work Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "awards", label: "Awards" },
    { id: "volunteer", label: "Volunteer Work" },
    { id: "languages", label: "Languages" },
    { id: "interests", label: "Interests" },
    { id: "custom", label: "Custom Sections" },
  ];

  const ensureSectionInOrder = (sectionId: string) => {
    if (!data.sectionOrder.includes(sectionId)) {
      setSectionOrder([...data.sectionOrder, sectionId]);
    }
  };

  const removeSectionCompletely = (sectionId: string) => {
    setSectionOrder(data.sectionOrder.filter(id => id !== sectionId));
  };

  return (
    <div className="flex flex-col h-full tracking-tighter transition-all">
      {/* Dynamic Stepper */}
      <div className="flex justify-between items-center mb-8 px-2 overflow-x-auto pb-4 custom-scrollbar whitespace-nowrap gap-4 scroll-smooth uppercase font-black">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className="flex flex-col items-center gap-2 group min-w-[60px]"
          >
            <div className={cn(
              "w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-500",
              currentStep === step.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110" 
                : idx < currentStepIndex 
                  ? "bg-green-100 text-green-600" 
                  : "bg-gray-50 text-gray-300 group-hover:bg-gray-100"
            )}>
               {idx < currentStepIndex ? (
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              ) : (
                <span className="text-[10px] font-black">{idx + 1}</span>
              )}
            </div>
            <span className={cn(
              "text-[8px] font-black tracking-widest",
              currentStep === step.id ? "text-blue-600" : "text-gray-300 group-hover:text-gray-400"
            )}>
              {step.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {currentStep === "personal" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 mb-2">
                   <div className="p-4 bg-gray-50/50 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:bg-white transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                            <RotateCcw size={18} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Reset Data</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase">Clean Canvas</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => { resetData(true); setCurrentStep("personal"); }}
                        className="px-4 py-2 bg-white rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 shadow-sm border border-red-50 hover:bg-red-50 transition-all font-black"
                      >
                        Wipe Canvas
                      </button>
                   </div>
                </div>

                {/* Module 2: Image Upload & Compression */}
                <div className="flex flex-col items-center gap-6 py-12 bg-white rounded-[48px] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] relative group hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all">
                  <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className={cn(
                      "w-48 h-48 rounded-[56px] bg-gray-50 border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:scale-[1.02]",
                      data.personal.profileImage ? "border-blue-500 ring-12 ring-blue-50/50 shadow-2xl" : "border-gray-200"
                    )}>
                      {data.personal.profileImage ? (
                        <img src={data.personal.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center">
                            <ImageIcon size={24} className="text-blue-500" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Portrait</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                    >
                      {data.personal.profileImage ? "Replace" : "Upload Portait"}
                    </button>

                    {data.personal.profileImage && (
                       <button 
                        onClick={(e) => { e.stopPropagation(); updatePersonalField("profileImage", ""); }}
                        className="absolute -top-3 -right-3 bg-white text-red-500 p-4 rounded-[24px] shadow-2xl border border-red-50 hover:bg-red-600 hover:text-white transition-all z-10 scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-900">Profile Image</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Legal Name</label>
                    <input
                      type="text"
                      value={data.personal.fullName}
                      onChange={(e) => updatePersonalField("fullName", e.target.value)}
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Current Focus / Title</label>
                    <input
                      type="text"
                      value={data.personal.jobTitle}
                      onChange={(e) => updatePersonalField("jobTitle", e.target.value)}
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Direct Email</label>
                    <input
                      type="email"
                      value={data.personal.email}
                      onChange={(e) => updatePersonalField("email", e.target.value)}
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Mobile</label>
                    <input
                      type="text"
                      value={data.personal.phone}
                      onChange={(e) => updatePersonalField("phone", e.target.value)}
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                   <div className="col-span-2">
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Location / Timezone</label>
                    <input
                      type="text"
                      value={data.personal.location}
                      onChange={(e) => updatePersonalField("location", e.target.value)}
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Portfolio / Website</label>
                    <input
                      type="text"
                      value={data.personal.website}
                      onChange={(e) => updatePersonalField("website", e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">LinkedIn</label>
                    <input
                      type="text"
                      value={data.personal.linkedin || ""}
                      onChange={(e) => updatePersonalField("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">GitHub</label>
                    <input
                      type="text"
                      value={data.personal.github || ""}
                      onChange={(e) => updatePersonalField("github", e.target.value)}
                      placeholder="github.com/username"
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">LeetCode</label>
                    <input
                      type="text"
                      value={data.personal.leetcode || ""}
                      onChange={(e) => updatePersonalField("leetcode", e.target.value)}
                      placeholder="leetcode.com/username"
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Hackathon (Devpost/Other)</label>
                    <input
                      type="text"
                      value={data.personal.hackathon || ""}
                      onChange={(e) => updatePersonalField("hackathon", e.target.value)}
                      placeholder="devpost.com/username"
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div className="col-span-2 relative">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <label className="block text-[9px] uppercase font-black text-gray-400">Professional Summary</label>
                      <button 
                        onClick={() => setShowSuggestions(showSuggestions === 'summary' ? null : 'summary')}
                        className="flex items-center gap-1.5 text-[9px] uppercase font-black text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <Sparkles size={11} strokeWidth={3} /> Suggest Ideas
                      </button>
                    </div>
                    <AnimatePresence>
                      {showSuggestions === 'summary' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute z-50 bottom-full left-0 right-0 mb-4 p-4 bg-white border border-gray-100 shadow-2xl rounded-[32px] space-y-2 max-h-64 overflow-y-auto backdrop-blur-xl bg-white/95"
                        >
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Recommended Frames</p>
                          {RESUME_SUGGESTIONS.roles.find(r => r.title === 'Graduate / Fresher')?.points.map((p, i) => (
                            <button 
                              key={`summary-pref-${i}`}
                              onClick={() => { addSuggestionToSummary(p); setShowSuggestions(null); }}
                              className="w-full text-left p-4 text-[11px] hover:bg-blue-50/50 rounded-2xl border border-transparent hover:border-blue-100/50 transition-all leading-relaxed text-gray-600 font-medium whitespace-normal"
                            >
                              "{p}"
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <textarea
                      value={data.personal.summary}
                      onChange={(e) => updatePersonalField("summary", e.target.value)}
                      rows={5}
                      className="w-full p-5 bg-gray-50/50 border border-gray-100 rounded-[28px] text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none resize-none leading-relaxed"
                      placeholder="Show your unique value proposition..."
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === "experience" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">Work History</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Chronological experience and achievements</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeSectionCompletely("experience")}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all active:scale-95 shadow-sm border border-red-100"
                      title="Remove Work Experience Section"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={addExperience}
                      className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {data.experience.map((exp, idx) => (
                    <div key={exp.id} className="relative p-8 bg-gray-50/30 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-2xl hover:shadow-gray-200/40 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </div>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2">Company / Organization</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2">Formal Position</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                            placeholder="e.g. June 2021"
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2">End Date</label>
                          <input
                            type="text"
                            disabled={exp.current}
                            value={exp.current ? "Present" : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm disabled:opacity-30"
                          />
                           <label className="flex items-center gap-2 mt-3 cursor-pointer group/check">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                              className="rounded-full border-gray-200 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-[9px] uppercase font-black text-gray-300 group-hover/check:text-gray-400 transition-colors">Currently Active Role</span>
                          </label>
                        </div>
                        <div className="col-span-2 relative">
                           <div className="flex justify-between items-center mb-2">
                            <label className="block text-[9px] uppercase font-black text-gray-400">Accomplishments</label>
                            <button 
                              onClick={() => setShowSuggestions(showSuggestions === exp.id ? null : exp.id)}
                              className="flex items-center gap-1.5 text-[9px] uppercase font-black text-blue-500 hover:text-blue-600"
                            >
                              <Lightbulb size={11} strokeWidth={3} /> Suggest Points
                            </button>
                          </div>
                          <AnimatePresence>
                            {showSuggestions === exp.id && (
                               <motion.div 
                                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                 className="absolute z-50 bottom-full left-0 right-0 mb-4 p-6 bg-white border border-gray-100 shadow-2xl rounded-[32px] space-y-3 max-h-72 overflow-y-auto backdrop-blur-xl ring-1 ring-black/5"
                               >
                                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Bullet Point Inspiration</p>
                                 {RESUME_SUGGESTIONS.roles.flatMap(r => r.points).map((p, i) => (
                                   <button 
                                     key={`exp-sug-${exp.id}-${i}`}
                                     onClick={() => { addSuggestionToDescription(exp.id, p); setShowSuggestions(null); }}
                                     className="w-full text-left p-4 text-[11px] leading-relaxed hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all font-medium text-gray-600 whitespace-normal"
                                   >
                                     {p}
                                   </button>
                                 ))}
                               </motion.div>
                            )}
                          </AnimatePresence>
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            rows={6}
                            placeholder="Focus on results, not just tasks..."
                            className="w-full p-5 bg-white border border-gray-100 rounded-[28px] text-sm resize-none outline-none focus:ring-4 focus:ring-blue-500/5 transition-all leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "education" && (
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">Academic Records</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Foundational knowledge and certifications</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeSectionCompletely("education")}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all active:scale-95 shadow-sm border border-red-100"
                      title="Remove Education Section"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={addEducation}
                      className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {data.education.map((edu, idx) => (
                    <div key={edu.id} className="relative p-8 bg-gray-50/30 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all">
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2">School / Institute</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2">Concentration / Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2">Start Year</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2">End Year</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "skills" && (
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">Competencies</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Core strengths and domain expertize</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeSectionCompletely("skills")}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all active:scale-95 shadow-sm border border-red-100"
                      title="Remove Skills Section"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={addSkill}
                      className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {data.skills.map((skill) => (
                    <div key={skill.id} className="flex gap-4 items-center bg-gray-50/50 p-4 rounded-[24px] border border-gray-50 group hover:bg-white hover:shadow-lg transition-all">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                        placeholder="Skill e.g. Figma"
                        className="flex-1 bg-transparent text-sm outline-none font-black text-gray-900 placeholder:text-gray-200"
                      />
                       <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
                        className="bg-white border border-gray-100 rounded-xl px-3 py-2 text-[8px] font-black uppercase text-gray-400 tracking-widest outline-none shadow-sm"
                      >
                        <option value="Beginner">Junior</option>
                        <option value="Intermediate">Mid</option>
                        <option value="Expert">Senior</option>
                      </select>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-200 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "projects" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">Key Projects</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Public portfolio and side initiatives</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeSectionCompletely("projects")}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all active:scale-95 shadow-sm border border-red-100"
                      title="Remove Projects Section"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={addProject}
                      className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  {data.projects.map((proj) => (
                    <div key={proj.id} className="relative p-8 bg-gray-50/30 rounded-[40px] border border-gray-100 group hover:bg-white transition-all">
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Initiative Name</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Manifest Link</label>
                          <input
                            type="text"
                            value={proj.link}
                            onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                            placeholder="github.com/profile/repo"
                            className="w-full p-4 bg-white border border-gray-100 rounded-[20px] text-sm text-blue-600 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-400 mb-2 ml-1">Brief Description</label>
                          <textarea
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                            rows={3}
                            className="w-full p-5 bg-white border border-gray-100 rounded-[28px] text-sm resize-none outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "extras" && (
              <div className="space-y-12 pb-12">
                {/* Languages */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Languages</h3>
                      <p className="text-[9px] text-gray-400 font-bold mt-1">Linguistic proficiencies</p>
                    </div>
                    <button onClick={addLanguage} className="p-2 bg-gray-900 text-white rounded-xl shadow-lg border-2 border-gray-900 transition-all hover:bg-white hover:text-gray-900 active:scale-95"><Plus size={16}/></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data.languages || []).map((lang) => (
                      <div key={lang.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 group">
                        <input 
                          placeholder="Language"
                          value={lang.name}
                          onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                          className="bg-transparent font-bold text-xs outline-none flex-1"
                        />
                        <select
                          value={lang.proficiency}
                          onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                          className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-[8px] font-black uppercase text-gray-400"
                        >
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Intermediate">Mid</option>
                          <option value="Beginner">Junior</option>
                        </select>
                        <button onClick={() => removeLanguage(lang.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Interests</h3>
                      <p className="text-[9px] text-gray-400 font-bold mt-1">Personal passions and activities</p>
                    </div>
                    <button onClick={addInterest} className="p-2 bg-gray-900 text-white rounded-xl shadow-lg active:scale-95"><Plus size={16}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(data.interests || []).map((interest) => (
                      <div key={interest.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full border border-gray-100 group">
                        <input 
                          placeholder="Hobby..."
                          value={interest.name}
                          onChange={(e) => updateInterest(interest.id, e.target.value)}
                          className="bg-transparent text-[10px] font-bold outline-none w-24"
                        />
                        <button onClick={() => removeInterest(interest.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={10}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Volunteer */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Volunteer Work</h3>
                      <p className="text-[9px] text-gray-400 font-bold mt-1">Impact beyond professional roles</p>
                    </div>
                    <button onClick={addVolunteer} className="p-2 bg-gray-900 text-white rounded-xl shadow-lg active:scale-95"><Plus size={16}/></button>
                  </div>
                  <div className="space-y-4">
                    {(data.volunteer || []).map((v) => (
                      <div key={v.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4 group">
                        <div className="flex justify-between">
                          <input 
                            placeholder="Organization"
                            value={v.organization}
                            onChange={(e) => updateVolunteer(v.id, "organization", e.target.value)}
                            className="bg-transparent font-bold text-sm outline-none w-full"
                          />
                          <button onClick={() => removeVolunteer(v.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14}/></button>
                        </div>
                        <input 
                          placeholder="Role"
                          value={v.role}
                          onChange={(e) => updateVolunteer(v.id, "role", e.target.value)}
                          className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            placeholder="Start"
                            value={v.startDate}
                            onChange={(e) => updateVolunteer(v.id, "startDate", e.target.value)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-xs"
                          />
                          <input 
                            placeholder="End"
                            value={v.endDate}
                            onChange={(e) => updateVolunteer(v.id, "endDate", e.target.value)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-xs"
                          />
                        </div>
                         <textarea 
                          placeholder="Impact description..."
                          value={v.description}
                          onChange={(e) => updateVolunteer(v.id, "description", e.target.value)}
                          className="w-full p-3 bg-white border border-gray-100 rounded-2xl text-xs resize-none h-20"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Certifications</h3>
                      <p className="text-[9px] text-gray-400 font-bold mt-1">Credentials and training</p>
                    </div>
                    <button onClick={addCertification} className="p-2 bg-gray-900 text-white rounded-xl shadow-lg border-2 border-gray-900 transition-all hover:bg-white hover:text-gray-900 active:scale-95"><Plus size={16}/></button>
                  </div>
                  <div className="space-y-4">
                    {(data.certifications || []).map((cert) => (
                      <div key={cert.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4 group">
                        <div className="flex justify-between">
                          <input 
                            placeholder="Certificate Name"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                            className="bg-transparent font-bold text-sm outline-none w-full"
                          />
                          <button onClick={() => removeCertification(cert.id)} className="text-gray-200 group-hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            placeholder="Issuer"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400"
                          />
                          <input 
                            placeholder="Date"
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Awards */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Awards</h3>
                      <p className="text-[9px] text-gray-400 font-bold mt-1">Honors and recognitions</p>
                    </div>
                    <button onClick={addAward} className="p-2 bg-gray-900 text-white rounded-xl shadow-lg active:scale-95"><Plus size={16}/></button>
                  </div>
                  <div className="space-y-4">
                    {(data.awards || []).map((award) => (
                      <div key={award.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                        <div className="flex justify-between">
                          <input 
                            placeholder="Award Title"
                            value={award.title}
                            onChange={(e) => updateAward(award.id, "title", e.target.value)}
                            className="bg-transparent font-bold text-sm outline-none w-full"
                          />
                          <button onClick={() => removeAward(award.id)} className="text-red-400"><Trash2 size={14}/></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            placeholder="Date"
                            value={award.date}
                            onChange={(e) => updateAward(award.id, "date", e.target.value)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-xs col-span-2"
                          />
                           <textarea 
                            placeholder="Description"
                            value={award.description}
                            onChange={(e) => updateAward(award.id, "description", e.target.value)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-xs col-span-2 resize-none h-16"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Sections */}
                <div className="space-y-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Custom Blocks</h3>
                      <p className="text-[9px] text-gray-400 font-bold mt-1">Unique additions to your narrative</p>
                    </div>
                    <button onClick={addCustomSection} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg active:scale-95"><Plus size={16}/></button>
                  </div>
                  <div className="space-y-6">
                    {(data.customSections || []).map((section) => (
                      <div key={section.id} className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between gap-4">
                           <input 
                            value={section.title}
                            onChange={(e) => updateCustomSection(section.id, "title", e.target.value)}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 bg-transparent outline-none flex-1 border-b border-gray-100 focus:border-blue-500 pb-1"
                          />
                          <div className="flex items-center gap-2">
                            <button onClick={() => addCustomItem(section.id)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-blue-500 transition-colors"><Plus size={14}/></button>
                            <button onClick={() => removeCustomSection(section.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {(section.items || []).map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center group/item p-4 bg-gray-50/30 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                              <div className="flex-1 w-full flex gap-3 items-center">
                                <GripVertical size={14} className="text-gray-200" />
                                <input 
                                  value={item.label}
                                  onChange={(e) => updateCustomItem(section.id, item.id, 'label', e.target.value)}
                                  className="w-1/3 p-3 bg-gray-50/50 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border border-transparent focus:border-blue-100 focus:bg-white transition-all shrink-0"
                                  placeholder="Label"
                                />
                                <input 
                                  value={item.value}
                                  onChange={(e) => updateCustomItem(section.id, item.id, 'value', e.target.value)}
                                  className="flex-1 p-3 bg-gray-50/50 rounded-xl text-xs outline-none border border-transparent focus:border-blue-100 focus:bg-white transition-all"
                                  placeholder="Details..."
                                />
                                <button onClick={() => removeCustomItem(section.id, item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={12}/></button>
                              </div>
                            </div>
                          ))}
                          {(!section.items || section.items.length === 0) && (
                            <button 
                              onClick={() => addCustomItem(section.id)}
                              className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-300 hover:border-blue-200 hover:text-blue-400 transition-all"
                            >
                              + Add Custom Item
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === "layout" && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <Type size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Typography</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Select a voice for your resume</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'sans', label: 'Modern Sans', class: 'font-sans' },
                      { id: 'serif', label: 'Classic Serif', class: 'font-serif' },
                      { id: 'mono', label: 'Tech Mono', class: 'font-mono' },
                      { id: 'display', label: 'Bold Display', class: 'font-display' },
                      { id: 'elegant', label: 'Elegant Playfair', class: 'font-elegant text-xs' },
                    ].map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setData({ 
                          ...data, 
                          settings: { ...data.settings!, fontFamily: font.id as any } 
                        })}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all text-center space-y-2",
                          data.settings?.fontFamily === font.id 
                            ? "border-blue-500 bg-blue-50/50" 
                            : "border-gray-50 bg-white hover:border-gray-200"
                        )}
                      >
                        <div className={cn("text-lg font-black", font.class)}>Aa</div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{font.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Layout size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Architecture & Style</h3>
                      <p className="text-[10px] text-gray-400 font-bold">Customizing visual rhythm and typeface scales</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    {/* Font Size Control */}
                    <div className="p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Typeface Scale</p>
                          <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">Text size throughout canvas</p>
                        </div>
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black tracking-widest uppercase">
                          {Math.round((data.settings?.fontSize || 1) * 100)}%
                        </div>
                      </div>
                      <div className="relative flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-300">A</span>
                        <input 
                          type="range"
                          min="0.75"
                          max="1.25"
                          step="0.05"
                          value={data.settings?.fontSize || 1}
                          onChange={(e) => setData({ ...data, settings: { ...data.settings, fontSize: parseFloat(e.target.value) } })}
                          className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-sm font-black text-gray-400">A</span>
                      </div>
                    </div>

                    {/* Section Spacing Control */}
                    <div className="p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Vertical Rhythm</p>
                          <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">Gap between main modules</p>
                        </div>
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black tracking-widest uppercase">
                          {Math.round((data.settings?.sectionSpacing || 1) * 100)}%
                        </div>
                      </div>
                      <div className="relative flex items-center gap-4">
                         <div className="flex flex-col gap-0.5">
                            <div className="w-4 h-0.5 bg-gray-200" />
                            <div className="w-4 h-0.5 bg-gray-200" />
                         </div>
                        <input 
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={data.settings?.sectionSpacing || 1}
                          onChange={(e) => setData({ ...data, settings: { ...data.settings, sectionSpacing: parseFloat(e.target.value) } })}
                          className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                         <div className="flex flex-col gap-1.5">
                            <div className="w-4 h-0.5 bg-gray-400" />
                            <div className="w-4 h-0.5 bg-gray-400" />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                       <Sparkles size={14} className="text-blue-500" />
                       <p className="text-[10px] text-gray-900 font-black uppercase tracking-widest">Multi-Page Architecture</p>
                    </div>
                    <button 
                      onClick={addPage}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                      <Plus size={12} /> Add Page
                    </button>
                  </div>
  
                  <div className="space-y-8">
                    {(data.pages || [[...data.sectionOrder]]).map((pageSections, pageIdx) => (
                      <div key={`page-${pageIdx}`} className="space-y-4 p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 relative">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Page {pageIdx + 1}</h4>
                           {pageIdx > 0 && (
                             <button onClick={() => removePage(pageIdx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                           )}
                        </div>

                        <Reorder.Group 
                          axis="y" 
                          values={pageSections} 
                          onReorder={(newOrder) => {
                            const newPages = [...(data.pages || [data.sectionOrder])];
                            newPages[pageIdx] = newOrder;
                            setPages(newPages);
                          }}
                          className="space-y-3"
                        >
                          {pageSections.map((sectionId) => {
                            const sectionInfo = ALL_SECTIONS.find(s => s.id === sectionId);
                            if (!sectionInfo) return null;
        
                            return (
                              <Reorder.Item 
                                key={sectionId} 
                                value={sectionId}
                                className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm cursor-grab active:cursor-grabbing group hover:border-blue-200 hover:shadow-md transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <GripVertical size={14} className="text-gray-300 group-hover:text-blue-400" />
                                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-700">
                                    {sectionInfo.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {/* Page Move Controls */}
                                  <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                    <button 
                                      disabled={pageIdx === 0}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newPages = [...(data.pages || [data.sectionOrder])].map(p => [...p]);
                                        newPages[pageIdx] = newPages[pageIdx].filter(id => id !== sectionId);
                                        newPages[pageIdx - 1].push(sectionId);
                                        setPages(newPages);
                                      }}
                                      className="p-2 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                                      title="Move to Previous Page"
                                    >
                                      <ChevronLeft size={12} className="rotate-90" />
                                    </button>
                                    <div className="w-[1px] h-3 bg-gray-200" />
                                    <button 
                                      disabled={pageIdx === (data.pages?.length || 1) - 1}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newPages = [...(data.pages || [data.sectionOrder])].map(p => [...p]);
                                        newPages[pageIdx] = newPages[pageIdx].filter(id => id !== sectionId);
                                        newPages[pageIdx + 1].push(sectionId);
                                        setPages(newPages);
                                      }}
                                      className="p-2 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                                      title="Move to Next Page"
                                    >
                                      <ChevronRight size={12} className="rotate-90" />
                                    </button>
                                  </div>
                                  <button 
                                    onClick={() => toggleSection(sectionId)}
                                    className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
                                    title="Toggle Visibility"
                                  >
                                    <Eye size={16} />
                                  </button>
                                </div>
                              </Reorder.Item>
                            );
                          })}
                        </Reorder.Group>

                        {/* Add to this specific page button */}
                        <div className="pt-2">
                           <div className="relative group/add">
                              <button className="w-full py-3 border-2 border-dashed border-gray-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-300 hover:border-blue-200 hover:text-blue-400 transition-all flex items-center justify-center gap-2">
                                 <Plus size={12} /> Add to Page {pageIdx + 1}
                              </button>
                              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 opacity-0 group-hover/add:opacity-100 translate-y-2 group-hover/add:translate-y-0 pointer-events-none group-hover/add:pointer-events-auto transition-all z-20">
                                 <div className="grid grid-cols-2 gap-2">
                                    {ALL_SECTIONS.filter(s => !data.sectionOrder.includes(s.id)).map(s => (
                                      <button
                                        key={s.id}
                                        onClick={() => {
                                          const newPages = [...(data.pages || [data.sectionOrder])].map(p => [...p]);
                                          newPages[pageIdx].push(s.id);
                                          setPages(newPages);
                                        }}
                                        className="px-3 py-2 bg-gray-50 rounded-xl text-[8px] font-black uppercase tracking-widest text-gray-500 hover:bg-blue-600 hover:text-white transition-all text-center"
                                      >
                                        {s.label}
                                      </button>
                                    ))}
                                    {ALL_SECTIONS.filter(s => !data.sectionOrder.includes(s.id)).length === 0 && (
                                      <p className="col-span-2 text-[8px] text-gray-400 font-bold uppercase text-center italic">All modules active</p>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50">
                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-4 px-1">Available Modules</p>
                   <div className="flex flex-wrap gap-2">
                     {ALL_SECTIONS.filter(s => !data.sectionOrder.includes(s.id)).map(s => (
                       <button
                         key={s.id}
                         onClick={() => toggleSection(s.id)}
                         className="px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all border border-transparent hover:border-blue-100"
                       >
                         + {s.label}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {currentStep === "finish" && (
              <div className="space-y-12 py-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center text-blue-600 mx-auto mb-6">
                    <Save size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Process Complete</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest max-w-xs mx-auto">
                    Your resume data is currently stored in your session. Export the blueprint to back it up.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 max-w-xs mx-auto text-gray-900 tracking-normal">
                  <button 
                    onClick={exportToJson}
                    className="flex items-center justify-between p-6 bg-gray-900 text-white rounded-[32px] hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 group shadow-2xl shadow-gray-200"
                  >
                    <div className="flex items-center gap-4">
                       <FileJson size={24} className="text-blue-500" />
                       <div className="text-left">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] block">Export Forge</span>
                         <span className="text-[9px] text-gray-500 font-bold">Download JSON File</span>
                       </div>
                    </div>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="relative group">
                    <button 
                      onClick={() => jsonImportRef.current?.click()}
                      className="w-full flex items-center justify-between p-6 bg-white border-2 border-gray-100 rounded-[32px] hover:border-blue-200 transition-all active:scale-95 group"
                    >
                      <div className="flex items-center gap-4">
                        <Upload size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <div className="text-left">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] block text-gray-900">Import Load</span>
                          <span className="text-[9px] text-gray-400 font-bold">Load Previous JSON</span>
                        </div>
                      </div>
                      <input type="file" ref={jsonImportRef} onChange={handleJsonImport} accept=".json" className="hidden" />
                    </button>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse ring-4 ring-blue-50" />
                  </div>
                </div>

                <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100/50">
                   <div className="flex items-center gap-3 mb-4">
                      <Sparkles size={16} className="text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Pro Tip</span>
                   </div>
                   <p className="text-[11px] leading-relaxed text-blue-700/70 font-medium tracking-normal">
                     You can switch templates on the left anytime. Your data will adapt automatically to the design selected.
                   </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="pt-4 md:pt-8 border-t border-gray-50 flex items-center justify-between gap-4">
        <button
          disabled={currentStepIndex === 0}
          onClick={() => setCurrentStep(steps[currentStepIndex - 1].id)}
          className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-all px-2 md:px-4 py-2 shrink-0"
        >
          <ChevronLeft size={14} className="hidden md:block" /> Prev
        </button>
        
        {currentStepIndex < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(steps[currentStepIndex + 1].id)}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-blue-600 text-white px-4 md:px-8 py-3 md:py-4 rounded-[16px] md:rounded-[24px] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 group"
          >
            Next Step <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
