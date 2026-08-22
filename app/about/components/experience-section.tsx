import { AboutSection, AboutCard } from "./about-section";

interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
}

interface ExperienceSectionProps {
  title: string;
  positions: Experience[];
}

export function ExperienceSection({ title, positions }: ExperienceSectionProps) {
  return (
    <AboutSection title={title} id="experience-section">
      <div className="space-y-6">
        {positions.map((position, index) => (
          <AboutCard key={index}>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-fg">
                    {position.role}
                  </h3>
                  <p className="text-accent font-medium">
                    {position.company}
                  </p>
                </div>
                <div className="text-sm text-muted sm:text-right">
                  <p>{position.period}</p>
                  <p>{position.location}</p>
                </div>
              </div>
              
              <p className="text-fg leading-relaxed">
                {position.description}
              </p>
            </div>
          </AboutCard>
        ))}
      </div>
    </AboutSection>
  );
}
