import React, { useState } from 'react';
import { ExternalLink, Info } from 'lucide-react';

/**
 * Placeholder for Google AdSense or other ad scripts.
 * Only loads/shows when user explicitly clicks to see it.
 */
export const ScriptAd = () => {
  const [showAd, setShowAd] = useState(false);

  if (!showAd) {
    return (
      <div className="w-full py-4 text-center">
        <button 
          onClick={() => setShowAd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-xl border border-gray-100 transition-all text-[8px] font-black uppercase tracking-widest"
        >
          <Info size={12} /> Show Partner Content
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-4 opacity-50 text-center animate-in fade-in zoom-in duration-300">
      <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Advertisement Blueprint</p>
      </div>
      <button 
        onClick={() => setShowAd(false)}
        className="block mx-auto mt-2 text-[7px] font-black uppercase text-gray-300 hover:text-red-400"
      >
        Dismiss
      </button>
    </div>
  );
};

export const BannerAd = () => {
  const [showAd, setShowAd] = useState(false);

  if (!showAd) {
    return (
      <div className="w-full aspect-[728/90] md:aspect-[970/90] bg-gray-50 rounded-2xl border border-dotted border-gray-200 flex flex-col items-center justify-center gap-3">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Monetization Slot</p>
        <button 
          onClick={() => setShowAd(true)}
          className="px-6 py-2.5 bg-white text-gray-900 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          View Sponsored Link <ExternalLink size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[728/90] md:aspect-[970/90] bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden animate-in fade-in duration-500 relative">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Professional Partner Space</p>
      <button 
        onClick={() => setShowAd(false)}
        className="absolute top-2 right-2 p-1 bg-white/50 hover:bg-white rounded-md text-gray-400"
      >
        <ExternalLink size={10} className="rotate-180" />
      </button>
    </div>
  );
};
