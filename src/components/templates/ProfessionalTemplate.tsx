import { ResumeData } from "../../types";
import { ResumeMasterRenderer } from "../ResumeSections";
import { getDynamicFontSize } from "../../lib/utils";

export default function ProfessionalTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;

  return (
    <div className="bg-white text-gray-800 p-12 min-h-[297mm] w-full mx-auto shadow-lg print:shadow-none print:p-0 font-serif">
      {/* Header */}
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
          <span>{personal.location}</span>
          <span>•</span>
          <span>{personal.phone}</span>
          <span>•</span>
          <span>{personal.email}</span>
          {personal.website && (
            <>
              <span>•</span>
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

      {/* Dynamic Master Renderer */}
      <ResumeMasterRenderer data={data} templateType="professional" />
    </div>
  );
}
