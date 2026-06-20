import React, { useState, useEffect } from 'react';

interface AdBannerProps {
  adKey: string;
  format: 'iframe';
  height: number;
  width: number;
  className?: string;
  label?: string;
  hideBorder?: boolean;
  compact?: boolean;
}

export default function AdBanner({ 
  adKey, 
  format, 
  height, 
  width, 
  className = '', 
  label = 'SPONSORED AD广告',
  hideBorder = false,
  compact = false
}: AdBannerProps) {
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Monitor tab change navigation contexts to automatically reload ads and optimize views
  useEffect(() => {
    const handleNavigationTrigger = () => {
      // Small state shift clears legacy sandbox scripts and requests brand new ads dynamically
      setRefreshCounter(prev => prev + 1);
    };

    window.addEventListener('hashchange', handleNavigationTrigger);
    window.addEventListener('popstate', handleNavigationTrigger);
    document.addEventListener('ad-tab-refresh', handleNavigationTrigger);

    return () => {
      window.removeEventListener('hashchange', handleNavigationTrigger);
      window.removeEventListener('popstate', handleNavigationTrigger);
      document.removeEventListener('ad-tab-refresh', handleNavigationTrigger);
    };
  }, []);

  // Construct self-contained HTML payload to run inside a sandboxed iframe
  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.5" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 105%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div id="ad-container" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
          <script type="text/javascript">
            atOptions = {
              'key' : '${adKey}',
              'format' : '${format}',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
        </div>
      </body>
    </html>
  `;

  const borderClass = hideBorder ? 'border-0 bg-transparent shadow-none' : 'border border-slate-900/60 bg-slate-900/10 rounded-2xl';
  const paddingClass = compact ? 'p-0 m-0' : 'p-2 my-3';

  return (
    <div className={`flex flex-col items-center justify-center mx-auto overflow-hidden max-w-full ${borderClass} ${paddingClass} ${className}`} id={`ad-wrapper-${adKey}`}>
      {/* Small design label to stay fully compliant and professional */}
      {!compact && (
        <div className="text-[10px] uppercase tracking-widest font-mono text-slate-600 mb-1.5 select-none" id={`ad-label-${adKey}`}>
          {label}
        </div>
      )}
      <div 
        style={{ width: `${width}px`, height: `${height}px` }} 
        className="relative overflow-hidden flex items-center justify-center max-w-full rounded-xl"
        id={`ad-frame-holder-${adKey}`}
      >
        <iframe
          key={`${adKey}-${refreshCounter}`}
          srcDoc={iframeSrcDoc}
          title={`adsterra-${adKey}`}
          width={width}
          height={height}
          scrolling="no"
          referrerPolicy="no-referrer"
          className="border-0 overflow-hidden block mx-auto max-w-full rounded-lg"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          id={`ad-iframe-${adKey}`}
        />
      </div>
    </div>
  );
}
