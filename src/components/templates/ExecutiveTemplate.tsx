import { ResumeData } from "../../types";
import { getDynamicFontSize, hasData } from "../../lib/utils";

export default function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, skills, sectionOrder } = data;
  const isVisible = (id: string) => sectionOrder.includes(id) && hasData(id, data);

  return (
    <div className="bg-white text-[#1a1a1a] p-16 min-h-[297mm] w-full mx-auto shadow-2xl print:shadow-none font-serif">
      <header className="text-center mb-12 border-b-2 border-double border-gray-900 pb-10">
        {personal.profileImage && (
          <div className="flex justify-center mb-8">
            <div className="w-28 h-28 border-4 border-gray-900 p-1.5 shadow-[10px_10px_0px_rgba(0,0,0,0.05)] bg-white">
               <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover grayscale brightness-110" />
            </div>
          </div>
        )}
        <h1 
          className="font-black tracking-tight mb-4 uppercase smart-wrap break-normal hyphens-none leading-tight"
          style={{ fontSize: getDynamicFontSize(personal.fullName, 3.5, 2, 20, data.settings?.fontSize || 1) }}
        >
          {personal.fullName}
        </h1>
        <div className="flex justify-center flex-wrap gap-x-6 text-[10px] uppercase tracking-widest font-bold text-gray-500">
          <span className="break-all">{personal.location}</span>
          <span>•</span>
          <span className="break-all">{personal.email}</span>
          <span>•</span>
          <span className="break-all">{personal.phone}</span>
          {personal.website && (
            <>
              <span>•</span>
              <span className="text-blue-600 break-all">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </>
          )}
        </div>
        {(personal.linkedin || personal.github || personal.leetcode || personal.hackathon) && (
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-[8px] uppercase tracking-widest font-black text-gray-400 mt-4 pt-4 border-t border-gray-100 px-8">
             {personal.linkedin && <span className="text-gray-900 break-all">{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
             {personal.github && <span className="text-gray-900 break-all">{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
             {personal.leetcode && <span className="text-gray-900 break-all">{personal.leetcode.replace(/^https?:\/\/(www\.)?/, '')}</span>}
             {personal.hackathon && <span className="text-gray-900 break-all">{personal.hackathon.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          </div>
        )}
      </header>

      <div className="space-y-12">
        {isVisible('summary') && (
          <section className="text-center max-w-2xl mx-auto italic text-lg leading-relaxed text-gray-700">
            "{personal.summary}"
          </section>
        )}

        {isVisible('experience') && (
          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] border-b border-gray-200 pb-2 text-center">
              {data.sectionLabels?.experience || "Professional Trajectory"}
            </h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      {exp.position && <h3 className="text-xl font-bold">{exp.position}</h3>}
                      {exp.company && <p className="text-sm uppercase font-bold tracking-widest text-gray-500">{exp.company}</p>}
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded">
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && '—'} {exp.current ? "Present" : exp.endDate}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line font-sans">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-12 pt-8">
          {isVisible('education') && (
            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-gray-200 pb-2">
                {data.sectionLabels?.education || "Education"}
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    {edu.degree && <h3 className="font-bold text-gray-900">{edu.degree}</h3>}
                    {edu.school && <p className="text-sm text-gray-500 italic">{edu.school}</p>}
                    {(edu.startDate || edu.endDate) && <p className="text-[10px] font-bold mt-1 text-gray-400">{edu.startDate} {edu.startDate && edu.endDate && '—'} {edu.endDate}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {isVisible('skills') && (
            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-gray-200 pb-2">
                {data.sectionLabels?.skills || "Strategic Skills"}
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center text-xs border-b border-gray-50 pb-1">
                    <span className="font-bold text-gray-700">{skill.name}</span>
                    <span className="italic text-gray-400">{skill.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {isVisible('projects') && (
          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] border-b border-gray-200 pb-2 text-center">
              {data.sectionLabels?.projects || "Key Initiatives"}
            </h2>
            <div className="space-y-6">
              {data.projects?.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  {proj.name && <h3 className="font-bold text-lg">{proj.name}</h3>}
                  {proj.description && <p className="text-sm text-gray-600 italic font-sans leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {isVisible('certifications') && (
          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] border-b border-gray-200 pb-2 text-center">
              {data.sectionLabels?.certifications || "Certifications & Credentials"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications?.map((cert) => (
                <div key={cert.id} className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="font-bold text-xs">{cert.name}</p>
                  <p className="text-[10px] text-gray-500">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
