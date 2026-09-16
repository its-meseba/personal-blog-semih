import { AboutSection } from "./about-section";

interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
}

function Position({ position }: { position: Experience }) {
  return (
    <article className="border-t border-border py-6">
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-semibold text-fg">{position.role}</h3>
            <p className="font-medium text-accent">{position.company}</p>
          </div>
          <div className="shrink-0 text-sm text-muted sm:text-right">
            <p>{position.period}</p><p>{position.location}</p>
          </div>
        </div>
        <p className="max-w-[75ch] leading-relaxed text-muted">{position.description}</p>
      </div>
    </article>
  );
}

export function ExperienceSection({ title, positions }: { title: string; positions: Experience[] }) {
  return (
    <AboutSection title={title} id="experience-section">
      <div>
        {positions.slice(0, 3).map(position => <Position key={`${position.company}-${position.period}`} position={position} />)}
        {positions.length > 3 && <details>
          <summary>Earlier experience</summary>
          {positions.slice(3).map(position => <Position key={`${position.company}-${position.period}`} position={position} />)}
        </details>}
      </div>
    </AboutSection>
  );
}
