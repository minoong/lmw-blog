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
  const getPath = (path?: string) => {
    if (!path?.startsWith('/')) return path;
    if (basePath !== '' && path.startsWith(basePath)) return path;
    return `${basePath}${path}`;
  };

  const finalSrc = getPath(src);

  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as { src?: string };
      if (childProps.src?.startsWith('/')) {
        return React.cloneElement(child as React.ReactElement<{ src?: string }>, {
          src: getPath(childProps.src),
        });
      }
    }
    return child;
  });

  return (
    <video src={finalSrc} autoPlay={autoPlay} loop={loop} muted={muted} playsInline={playsInline} controls={controls} className={className} width={width}>
      {processedChildren}
    </video>
  );
}
