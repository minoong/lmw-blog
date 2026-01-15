import React from 'react';

import { basePath } from '@/lib/constants';

interface VideoProps {
  src?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  className?: string;
  width?: string | number;
  children?: React.ReactNode;
}

export default function Video({ src, autoPlay, loop, muted, playsInline, controls = true, className, width, children }: VideoProps) {
  const finalSrc = src?.startsWith('/') ? `${basePath}${src}` : src;

  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type === 'source' || (typeof child.type === 'string' && child.type === 'source'))) {
      const childProps = child.props as { src?: string };
      const childSrc = childProps.src;
      const finalChildSrc = childSrc?.startsWith('/') ? `${basePath}${childSrc}` : childSrc;
      return React.cloneElement(child as React.ReactElement<{ src?: string }>, { src: finalChildSrc });
    }
    return child;
  });

  return (
    <video src={finalSrc} autoPlay={autoPlay} loop={loop} muted={muted} playsInline={playsInline} controls={controls} className={className} width={width}>
      {processedChildren}
    </video>
  );
}
