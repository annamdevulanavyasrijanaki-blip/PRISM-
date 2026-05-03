import React, { useState, useRef } from 'react';
import { FileText, Copy, Check, Upload, Trash2, ChevronLeft, FileType, X } from 'lucide-react';
import { extractRawText } from '../lib/pdfExtractor';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../store/useResumeStore';

export default function SourceSidebar() {
  const { toggleSidebar } = useResumeStore();
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await extractRawText(file);
      setExtractedText(text);
    } catch (err) {
      console.error("PDF Extraction failed:", err);
      alert("Failed to extract text from PDF. Ensure it's a text-based document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Split text by lines or paragraphs for easier individual copying
  const textSegments = extractedText.split('\n').filter(line => line.trim().length > 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <FileType size={16} />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Source Material</h2>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Extract from PDF</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {extractedText && (
            <button 
              onClick={() => setExtractedText("")}
              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
              title="Clear Source"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button 
            onClick={() => toggleSidebar(false)}
            className="p-2 text-gray-300 hover:text-gray-900 transition-colors lg:hidden"
            title="Minimize"
          >
            <X size={16} />
          </button>
          <button 
            onClick={() => toggleSidebar(false)}
            className="p-2 text-gray-300 hover:text-gray-900 transition-colors hidden lg:block"
            title="Minimize"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
        {!extractedText && !isProcessing && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-12">
            <div className="w-16 h-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
              <Upload size={24} />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-900">No Source Loaded</p>
              <p className="text-[9px] text-gray-400 font-medium leading-relaxed px-4">
                Upload your old resume to see raw text here. Copy-paste into the form.
              </p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:bg-blue-600 transition-all active:scale-95"
            >
              Upload PDF
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".pdf" 
              className="hidden" 
            />
          </div>
        )}

        {isProcessing && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-12">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 animate-pulse">Scanning Blueprint...</p>
          </div>
        )}

        {extractedText && (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {textSegments.map((segment, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={`source-seg-${idx}`}
                  className="group relative bg-white border border-gray-100 p-3 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <p className="text-[11px] text-gray-600 leading-relaxed font-medium transition-colors group-hover:text-gray-900">
                    {segment}
                  </p>
                  <button 
                    onClick={() => copyToClipboard(segment, idx)}
                    className="absolute top-2 right-2 p-1.5 bg-gray-50 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    {copiedIndex === idx ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
