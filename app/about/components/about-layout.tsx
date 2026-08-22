import React from 'react';
import { SectionNavigation } from './section-navigation';
import { ROLE, SITE_NAME } from '@/app/author';

interface AboutLayoutProps {
  children: React.ReactNode;
}

const sections = [
  { id: "about-section", title: "About" },
  { id: "projects-section", title: "Featured Projects" },
  { id: "experience-section", title: "Experience" },
  { id: "education-section", title: "Education" },
  { id: "achievements-section", title: "Achievements" },
];

export function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <div className="relative">
      {/*
        The page masthead, and the page's only <h1>. /about is where `/`
        redirects, so it is the site's primary indexable page; it was shipping
        with no h1 at all, which leaves search and answer engines guessing the
        page's subject from the first <h2> ("About").
      */}
      <header className="mb-section">
        <h1 className="font-display text-h1 font-semibold leading-tight tracking-tight text-fg sm:text-display">
          {SITE_NAME}
        </h1>
        <p className="mt-3 font-mono text-micro uppercase tracking-tag text-muted">
          {ROLE}
        </p>
      </header>

      {children}
      <SectionNavigation sections={sections} />
    </div>
  );
}
