import { AboutSection, AboutCard, AboutGrid } from "./about-section";

interface Achievement {
  title: string;
  description: string;
}

interface AchievementsSectionProps {
  title: string;
  items: Achievement[];
}

export function AchievementsSection({ title, items }: AchievementsSectionProps) {
  return (
    <AboutSection title={title} id="achievements-section">
      <AboutGrid>
        {items.map((achievement, index) => (
          <AboutCard key={index}>
            <div className="space-y-3">
              <h3 className="font-semibold text-fg">
                {achievement.title}
              </h3>
              
              <p className="text-fg text-sm leading-relaxed">
                {achievement.description}
              </p>
            </div>
          </AboutCard>
        ))}
      </AboutGrid>
    </AboutSection>
  );
}
