import { ResumeData } from "../../types";
import { SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CustomSectionRenderer } from "../ResumeSections";

export default function ElegantTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder, template } = data;

  const isVisible = (id: string) => sectionOrder.includes(id);

  return (
    <div className="bg-[#fffcf9] text-[#1c1c1c] p-24 min-h-[297mm] w-full mx-auto shadow-2xl print:p-0 font-serif leading-relaxed">
      {/* Centered Header */}
      <header className="text-center mb-20">
        <h1 className="text-5xl font-light tracking-[0.1em] text-gray-900 mb-6 uppercase">{personal.fullName}</h1>
        <div className="flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
           <span>{personal.location}</span>
           <span className="w-1 h-1 bg-amber-600 rounded-full" />
           <span>{personal.email}</span>
           <span className="w-1 h-1 bg-amber-600 rounded-full" />
           <span>{personal.phone}</span>
        </div>
        <div className="mt-12 max-w-2xl mx-auto border-t border-amber-100 pt-8 italic text-lg text-gray-500">
           {personal.jobTitle}
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-20">
        {isVisible("summary") && (
          <section className="text-center">
            <SummarySection data={data} templateType={template} />
          </section>
        )}

        {isVisible("experience") && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-amber-700 mb-10 text-center">Exhibition of Experience</h2>
            <ExperienceSection data={data} templateType={template} />
          </section>
        )}

        <div className="grid grid-cols-2 gap-20">
          {isVisible("skills") && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-amber-700 mb-8">Specializations</h2>
              <SkillsSection data={data} templateType={template} />
            </section>
          )}

          {isVisible("education") && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-amber-700 mb-8">Foundational Studies</h2>
              <EducationSection data={data} templateType={template} />
            </section>
          )}
        </div>

        {isVisible("projects") && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-amber-700 mb-10 text-center">Notable Works</h2>
            <ProjectsSection data={data} templateType={template} />
          </section>
        )}

        <CustomSectionRenderer data={data} templateType={template} />
      </div>
    </div>
  );
}
