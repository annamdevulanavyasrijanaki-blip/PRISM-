import { ResumeData } from "../../types";
import { SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CustomSectionRenderer } from "../ResumeSections";

export default function BrutalistTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder, template } = data;

  const isVisible = (id: string) => sectionOrder.includes(id);

  return (
    <div className="bg-[#f0f0f0] text-black p-4 min-h-[297mm] w-full mx-auto shadow-none print:p-0 font-mono">
      <div className="border-4 border-black bg-white p-10 h-full">
        {/* Header */}
        <header className="border-b-4 border-black pb-10 mb-10 flex justify-between items-start gap-8">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-2">{personal.fullName}</h1>
            <p className="inline-block bg-black text-white px-4 py-1 text-sm font-bold uppercase">{personal.jobTitle}</p>
          </div>
          <div className="text-right space-y-1 text-xs font-bold uppercase">
            <p className="break-all">[{personal.email}]</p>
            <p>[{personal.phone}]</p>
            <p>[{personal.location}]</p>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-12">
          {/* Main */}
          <div className="col-span-8 space-y-12">
            {isVisible("summary") && (
              <section>
                <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-black inline-block">Abstract</h2>
                <SummarySection data={data} templateType={template} />
              </section>
            )}

            {isVisible("experience") && (
              <section className="space-y-6">
                <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black inline-block">Trace Log</h2>
                <ExperienceSection data={data} templateType={template} />
              </section>
            )}

            {isVisible("projects") && (
              <section className="space-y-6">
                <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black inline-block">Deployments</h2>
                <ProjectsSection data={data} templateType={template} />
              </section>
            )}
          </div>

          {/* Side */}
          <div className="col-span-4 space-y-12">
            {isVisible("skills") && (
              <section className="border-4 border-black p-6 bg-yellow-300">
                <h2 className="text-xl font-black uppercase mb-4 underline decoration-4">Tech Stack</h2>
                <SkillsSection data={data} templateType={template} />
              </section>
            )}

            {isVisible("education") && (
              <section>
                <h2 className="text-xl font-black uppercase mb-4 border-b-2 border-black inline-block">Training</h2>
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
