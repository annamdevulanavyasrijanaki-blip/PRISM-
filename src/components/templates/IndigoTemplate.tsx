import { ResumeData } from "../../types";
import { SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CustomSectionRenderer } from "../ResumeSections";

export default function IndigoTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder, template } = data;

  const isVisible = (id: string) => sectionOrder.includes(id);

  return (
    <div className="bg-white text-slate-800 flex min-h-[297mm] w-full mx-auto shadow-2xl print:shadow-none font-sans">
      {/* Sidebar */}
      <div className="w-[320px] shrink-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-slate-100 p-10 space-y-12">
        <div>
          {personal.profileImage && (
            <div className="mb-8 w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-indigo-500/20">
              <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
          <h1 className="text-3xl font-black tracking-tighter leading-none mb-2 break-words">{personal.fullName}</h1>
          <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] break-words">{personal.jobTitle}</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 border-b border-indigo-500/30 pb-2">Contact</h2>
          <div className="space-y-3 text-xs opacity-80">
            <p className="break-all">{personal.email}</p>
            <p>{personal.phone}</p>
            <p>{personal.location}</p>
            {personal.website && <p className="text-indigo-300 break-all">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</p>}
          </div>
        </div>

        {isVisible("skills") && (
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 border-b border-indigo-500/30 pb-2">Expertise</h2>
            <SkillsSection data={data} templateType={template} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 space-y-12">
        {isVisible("summary") && (
          <section className="relative">
            <div className="absolute -left-12 top-0 w-2 h-12 bg-indigo-600 rounded-r-full" />
            <SummarySection data={data} templateType={template} />
          </section>
        )}

        {isVisible("experience") && (
          <section>
            <h2 className="text-xl font-black text-indigo-900 mb-6 uppercase tracking-tight">Experience History</h2>
            <ExperienceSection data={data} templateType={template} />
          </section>
        )}

        {isVisible("projects") && (
          <section>
            <h2 className="text-xl font-black text-indigo-900 mb-6 uppercase tracking-tight">Key Initiatives</h2>
            <ProjectsSection data={data} templateType={template} />
          </section>
        )}

        {isVisible("education") && (
          <section>
            <h2 className="text-xl font-black text-indigo-900 mb-6 uppercase tracking-tight">Academic Background</h2>
            <EducationSection data={data} templateType={template} />
          </section>
        )}

        <CustomSectionRenderer data={data} templateType={template} />
      </div>
    </div>
  );
}
