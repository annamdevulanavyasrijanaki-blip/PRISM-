import { ResumeData } from "../../types";
import { ResumeMasterRenderer } from "../ResumeSections";
import { getDynamicFontSize } from "../../lib/utils";

export default function AcademicTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder } = data;
  const pages = data.pages || [sectionOrder];

  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-0">
      {pages.map((pageSections, idx) => (
        <div key={idx} className="resume-page-wrap bg-white text-gray-900 p-16 min-h-[297mm] w-full mx-auto shadow-2xl print:shadow-none font-serif leading-relaxed flex flex-col print:break-after-page">
          {/* Header */}
          {idx === 0 && (
            <header className="border-b border-gray-200 pb-10 mb-10 text-center">
              <h1 
                className="font-light tracking-tight text-gray-900 mb-4 break-words"
                style={{ fontSize: getDynamicFontSize(personal.fullName, 2.5, 1.5, 20, data.settings?.fontSize || 1) }}
              >
                {personal.fullName}
              </h1>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 italic">
                <p>{personal.email}</p>
                <p>{personal.phone}</p>
                <p>{personal.location}</p>
                {personal.website && <p className="text-blue-600">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</p>}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                {personal.linkedin && <span>LinkedIn</span>}
                {personal.github && <span>GitHub</span>}
                {personal.leetcode && <span>LeetCode</span>}
              </div>
            </header>
          )}

          <div className="flex-1 academic-renderer">
            <ResumeMasterRenderer data={data} templateType="academic" pageIndex={idx} />
          </div>

          <div className="mt-auto pt-8 flex justify-center no-print">
             <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest italic">Page {idx + 1} of {pages.length}</p>
          </div>

          <style>{`
            .academic-renderer h3 { 
              font-family: serif; 
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              font-size: 0.75rem;
              color: #94a3b8;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 0.5rem;
              margin-bottom: 1.5rem;
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
