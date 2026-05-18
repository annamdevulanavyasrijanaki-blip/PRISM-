import { ResumeData } from "../../types";
import { cn, getDynamicFontSize, hasData } from "../../lib/utils";
import { ResumeMasterRenderer, SkillsSection, EducationSection, LanguagesSection } from "../ResumeSections";

export default function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder, template } = data;
  const pages = data.pages || [sectionOrder];

  const isVisible = (id: string, pageSections: string[]) => pageSections.includes(id) && hasData(id, data);

  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-0">
      {pages.map((pageSections, idx) => (
        <div key={idx} className="resume-page-wrap bg-[#FAF9F6] text-slate-800 flex min-h-[297mm] w-full mx-auto shadow-2xl print:shadow-none font-sans flex-row print:break-after-page">
          {/* Sidebar - Repeating content vs page 1 unique? Often sidebars repeat key info but keep list minimal */}
          <div className="w-[30%] bg-slate-900 text-white p-8 space-y-8 overflow-hidden shrink-0 flex flex-col">
            <div>
              {idx === 0 && personal.profileImage && (
                <div className="w-32 h-32 rounded-3xl border-4 border-blue-500 overflow-hidden mx-auto mb-8 shadow-2xl rotate-3 flex-shrink-0">
                  <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover" />
                </div>
              )}
              <div className={cn("space-y-4 min-w-0 max-w-full", (idx > 0 || !personal.profileImage) && "pt-6")}>
                <div className="w-16 h-1 w-full bg-blue-500" />
                <h1 
                  className="font-black uppercase tracking-tighter break-words leading-[0.9]"
                  style={{ 
                    fontSize: getDynamicFontSize(personal.fullName, 2.5, 1.0, 10, data.settings?.fontSize || 1)
                  }}
                >
                  {personal.fullName}
                </h1>
                <p className="res-scale-text-xs uppercase tracking-widest font-bold opacity-60 italic break-words">
                  {personal.jobTitle}
                </p>
              </div>
            </div>

            <section className="space-y-4 pt-4">
              <h2 className="res-scale-text-xs uppercase tracking-[0.3em] font-black text-blue-400">
                {data.sectionLabels?.contact || "Contact"}
              </h2>
              <div className="res-scale-text-xs space-y-2 opacity-80 font-medium overflow-hidden">
                <p className="flex items-center gap-2 text-[10px] break-all">{personal.email}</p>
                <p className="flex items-center gap-2 text-[10px] break-all">{personal.phone}</p>
                <p className="flex items-center gap-2 text-[10px] break-all">{personal.location}</p>
              </div>
            </section>

            {isVisible("skills", pageSections) && (
              <div className="space-y-4">
                <h2 className="res-scale-text-xs uppercase tracking-[0.3em] font-black text-blue-400">
                  {data.sectionLabels?.skills || "Expertise"}
                </h2>
                <SkillsSection data={data} templateType={template} />
              </div>
            )}

            {isVisible("education", pageSections) && (
               <div className="space-y-4">
                <h2 className="res-scale-text-xs uppercase tracking-[0.3em] font-black text-blue-400">
                  {data.sectionLabels?.education || "Education"}
                </h2>
                <EducationSection data={data} templateType={template} />
              </div>
            )}

            {isVisible("languages", pageSections) && (
               <div className="space-y-4">
                <h2 className="res-scale-text-xs uppercase tracking-[0.3em] font-black text-blue-400">
                  {data.sectionLabels?.languages || "Languages"}
                </h2>
                <LanguagesSection data={data} templateType={template} />
              </div>
            )}
            
            <div className="mt-auto no-print opacity-20">
               <p className="text-[8px] font-black uppercase tracking-widest italic">P.{idx + 1}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-12 space-y-12 flex flex-col">
            <ResumeMasterRenderer data={data} templateType="creative" pageIndex={idx} />
            
            <div className="mt-auto pt-8 flex justify-end items-center no-print opacity-50">
               <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest italic">Page {idx + 1} of {pages.length}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
