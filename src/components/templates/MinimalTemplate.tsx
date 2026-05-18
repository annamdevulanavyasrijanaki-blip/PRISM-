import { ResumeData } from "../../types";
import { ResumeMasterRenderer } from "../ResumeSections";
import { getDynamicFontSize, hasData } from "../../lib/utils";

export default function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, skills, projects, certifications = [], awards = [], languages = [], sectionOrder } = data;
  const pages = data.pages || [sectionOrder];

  const isVisible = (id: string, pageSections: string[]) => pageSections.includes(id) && hasData(id, data);

  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-0">
      {pages.map((pageSections, idx) => (
        <div key={idx} className="resume-page-wrap bg-white text-zinc-900 p-16 min-h-[297mm] w-full mx-auto shadow-lg print:shadow-none print:p-0 font-sans tracking-tight flex flex-col print:break-after-page">
          {/* Header */}
          {idx === 0 && (
            <header className="mb-16">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6 min-w-0 flex-1">
                  {personal.profileImage && (
                     <div className="w-16 h-16 rounded-full grayscale overflow-hidden border border-zinc-100 shadow-sm flex-shrink-0">
                       <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover" />
                     </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h1 
                      className="font-light text-zinc-900 mb-2 tracking-tighter break-words leading-tight"
                      style={{ fontSize: getDynamicFontSize(personal.fullName, 3, 1.75, 20, data.settings?.fontSize || 1) }}
                    >
                      {personal.fullName}
                    </h1>
                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-semibold break-words">
                      {personal.jobTitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest text-zinc-400 font-bold border-t border-zinc-100 pt-8">
                <div className="break-all">
                  <p>{personal.email}</p>
                  <p>{personal.phone}</p>
                </div>
                <div className="text-right break-all">
                  <p>{personal.location}</p>
                  {personal.website && <p className="text-zinc-900 font-black">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                </div>
              </div>
            </header>
          )}

          <div className="space-y-16 flex-1">
            {/* Summary */}
            {personal.summary && isVisible('summary', pageSections) && (
              <section className="grid grid-cols-4 gap-8">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">
                  {data.sectionLabels?.summary || "About"}
                </h2>
                <div className="col-span-3">
                  <p className="text-base text-zinc-700 leading-relaxed font-light whitespace-pre-line">
                    {personal.summary}
                  </p>
                </div>
              </section>
            )}

            {/* Socials */}
            {idx === 0 && (personal.linkedin || personal.github || personal.leetcode || personal.hackathon) && (
              <section className="grid grid-cols-4 gap-8">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">
                  {data.sectionLabels?.contact || "Connect"}
                </h2>
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    {personal.linkedin && (
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase text-zinc-300 font-black tracking-widest">LinkedIn</p>
                        <p className="text-[10px] uppercase tracking-widest font-black text-zinc-900 truncate max-w-[140px]">
                          {personal.linkedin.replace(/^https?:\/\/(www\.)?/, '').split('/')[1] || personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                      </div>
                    )}
                    {personal.github && (
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase text-zinc-300 font-black tracking-widest">GitHub</p>
                        <p className="text-[10px] uppercase tracking-widest font-black text-zinc-900 truncate max-w-[140px]">
                          {personal.github.replace(/^https?:\/\/(www\.)?/, '').split('/')[1] || personal.github.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                      </div>
                    )}
                    {personal.leetcode && (
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase text-zinc-300 font-black tracking-widest">LeetCode</p>
                        <p className="text-[10px] uppercase tracking-widest font-black text-zinc-900 truncate max-w-[140px]">
                          {personal.leetcode.replace(/^https?:\/\/(www\.)?/, '').split('/')[1] || personal.leetcode.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                      </div>
                    )}
                    {personal.hackathon && (
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase text-zinc-300 font-black tracking-widest">Profiles</p>
                        <p className="text-[10px] uppercase tracking-widest font-black text-zinc-900 truncate max-w-[140px]">
                          {personal.hackathon.replace(/^https?:\/\/(www\.)?/, '').split('/')[1] || personal.hackathon.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Experience */}
            {experience.length > 0 && isVisible('experience', pageSections) && (
              <section className="grid grid-cols-4 gap-8">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black pt-2">
                  {data.sectionLabels?.experience || "Experience"}
                </h2>
                <div className="col-span-3 space-y-12">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mb-2">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </p>
                      <h3 className="text-xl font-medium text-zinc-900 mb-1">{exp.position}</h3>
                      <p className="text-zinc-500 italic mb-4">{exp.company}</p>
                      <p className="text-sm text-zinc-600 leading-relaxed font-light whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && isVisible('education', pageSections) && (
              <section className="grid grid-cols-4 gap-8">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black pt-2">
                  {data.sectionLabels?.education || "Education"}
                </h2>
                <div className="col-span-3 space-y-8">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mb-2">
                        {edu.startDate} — {edu.endDate}
                      </p>
                      <h3 className="text-lg font-medium text-zinc-900">{edu.degree}</h3>
                      <p className="text-zinc-500 italic">{edu.school}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && isVisible('skills', pageSections) && (
              <section className="grid grid-cols-4 gap-8">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">
                  {data.sectionLabels?.skills || "Competence"}
                </h2>
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-2">
                        <span className="text-sm text-zinc-800 font-medium">{skill.name}</span>
                        <span className="h-1 w-1 bg-zinc-300 rounded-full" />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Certifications for Minimal */}
            {certifications.length > 0 && isVisible('certifications', pageSections) && (
              <section className="grid grid-cols-4 gap-8">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">
                  {data.sectionLabels?.certifications || "Certs"}
                </h2>
                <div className="col-span-3 space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-baseline">
                      <div>
                        <p className="text-base font-medium">{cert.name}</p>
                        <p className="text-sm text-zinc-500 italic">{cert.issuer}</p>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {pageSections.includes('custom') && <ResumeMasterRenderer data={data} templateType="minimal" pageIndex={idx} />}
          </div>

          <div className="mt-auto pt-8 flex justify-end no-print">
             <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest italic">Page {idx + 1} of {pages.length}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
