import React, { useState, useEffect } from "react";
import { Cookie, X, ArrowRight } from "lucide-react";

interface CookieConsentProps {
  onLearnMore: () => void;
}

export default function CookieConsent({ onLearnMore }: CookieConsentProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsOpen(isOpen => true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-white border border-gray-100 rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] p-6 z-[999999] no-print transition-all duration-300">
      <div className="flex gap-4 items-start">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5">
          <Cookie size={20} className="stroke-[2.5]" />
        </div>
        <div className="space-y-2 flex-1 min-w-0">
          <h4 className="text-xs uppercase font-black tracking-widest text-gray-900 flex items-center gap-2">
            Cookie Preferences
          </h4>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            Prism Resume Studio uses cookies to analyze website traffic and support our 100% free resume builder, ensuring premium, ATS-optimized exports with zero hidden fees. We work with trusted partners like Google to deliver non-intrusive personalized ads.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 items-center">
            <button 
              onClick={handleAccept}
              className="px-4 py-2 bg-gray-900 border border-transparent text-white rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-blue-600 transition-all active:scale-95 shadow-md flex items-center gap-1.5"
            >
              Accept Cookies <ArrowRight size={10} />
            </button>
            <button 
              onClick={handleDecline}
              className="px-4 py-2 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95"
            >
              Decline
            </button>
            <button 
              onClick={onLearnMore}
              className="px-3 py-2 text-blue-600 text-[9px] font-black uppercase tracking-wider hover:text-blue-700 hover:underline transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors shrink-0"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
