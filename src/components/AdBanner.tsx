import React from 'react';
import { cn } from '../lib/utils';

interface AdContainerProps {
  id: string;
  className?: string;
}

export function AdContainer({ id, className }: AdContainerProps) {
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; min-height: 50px; background: transparent; }
          #atcontainer-${id} { width: 100%; height: 100%; min-height: 250px; display: flex; justify-content: center; align-items: center; }
        </style>
      </head>
      <body>
        <div id="atcontainer-${id}"></div>
        <script async="async" data-cfasync="false" src="//glamourpicklessteward.com/${id}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={cn("ad-container flex justify-center w-full min-h-[250px] bg-transparent overflow-hidden", className)}>
      <iframe
        title="Ad Container"
        srcDoc={srcDoc}
        className="w-full border-0 overflow-hidden min-h-[250px]"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        loading="lazy"
      />
    </div>
  );
}

interface ScriptAdProps {
  src: string;
  options: Record<string, any>;
  className?: string;
}

export function ScriptAd({ src, options, className }: ScriptAdProps) {
  const width = options.width || 300;
  const height = options.height || 250;

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          var atOptions = ${JSON.stringify(options)};
        </script>
        <script type="text/javascript" src="${src}"></script>
      </body>
    </html>
  `;

  return (
    <div className={cn("script-ad-wrapper flex items-center justify-center bg-transparent", className)} style={{ width, height }}>
      <iframe
        title="Script Ad"
        srcDoc={srcDoc}
        width={width}
        height={height}
        className="border-0 overflow-hidden bg-transparent"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        loading="lazy"
      />
    </div>
  );
}
