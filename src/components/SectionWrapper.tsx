import React from 'react';
import { cn } from '../lib/utils';

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  horizontal?: boolean;
}

export default function SectionWrapper({ title, children, className, horizontal }: SectionWrapperProps) {
  return (
    <div className={cn("page-break-inside-avoid", className)}>
      <div className={cn("flex", horizontal ? "flex-row gap-8" : "flex-col gap-4")}>
        <div className={cn(horizontal ? "w-1/3" : "w-full")}>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 border-b-2 border-blue-50/50 pb-2 mb-4">
            {title}
          </h3>
        </div>
        <div className={cn(horizontal ? "w-2/3" : "w-full")}>
          {children}
        </div>
      </div>
    </div>
  );
}
