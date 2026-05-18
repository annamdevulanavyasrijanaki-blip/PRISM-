import { ResumeData } from "../../types";
import { ResumeMasterRenderer } from "../ResumeSections";
import { getDynamicFontSize } from "../../lib/utils";

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  const pages = data.pages || [data.sectionOrder];

  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-0">
      {pages.map((page, idx) => (
        <div key={idx} className="resume-page-wrap bg-white text-gray-800 p-8 min-h-[297mm] w-full mx-auto shadow-lg print:shadow-none print:p-0 font-sans flex flex-col print:break-after-page">
          {idx === 0 && (
            <header className="border-b-4 border-blue-600 pb-6 mb-8 flex justify-between items-start gap-6">
              <div className="flex gap-6 items-center min-w-0 flex-1">
                {personal.profileImage && (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-blue-100 flex-shrink-0 relative group">
                     <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h1 
                    className="font-black uppercase tracking-tighter text-gray-900 leading-tight break-words"
                    style={{ fontSize: getDynamicFontSize(personal.fullName, 2.5, 1.5, 20, data.settings?.fontSize || 1) }}
                  >
                    {personal.fullName}
                  </h1>
                  <p className="text-xl text-blue-600 font-bold mt-2 uppercase tracking-tight break-words">{personal.jobTitle}</p>
                </div>
              </div>
              <div className="text-right text-gray-400 font-black uppercase tracking-widest flex-shrink-0 res-scale-text-xs space-y-1 max-w-[240px]">
                <p className="break-all">{personal.location}</p>
                <p className="break-all">{personal.email}</p>
                <p className="break-all">{personal.phone}</p>
                {personal.website && <p className="text-blue-500 break-all">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                <div className="flex flex-col items-start md:items-end gap-0.5 mt-1 border-t border-gray-100 pt-1">
                  {personal.linkedin && <p className="text-blue-700 break-all font-bold">{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                  {personal.github && <p className="text-gray-900 break-all font-bold">{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                  {personal.leetcode && <p className="text-orange-600 break-all font-bold">{personal.leetcode.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                  {personal.hackathon && <p className="text-cyan-600 break-all font-bold">{personal.hackathon.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                </div>
              </div>
            </header>
          )}

          {/* Dynamic Master Renderer for this page */}
          <ResumeMasterRenderer data={data} templateType="modern" pageIndex={idx} />

          {/* Footer / Meta (Optional) */}
          <div className="mt-auto pt-8 flex justify-between items-center no-print">
             <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest italic">Page {idx + 1} of {pages.length}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
