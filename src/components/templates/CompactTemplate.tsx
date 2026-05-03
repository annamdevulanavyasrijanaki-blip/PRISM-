import { ResumeData } from "../../types";
import { SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CustomSectionRenderer } from "../ResumeSections";

export default function CompactTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder, template } = data;

  const isVisible = (id: string) => sectionOrder.includes(id);

  return (
    <div className="bg-white text-gray-900 p-10 min-h-[297mm] w-full mx-auto font-sans leading-tight text-[11px]">
      {/* Tight Header */}
      <header className="flex justify-between items-end border-b-2 border-gray-900 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{personal.fullName}</h1>
          <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest">{personal.jobTitle}</p>
        </div>
        <div className="text-right text-[10px] font-bold space-y-0.5">
          <p className="break-all">{personal.location} | {personal.phone}</p>
          <p className="break-all">{personal.email}</p>
          {personal.website && <p className="text-blue-700 break-all">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</p>}
        </div>
      </header>

      <div className="space-y-6">
        {isVisible("summary") && (
          <section>
            <SummarySection data={data} templateType={template} />
          </section>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            {isVisible("experience") && (
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-widest border-l-4 border-gray-900 pl-2 mb-3 bg-gray-50 py-1">Professional Background</h2>
                <div className="prose-tight">
                  <ExperienceSection data={data} templateType={template} />
                </div>
              </section>
            )}

            {isVisible("projects") && (
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-widest border-l-4 border-gray-900 pl-2 mb-3 bg-gray-50 py-1">Major Initiatives</h2>
                <ProjectsSection data={data} templateType={template} />
              </section>
            )}
          </div>

          <div className="col-span-4 space-y-6">
            {isVisible("skills") && (
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-widest border-l-4 border-gray-900 pl-2 mb-3 bg-gray-50 py-1">Tech Matrix</h2>
                <SkillsSection data={data} templateType={template} />
              </section>
            )}

            {isVisible("education") && (
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-widest border-l-4 border-gray-900 pl-2 mb-3 bg-gray-50 py-1">Credentials</h2>
                <EducationSection data={data} templateType={template} />
              </section>
            )}
            
            <CustomSectionRenderer data={data} templateType={template} />
          </div>
        </div>
      </div>
    </div>
  );
}
