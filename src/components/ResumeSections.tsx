import React from 'react';
import { ResumeData, Experience, Education, Skill, Project, Certification, Award, Volunteer, Language, Interest, CustomSection } from '../types';
import SectionWrapper from './SectionWrapper';
import { cn } from '../lib/utils';

interface SectionProps {
  data: ResumeData;
  templateType: string;
}

export function SummarySection({ data }: SectionProps) {
  if (!data.personal.summary) return null;
  return (
    <SectionWrapper title="Profile">
      <p className="res-scale-text-sm leading-relaxed text-gray-700 whitespace-pre-line">{data.personal.summary}</p>
    </SectionWrapper>
  );
}

export function ExperienceSection({ data }: SectionProps) {
  if (!data.experience || data.experience.length === 0) return null;
  return (
    <SectionWrapper title="Experience">
      <div className="space-y-6">
        {data.experience.map((exp: Experience) => (
          <div key={exp.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-900 res-scale-text-base break-words">{exp.position}</h4>
                <p className="res-scale-text-sm text-blue-600 font-medium truncate">{exp.company}</p>
              </div>
              <p className="res-scale-text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0 ml-4">
                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
              </p>
            </div>
            <p className="res-scale-text-xs text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function EducationSection({ data }: SectionProps) {
  if (!data.education || data.education.length === 0) return null;
  return (
    <SectionWrapper title="Education">
      <div className="space-y-6">
        {data.education.map((edu: Education) => (
          <div key={edu.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-900 res-scale-text-base break-words">{edu.degree}</h4>
                <p className="res-scale-text-sm text-blue-600 font-medium truncate">{edu.school}</p>
              </div>
              <p className="res-scale-text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0 ml-4">{edu.startDate} — {edu.endDate}</p>
            </div>
            {edu.description && <p className="res-scale-text-xs text-gray-600 whitespace-pre-line leading-relaxed">{edu.description}</p>}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function SkillsSection({ data }: SectionProps) {
  if (!data.skills || data.skills.length === 0) return null;
  return (
    <SectionWrapper title="Expertise">
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill: Skill) => (
          <div key={skill.id} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-2">
            <span className="res-scale-text-xs text-gray-700 font-bold">{skill.name}</span>
            <span className="res-scale-text-xs uppercase font-black tracking-widest text-blue-500 opacity-50" style={{ fontSize: 'calc(0.5rem * var(--res-font-scale))' }}>{skill.level}</span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function ProjectsSection({ data }: SectionProps) {
  if (!data.projects || data.projects.length === 0) return null;
  return (
    <SectionWrapper title="Featured Projects">
      <div className="space-y-6">
        {data.projects.map((proj: Project) => (
          <div key={proj.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-900 res-scale-text-base break-words">{proj.name}</h4>
              {proj.link && <span className="res-scale-text-xs font-bold text-blue-500 uppercase tracking-widest underline decoration-2 underline-offset-4 break-all ml-2">{proj.link.replace(/^https?:\/\/(www\.)?/, '')}</span>}
            </div>
            <p className="res-scale-text-xs text-gray-600 whitespace-pre-line leading-relaxed">{proj.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function CertificationsSection({ data }: SectionProps) {
  if (!data.certifications || data.certifications.length === 0) return null;
  return (
    <SectionWrapper title="Certifications">
      <div className="grid grid-cols-2 gap-4">
        {data.certifications.map((cert: Certification) => (
          <div key={cert.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
            <h4 className="font-bold text-gray-900 text-xs">{cert.name}</h4>
            <p className="text-[10px] text-blue-600 font-medium">{cert.issuer}</p>
            <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{cert.date}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function AwardsSection({ data }: SectionProps) {
  if (!data.awards || data.awards.length === 0) return null;
  return (
    <SectionWrapper title="Recognitions">
       <div className="space-y-4">
        {data.awards.map((award: Award) => (
          <div key={award.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-900 text-xs">{award.title}</h4>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{award.date}</span>
            </div>
            <p className="text-[10px] text-gray-600 leading-relaxed">{award.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function LanguagesSection({ data }: SectionProps) {
  if (!data.languages || data.languages.length === 0) return null;
  return (
    <SectionWrapper title="Linguistics">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {data.languages.map((lang: Language) => (
          <div key={lang.id} className="flex items-center gap-3">
            <span className="res-scale-text-xs font-bold text-gray-700">{lang.name}</span>
            <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
               <div className={cn("h-full bg-blue-500", 
                 lang.proficiency.toLowerCase() === 'native' ? 'w-full' :
                 lang.proficiency.toLowerCase() === 'fluent' ? 'w-4/5' :
                 lang.proficiency.toLowerCase() === 'intermediate' ? 'w-3/5' : 'w-2/5'
               )} />
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function VolunteerSection({ data }: SectionProps) {
  if (!data.volunteer || data.volunteer.length === 0) return null;
  return (
    <SectionWrapper title="Volunteer Work">
      <div className="space-y-6">
        {data.volunteer.map((v: Volunteer) => (
          <div key={v.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-900 res-scale-text-base">{v.role}</h4>
                <p className="res-scale-text-sm text-blue-600 font-medium">{v.organization}</p>
              </div>
              <p className="res-scale-text-xs font-bold text-gray-400 uppercase tracking-widest">{v.startDate} — {v.endDate}</p>
            </div>
            <p className="res-scale-text-xs text-gray-600 whitespace-pre-line leading-relaxed">{v.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function InterestsSection({ data }: SectionProps) {
  if (!data.interests || data.interests.length === 0) return null;
  return (
    <SectionWrapper title="Interests">
      <div className="flex flex-wrap gap-2 text-gray-600">
        {data.interests.map((interest, idx) => (
          <span key={interest.id} className="res-scale-text-xs font-medium bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
            {interest.name}
          </span>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function CustomSectionRenderer({ data }: SectionProps) {
  if (!data.customSections || data.customSections.length === 0) return null;
  return (
    <>
      {data.customSections.map((section: CustomSection) => (
        <div key={section.id}>
          <SectionWrapper title={section.title}>
            <div className="res-scale-text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {section.content}
            </div>
          </SectionWrapper>
        </div>
      ))}
    </>
  );
}

// Master Renderer Logic
export function ResumeMasterRenderer({ data, templateType }: SectionProps) {
  const fontSize = data.settings?.fontSize || 1;
  const sectionSpacing = data.settings?.sectionSpacing || 1;
  
  // Custom section renderer is special because it returns multiple sections
  const renderCustomSections = () => {
    return <CustomSectionRenderer data={data} templateType={templateType} />;
  };

  const sectionMap: Record<string, React.FC<SectionProps>> = {
    summary: SummarySection,
    experience: ExperienceSection,
    education: EducationSection,
    skills: SkillsSection,
    projects: ProjectsSection,
    certifications: CertificationsSection,
    awards: AwardsSection,
    languages: LanguagesSection,
    volunteer: VolunteerSection,
    interests: InterestsSection,
  };

  return (
    <div 
      className="flex flex-col" 
      style={{ 
        fontSize: `${fontSize}rem`,
        gap: `${sectionSpacing * 2}rem`
      }}
    >
      {data.sectionOrder.map((sectionId) => {
        if (sectionId === 'custom') {
          return <React.Fragment key="custom-sections-fragment">{renderCustomSections()}</React.Fragment>;
        }
        const SectionComponent = sectionMap[sectionId];
        return SectionComponent ? <SectionComponent key={sectionId} data={data} templateType={templateType} /> : null;
      })}
    </div>
  );
}
