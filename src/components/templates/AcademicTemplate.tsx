import { ResumeData } from "../../types";
import { SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CertificationsSection, AwardsSection, CustomSectionRenderer } from "../ResumeSections";

export default function AcademicTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder, template } = data;

  const isVisible = (id: string) => sectionOrder.includes(id);

  return (
    <div className="bg-white text-gray-900 p-16 min-h-[297mm] w-full mx-auto shadow-2xl print:shadow-none font-serif leading-relaxed">
      {/* Header */}
      <header className="border-b border-gray-200 pb-10 mb-10 text-center">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-4">{personal.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 italic">
          <p>{personal.email}</p>
          <p>{personal.phone}</p>
          <p>{personal.location}</p>
          {personal.website && <p className="text-blue-600">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</p>}
        </div>
        <div className="flex justify-center gap-4 mt-4 text-[10px] uppercase tracking-widest text-gray-400">
           {personal.linkedin && <span>LinkedIn</span>}
           {personal.github && <span>GitHub</span>}
        </div>
      </header>

      <div className="space-y-10">
        {isVisible("summary") && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 text-gray-400">Personal Statement</h2>
            <SummarySection data={data} templateType={template} />
          </section>
        )}

        {isVisible("education") && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 text-gray-400">Education</h2>
            <EducationSection data={data} templateType={template} />
          </section>
        )}

        {isVisible("experience") && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 text-gray-400">Professional Experience</h2>
            <ExperienceSection data={data} templateType={template} />
          </section>
        )}

        {isVisible("projects") && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 text-gray-400">Publications & Research</h2>
            <ProjectsSection data={data} templateType={template} />
          </section>
        )}

        {isVisible("skills") && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 text-gray-400">Domain Expertise</h2>
            <SkillsSection data={data} templateType={template} />
          </section>
        )}

        <CertificationsSection data={data} templateType={template} />
        <AwardsSection data={data} templateType={template} />
        <CustomSectionRenderer data={data} templateType={template} />
      </div>
    </div>
  );
}
