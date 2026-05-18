import { ResumeData } from "../../types";
import { SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CustomSectionRenderer } from "../ResumeSections";
import { hasData } from "../../lib/utils";

export default function IndigoTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder, template } = data;
  const pages = data.pages || [sectionOrder];

  const isVisible = (id: string, pageSections: string[]) => pageSections.includes(id) && hasData(id, data);

  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-0">
      {pages.map((pageSections, idx) => (
        <div key={idx} className="resume-page-wrap bg-white text-slate-800 flex min-h-[297mm] w-full mx-auto shadow-2xl print:shadow-none font-sans flex-row print:break-after-page">
          {/* Sidebar - Repeats on every page or just first? Usually repeated for these types of templates */}
          <div className="w-[320px] shrink-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-slate-100 p-10 space-y-12">
            <div>
              {idx === 0 && personal.profileImage && (
                <div className="mb-8 w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-indigo-500/20">
                  <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              <h1 className="text-3xl font-black tracking-tighter leading-none mb-2 break-words">{personal.fullName}</h1>
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] break-words">{personal.jobTitle}</p>
            </div>

            <div className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 border-b border-indigo-500/30 pb-2">
                {data.sectionLabels?.contact || "Contact"}
              </h2>
              <div className="space-y-3 text-xs opacity-80">
                <p className="break-all">{personal.email}</p>
                <p>{personal.phone}</p>
                <p>{personal.location}</p>
                {personal.website && <p className="text-indigo-300 break-all">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</p>}
              </div>
            </div>

            {isVisible("skills", pageSections) && (
              <div className="space-y-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 border-b border-indigo-500/30 pb-2">
                  {data.sectionLabels?.skills || "Expertise"}
                </h2>
                <SkillsSection data={data} templateType={template} />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-12 space-y-12 flex flex-col">
            {isVisible("summary", pageSections) && (
              <section className="relative">
                <div className="absolute -left-12 top-0 w-2 h-12 bg-indigo-600 rounded-r-full" />
                <SummarySection data={data} templateType={template} />
              </section>
            )}

            {isVisible("experience", pageSections) && (
              <section>
                <h2 className="text-xl font-black text-indigo-900 mb-6 uppercase tracking-tight">
                  {data.sectionLabels?.experience || "Experience History"}
                </h2>
                <ExperienceSection data={data} templateType={template} />
              </section>
            )}

            {isVisible("projects", pageSections) && (
              <section>
                <h2 className="text-xl font-black text-indigo-900 mb-6 uppercase tracking-tight">
                  {data.sectionLabels?.projects || "Key Initiatives"}
                </h2>
                <ProjectsSection data={data} templateType={template} />
              </section>
            )}

            {isVisible("education", pageSections) && (
              <section>
                <h2 className="text-xl font-black text-indigo-900 mb-6 uppercase tracking-tight">
                  {data.sectionLabels?.education || "Academic Background"}
                </h2>
                <EducationSection data={data} templateType={template} />
              </section>
            )}

            {pageSections.includes('custom') && <CustomSectionRenderer data={data} templateType={template} />}

            <div className="mt-auto pt-8 flex justify-end no-print">
               <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest italic">Page {idx + 1} of {pages.length}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
