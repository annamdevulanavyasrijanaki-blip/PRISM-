import { ResumeData } from "../../types";
import { cn, getDynamicFontSize } from "../../lib/utils";

export default function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, skills, projects, certifications = [], awards = [], languages = [], interests = [], sectionOrder } = data;

  const isVisible = (id: string) => sectionOrder.includes(id);

  return (
    <div className="bg-[#FAF9F6] text-slate-800 flex min-h-[297mm] w-full mx-auto shadow-2xl print:shadow-none font-sans overflow-visible">
      {/* Sidebar */}
      <div className="w-[30%] bg-slate-900 text-white p-8 space-y-8 overflow-hidden shrink-0">
        {personal.profileImage && (
           <div className="w-32 h-32 rounded-3xl border-4 border-blue-500 overflow-hidden mx-auto mb-8 shadow-2xl rotate-3 flex-shrink-0">
             <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover" />
           </div>
        )}
        <div className={cn("space-y-4 min-w-0 max-w-full", !personal.profileImage && "pt-12")}>
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

        <section className="space-y-4 pt-8">
          <h2 className="res-scale-text-xs uppercase tracking-[0.3em] font-black text-blue-400">Contact</h2>
          <div className="res-scale-text-xs space-y-2 opacity-80 font-medium overflow-hidden">
            <p className="flex items-center gap-2 text-[10px] break-all">{personal.email}</p>
            <p className="flex items-center gap-2 text-[10px] break-all">{personal.phone}</p>
            <p className="flex items-center gap-2 text-[10px] break-all">{personal.location}</p>
            {personal.website && (
              <p className="flex items-center gap-2 text-[10px] text-blue-400 font-bold break-all">
                {personal.website.replace(/^https?:\/\/(www\.)?/, '')}
              </p>
            )}
            <div className="pt-2 space-y-1 border-t border-slate-800">
               {personal.linkedin && <p className="break-all text-[9px] text-blue-300 font-bold">{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</p>}
               {personal.github && <p className="break-all text-[9px] text-blue-300 font-bold">{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</p>}
               {personal.leetcode && <p className="break-all text-[9px] text-blue-300 font-bold">{personal.leetcode.replace(/^https?:\/\/(www\.)?/, '')}</p>}
               {personal.hackathon && <p className="break-all text-[9px] text-blue-300 font-bold">{personal.hackathon.replace(/^https?:\/\/(www\.)?/, '')}</p>}
            </div>
          </div>
        </section>

        {skills.length > 0 && isVisible('skills') && (
          <section className="space-y-4">
            <h2 className="res-scale-text-xs uppercase tracking-[0.3em] font-black text-blue-400">Skills</h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex justify-between uppercase font-bold" style={{ fontSize: 'calc(0.6rem * var(--res-font-scale))' }}>
                    <span>{skill.name}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: skill.level === 'Expert' ? '100%' : skill.level === 'Intermediate' ? '70%' : '40%' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && isVisible('education') && (
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-400">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <p className="text-[10px] font-bold">{edu.degree}</p>
                <p className="text-[9px] opacity-60">{edu.school}</p>
                <p className="text-[8px] opacity-40">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}

        {languages.length > 0 && isVisible('languages') && (
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-400">Languages</h2>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center text-[10px]">
                  <span className="font-bold opacity-80">{lang.name}</span>
                  <span className="opacity-40 italic">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 space-y-12">
        {personal.summary && isVisible('summary') && (
          <section className="space-y-4">
            <h2 className="res-scale-text-xs uppercase tracking-[0.4em] font-black border-l-4 border-blue-500 pl-4">Profile</h2>
            <p className="res-scale-text-sm leading-relaxed opacity-70 italic">
              "{personal.summary}"
            </p>
          </section>
        )}

        {experience.length > 0 && isVisible('experience') && (
          <section className="space-y-8">
            <h2 className="res-scale-text-xs uppercase tracking-[0.4em] font-black border-l-4 border-blue-500 pl-4">Experience</h2>
            <div className="space-y-10">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold res-scale-text-xl">{exp.position}</h3>
                    <span className="res-scale-text-xs uppercase font-bold opacity-40">
                      {exp.startDate} — {exp.current ? "Now" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-blue-600 res-scale-text-xs font-bold uppercase tracking-wider mb-4">{exp.company}</p>
                  <p className="res-scale-text-sm leading-relaxed opacity-70 whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && isVisible('projects') && (
          <section className="space-y-6">
            <h2 className="text-xs uppercase tracking-[0.4em] font-black border-l-4 border-blue-500 pl-4">Projects</h2>
            <div className="grid grid-cols-1 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white p-4 border border-slate-100 shadow-sm rounded-lg">
                  <h3 className="font-bold text-sm mb-1">{proj.name}</h3>
                  <p className="text-[11px] opacity-60 leading-relaxed">{proj.description}</p>
                  {proj.link && <p className="text-[9px] text-blue-500 mt-2 font-bold">{proj.link}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && isVisible('certifications') && (
          <section className="space-y-6">
            <h2 className="text-xs uppercase tracking-[0.4em] font-black border-l-4 border-blue-500 pl-4">Certifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="space-y-1">
                  <p className="font-bold text-[11px]">{cert.name}</p>
                  <p className="text-[10px] text-blue-600 opacity-60">{cert.issuer}</p>
                  <p className="text-[9px] opacity-40">{cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {awards.length > 0 && isVisible('awards') && (
          <section className="space-y-6">
            <h2 className="text-xs uppercase tracking-[0.4em] font-black border-l-4 border-blue-500 pl-4">Awards</h2>
            <div className="space-y-4">
              {awards.map((award) => (
                <div key={award.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[11px]">{award.title}</p>
                    <p className="text-[10px] opacity-60">{award.description}</p>
                  </div>
                  <span className="text-[9px] opacity-40">{award.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
