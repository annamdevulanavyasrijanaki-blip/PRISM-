import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

interface AdContainerProps {
  id: string;
  className?: string;
}

export function AdContainer({ id, className }: AdContainerProps) {
  return (
    <div 
      className={cn("ad-container", className)} 
      id={`container-${id}`}
    >
      <div id={`atcontainer-${id}`} />
    </div>
  );
}

interface ScriptAdProps {
  src: string;
  options: Record<string, any>;
  className?: string;
}

export function ScriptAd({ src, options, className }: ScriptAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous children
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    
    // Set options as global variable as expected by many ad platforms
    const atOptions = document.createElement('script');
    atOptions.type = 'text/javascript';
    atOptions.innerHTML = `atOptions = ${JSON.stringify(options)};`;

    containerRef.current.appendChild(atOptions);
    containerRef.current.appendChild(script);
  }, [src, JSON.stringify(options)]);

  return (
    <div 
      ref={containerRef} 
      className={cn("script-ad-wrapper", className)} 
    />
  );
}
