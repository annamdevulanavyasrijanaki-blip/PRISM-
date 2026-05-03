import { Box } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <div className="relative">
        {/* Layered 3D Effect for Logo */}
        <div className="w-10 h-10 bg-indigo-600 rounded-xl rotate-12 absolute -right-1 -bottom-1 blur-[2px] opacity-20 group-hover:rotate-45 transition-transform duration-500" />
        <div className="w-10 h-10 bg-blue-500 rounded-xl -rotate-6 absolute -left-1 -top-1 blur-[1px] opacity-20 group-hover:-rotate-12 transition-transform duration-500" />
        <div className="w-10 h-10 bg-gray-900 rounded-xl relative flex items-center justify-center text-white shadow-xl z-10 group-hover:scale-110 transition-transform">
          <Box size={22} className="group-hover:rotate-12 transition-transform" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-xl leading-none tracking-tighter uppercase group-hover:text-blue-600 transition-colors">
          Prism
        </span>
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 mt-0.5">
          Resume.Studio
        </span>
      </div>
    </div>
  );
}
