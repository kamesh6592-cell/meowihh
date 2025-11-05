import React from 'react';
import Image from 'next/image';

export const SciraLogoHeader = () => (
  <div className="flex items-center gap-2.5 my-1.5">
    <div className="relative">
      <Image 
        src="/aj-logo.jpg" 
        alt="AJ STUDIOZ" 
        width={28} 
        height={28} 
        className="rounded-lg shadow-sm ring-1 ring-border/50" 
      />
    </div>
    <h2 className="text-xl font-bold font-be-vietnam-pro bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent tracking-tight">
      AJ STUDIOZ
    </h2>
  </div>
);
