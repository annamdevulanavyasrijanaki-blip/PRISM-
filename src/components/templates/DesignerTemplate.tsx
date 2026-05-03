import { ResumeData } from "../../types";
import { SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CustomSectionRenderer } from "../ResumeSections";

export default function DesignerTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder, template } = data;

  const isVisible = (id: string) => sectionOrder.includes(id);

  return (
    <div className="bg-[#111] text-white p-12 min-h-[297mm] w-full mx-auto font-sans">
      {/* Visual Header */}
      <header className="relative mb-20">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-20" />
        <div className="relative z-10">
           <h1 className="text-8xl font-black italic tracking-tighter leading-[0.8] mb-6 outline-text text-transparent" style={{ WebkitTextStroke: '1px white' }}>
             {personal.fullName.split(' ')[0]} <br />
             <span className="text-white not-italic">{personal.fullName.split(' ')[1]}</span>
           </h1>
           <div className="flex gap-4">
              <span className="px-4 py-1 bg-white text-black font-black uppercase text-[10px] tracking-widest">{personal.jobTitle}</span>
              <span className="px-4 py-1 border border-white text-white font-bold uppercase text-[10px] tracking-widest">{personal.location}</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-1 space-y-12">
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Contact</p>
              <div className="space-y-1 text-xs opacity-60 font-bold">
                 <p className="break-all">{personal.email}</p>
                 <p>{personal.phone}</p>
                 {personal.website && <p className="text-orange-400 break-all">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</p>}
              </div>
           </div>

           {isVisible("skills") && (
             <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Toolset</p>
                <SkillsSection data={data} templateType={template} />
             </div>
           )}

           {isVisible("education") && (
             <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Education</p>
                <EducationSection data={data} templateType={template} />
             </div>
           )}
        </div>

        <div className="col-span-2 space-y-16">
          {isVisible("summary") && (
            <div className="text-2xl font-light leading-relaxed border-l-2 border-orange-600 pl-8 opacity-80">
              <SummarySection data={data} templateType={template} />
            </div>
          )}

          {isVisible("experience") && (
            <div className="space-y-8">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Career Trajectory</p>
               <ExperienceSection data={data} templateType={template} />
            </div>
          )}

          {isVisible("projects") && (
            <div className="space-y-8">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Featured Builds</p>
               <ProjectsSection data={data} templateType={template} />
            </div>
          )}

          <CustomSectionRenderer data={data} templateType={template} />
        </div>
      </div>
    </div>
  );
}
