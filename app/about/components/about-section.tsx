import React from 'react';

interface AboutSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function AboutSection({ title, children, className = '', id }: AboutSectionProps) {
  return (
    <section id={id} className={`mb-section ${className}`}>
      <h2 className="mb-6 font-display text-h3 font-semibold tracking-tight text-fg md:text-h2">
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

export function AboutCard({ 
  children, 
  className = '', 
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div 
      className={`rounded-card border border-border bg-surface p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function AboutGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {children}
    </div>
  );
}
