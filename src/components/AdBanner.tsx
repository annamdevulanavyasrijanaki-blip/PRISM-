import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  id: string;
  className?: string;
}

export function AdContainer({ id, className }: AdBannerProps) {
  return <div id={`container-${id}`} className={className}></div>;
}

interface ScriptAdProps {
  options?: any;
  src: string;
  className?: string;
}

export function ScriptAd({ options, src, className }: ScriptAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    
    if (options) {
      const optionsScript = document.createElement('script');
      optionsScript.innerHTML = `atOptions = ${JSON.stringify(options)};`;
      containerRef.current.appendChild(optionsScript);
    }

    script.src = src;
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [options, src]);

  return <div ref={containerRef} className={className} />;
}
