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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head>
          <style>body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; }</style>
        </head>
        <body>
          <div id="ad-container"></div>
          <script>
            window.atOptions = ${JSON.stringify(options || {})};
            const script = document.createElement('script');
            script.src = "${src}";
            script.async = true;
            document.getElementById('ad-container').appendChild(script);
          </script>
        </body>
      </html>
    `);
    doc.close();
  }, [options, src]);

  return (
    <iframe 
      ref={iframeRef}
      className={className}
      width={options?.width || '100%'}
      height={options?.height || 'auto'}
      frameBorder="0"
      scrolling="no"
      sandbox="allow-scripts allow-same-origin allow-popups"
      title="Safe Ad"
    />
  );
}
