import { ResumeData } from "../../types";
import { ResumeMasterRenderer } from "../ResumeSections";
import { getDynamicFontSize } from "../../lib/utils";

export default function ProfessionalTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  const pages = data.pages || [data.sectionOrder];

  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-0">
      {pages.map((page, idx) => (
        <div key={idx} className="resume-page-wrap bg-white text-gray-800 p-12 min-h-[297mm] w-full mx-auto shadow-lg print:shadow-none print:p-0 font-serif flex flex-col print:break-after-page">
          {idx === 0 && (
            <header className="text-center border-b border-gray-300 pb-8 mb-8">
              {personal.profileImage && (
                <div className="mb-6">
                  <div className="w-24 h-24 rounded-full mx-auto border-2 border-gray-100 overflow-hidden p-1 bg-white shadow-sm">
                     <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
              )}
              <h1 
                className="font-bold text-gray-900 tracking-tight mb-2 break-words leading-tight"
                style={{ fontSize: getDynamicFontSize(personal.fullName, 2.5, 1.5, 20, data.settings?.fontSize || 1) }}
              >
                {personal.fullName}
              </h1>
              <div className="flex justify-center flex-wrap gap-x-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {personal.location && <span>{personal.location}</span>}
                {personal.location && (personal.phone || personal.email) && <span>•</span>}
                {personal.phone && <span>{personal.phone}</span>}
                {personal.phone && personal.email && <span>•</span>}
                {personal.email && <span>{personal.email}</span>}
                {personal.website && (
                  <>
                    {(personal.location || personal.phone || personal.email) && <span>•</span>}
                    <span className="text-blue-600">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </>
                )}
              </div>
              <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-8">
                {personal.linkedin && (
                   <span className="text-blue-700 break-all">{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                )}
                {personal.github && (
                   <span className="text-gray-900 break-all">{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                )}
                {personal.leetcode && (
                   <span className="text-orange-700 break-all">{personal.leetcode.replace(/^https?:\/\/(www\.)?/, '')}</span>
                )}
                {personal.hackathon && (
                   <span className="text-cyan-700 break-all">{personal.hackathon.replace(/^https?:\/\/(www\.)?/, '')}</span>
                )}
              </div>
            </header>
          )}

          {/* Dynamic Master Renderer */}
          <ResumeMasterRenderer data={data} templateType="professional" pageIndex={idx} />
          
          <div className="mt-auto pt-8 flex justify-between items-center no-print">
             <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest italic">Page {idx + 1} of {pages.length}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
