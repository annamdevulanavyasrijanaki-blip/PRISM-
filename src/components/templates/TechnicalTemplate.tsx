import { ResumeData } from "../../types";
import { ResumeMasterRenderer } from "../ResumeSections";
import { getDynamicFontSize } from "../../lib/utils";

export default function TechnicalTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder } = data;
  const pages = data.pages || [sectionOrder];

  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-0">
      {pages.map((pageSections, idx) => (
        <div key={idx} className="bg-[#0f172a] text-[#e2e8f0] p-12 min-h-[297mm] w-full mx-auto shadow-2xl print:shadow-none font-mono text-[11px] leading-relaxed flex flex-col">
          {/* Header */}
          {idx === 0 && (
            <header className="mb-10 p-6 border border-[#1e293b] bg-[#1e293b]/30 rounded-lg flex items-center justify-between gap-8">
              <div className="flex-1 min-w-0">
                <h1 
                  className="font-bold text-blue-400 mb-2 break-words leading-tight"
                  style={{ fontSize: getDynamicFontSize(personal.fullName, 2, 1.1, 15, data.settings?.fontSize || 1) }}
                >
                  {"> "}{personal.fullName}
                </h1>
                <p className="text-sm text-slate-400 mb-6 font-bold break-words">{personal.jobTitle}</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-slate-500 font-bold uppercase text-[8px] mt-4 border-t border-slate-800 pt-2">
                  {personal.email && <p className="break-all">{"[email] "}{personal.email}</p>}
                  {personal.phone && <p className="break-all">{"[phone] "}{personal.phone}</p>}
                  {personal.location && <p className="break-all">{"[loc]   "}{personal.location}</p>}
                  {personal.website && <p className="break-all text-blue-400">{"[web]   "}{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                  {personal.linkedin && <p className="break-all text-slate-400">{"[li]    "}{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                  {personal.github && <p className="break-all text-slate-400">{"[git]   "}{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                  {personal.leetcode && <p className="break-all text-slate-400">{"[lc]    "}{personal.leetcode.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                  {personal.hackathon && <p className="break-all text-slate-400">{"[pt]    "}{personal.hackathon.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                </div>
              </div>
              {personal.profileImage && (
                <div className="w-32 h-32 border-2 border-blue-500/20 p-1 shadow-[8px_8px_0px_rgba(59,130,246,0.1)] grayscale hover:grayscale-0 transition-all flex-shrink-0 bg-slate-800">
                   <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover" />
                </div>
              )}
            </header>
          )}

          {/* Dynamic Master Renderer */}
          <div className="technical-renderer flex-1">
            <ResumeMasterRenderer data={data} templateType="technical" pageIndex={idx} />
          </div>

          <div className="mt-auto pt-8 flex justify-between no-print opacity-50">
             <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 italic">Page {idx + 1} of {pages.length}</p>
          </div>
        </div>
      ))}

      <style>{`
        .technical-renderer h3 {
          color: #3b82f6 !important;
          border-bottom-color: #1e293b !important;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
        }
        .technical-renderer h4 {
          color: #93c5fd !important;
        }
        .technical-renderer p {
          color: #94a3b8 !important;
        }
        .technical-renderer .text-gray-900 {
          color: #e2e8f0 !important;
        }
        .technical-renderer .text-blue-600 {
          color: #60a5fa !important;
        }
        .technical-renderer .bg-gray-50 {
          background-color: rgba(30, 41, 59, 0.5) !important;
          border-color: rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
