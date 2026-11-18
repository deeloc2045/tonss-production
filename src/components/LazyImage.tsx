import React, { useState } from 'react';

export const LazyImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ className = '', style, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      {...props}
      onLoad={(e) => {
        setIsLoaded(true);
        if (props.onLoad) props.onLoad(e);
      }}
      className={`
        ${className}
        ${isLoaded ? 'blur-0' : 'blur-md'}
      `}
      style={{
        opacity: isLoaded ? undefined : 0,
        ...style
      }}
    />
  );
};
