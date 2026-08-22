import { AboutSection, AboutCard } from "./about-section";

interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
  gpa?: string;
  highlights: string[];
}

interface Research {
  title: string;
  publication: string;
  publicationUrl?: string;
}

interface EducationSectionProps {
  title: string;
  degrees: Education[];
  research?: Research;
}

export function EducationSection({ title, degrees, research }: EducationSectionProps) {
  return (
    <AboutSection title={title} id="education-section">
      <div className="space-y-6">
        {degrees.map((education, index) => (
          <AboutCard key={index}>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-fg">
                    {education.degree}
                  </h3>
                  <p className="text-accent font-medium">
                    {education.institution}
                  </p>
                  {education.gpa && (
                    <p className="text-sm text-muted mt-1">
                      GPA: {education.gpa}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted sm:text-right">
                  <p>{education.period}</p>
                  <p>{education.location}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {education.highlights.map((highlight, highlightIndex) => (
                  <span 
                    key={highlightIndex}
                    className="text-sm px-3 py-1 bg-surface-hover text-fg rounded-full"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </AboutCard>
        ))}
        
        {research && (
          <AboutCard>
            <div className="space-y-3">
              <h3 className="font-semibold text-fg">
                {research.title}
              </h3>
              {research.publicationUrl ? (
                <a 
                  href={research.publicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover transition-colors italic block"
                >
                  "{research.publication}"
                </a>
              ) : (
                <p className="text-fg italic">
                  "{research.publication}"
                </p>
              )}
            </div>
          </AboutCard>
        )}
      </div>
    </AboutSection>
  );
}
