"use client";
import { useState, useEffect } from "react";

interface Section {
  id: string;
  title: string;
}

interface SectionNavigationProps {
  sections: Section[];
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function SectionNavigation({ sections }: SectionNavigationProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -70% 0%",
        threshold: 0.1,
      }
    );

    // Observe all section elements
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 z-10">
        <div className="rounded-card border border-border bg-surface/95 backdrop-blur-sm p-4">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`
                  block w-full rounded-sm px-3 py-2 text-left font-mono text-micro uppercase tracking-tag transition-colors duration-quick ease-console
                  ${
                    activeSection === section.id
                      ? "bg-accent-field text-accent-ink"
                      : "text-muted hover:bg-surface-hover hover:text-accent"
                  }
                `}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-4 left-1/2 z-10 w-[calc(100%-2rem)] max-w-[22rem] -translate-x-1/2 lg:hidden">
        <div className="rounded-card border border-border bg-surface/95 backdrop-blur-sm p-2">
          <div className="flex gap-1 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`
                  whitespace-nowrap rounded-sm px-2 py-1 font-mono text-micro uppercase tracking-tag transition-colors duration-quick ease-console
                  ${
                    activeSection === section.id
                      ? "bg-accent-field text-accent-ink"
                      : "text-muted hover:bg-surface-hover hover:text-accent"
                  }
                `}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
