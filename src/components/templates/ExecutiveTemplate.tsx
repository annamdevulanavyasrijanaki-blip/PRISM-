import { ResumeData } from "../../types";
import { ResumeMasterRenderer } from "../ResumeSections";
import { getDynamicFontSize } from "../../lib/utils";

export default function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder } = data;
  const pages = data.pages || [sectionOrder];

  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-0">
      {pages.map((pageSections, idx) => (
        <div key={idx} className="resume-page-wrap bg-white text-[#1a1a1a] min-h-[297mm] w-full mx-auto shadow-2xl print:shadow-none font-serif flex flex-col print:break-after-page">
          {idx === 0 && (
            <header className="text-center p-16 border-b-2 border-double border-gray-900 mb-8">
              {personal.profileImage && (
                <div className="flex justify-center mb-8">
                  <div className="w-28 h-28 border-4 border-gray-900 p-1.5 shadow-[10px_10px_0px_rgba(0,0,0,0.05)] bg-white">
                    <img src={personal.profileImage} alt={personal.fullName} className="w-full h-full object-cover grayscale brightness-110" />
                  </div>
                </div>
              )}
              <h1 
                className="font-black tracking-tight mb-4 uppercase break-words leading-tight"
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
              </div>
            </header>
          )}

          <div className="flex-1 px-16 pb-16 executive-renderer">
            <ResumeMasterRenderer data={data} templateType="executive" pageIndex={idx} />
          </div>

          <div className="mt-auto px-16 pb-8 flex justify-between items-center no-print">
             <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest italic">Page {idx + 1} of {pages.length}</p>
          </div>

          <style>{`
            .executive-renderer h3 {
              font-family: serif;
              font-size: 0.75rem;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.3em;
              color: #1a1a1a;
              border-bottom: 2px solid #1a1a1a;
              display: inline-block;
              margin-bottom: 2rem;
              padding-bottom: 0.25rem;
              text-align: center;
              width: 100%;
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
