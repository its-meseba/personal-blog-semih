"use client";
import { useState } from "react";
import { AboutSection, AboutCard, AboutGrid } from "./about-section";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  role: string;
  status: string;
  website?: string;
  github?: string | string[];
  images?: string[];
  detailedDescription?: string;
  achievements?: string[];
}

interface ProjectsSectionProps {
  title: string;
  projects: Project[];
}

export function ProjectsSection({ title, projects }: ProjectsSectionProps) {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const toggleProject = (index: number) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  // Check if any project has images to determine grid layout
  const hasImages = projects.some(project => project.images && project.images.length > 0);

  return (
    <AboutSection title={title} id="projects-section">
      <div className={hasImages ? "space-y-6" : "grid gap-6 md:grid-cols-2"}>
        {projects.map((project, index) => (
          <AboutCard 
            key={index}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              hasImages && expandedProject === index ? 'expanded-card' : ''
            }`}
            onClick={() => toggleProject(index)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-fg">
                  {project.name}
                </h3>
                <span className="text-xs text-faint">
                  {expandedProject === index ? '−' : '+'}
                </span>
              </div>
              
              <p className="text-sm text-muted">
                {project.role}
              </p>

              {/* Links */}
              {(project.website || project.github) && (
                <div className="flex flex-wrap gap-2">
                  {project.website && (
                    <a 
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 rounded-xs border border-accent-mark/40 bg-accent-chip text-accent hover:border-accent-mark hover:text-accent-hover transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Website
                    </a>
                  )}
                  {project.github && (
                    <>
                      {Array.isArray(project.github) ? (
                        project.github.map((githubUrl, index) => (
                          <a 
                            key={index}
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xs border border-border bg-surface px-2 py-1 font-mono text-micro uppercase tracking-tag text-muted transition-colors duration-quick ease-console hover:border-border-strong hover:text-fg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            GitHub {index + 1}
                          </a>
                        ))
                      ) : (
                        <a 
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xs border border-border bg-surface px-2 py-1 font-mono text-micro uppercase tracking-tag text-muted transition-colors duration-quick ease-console hover:border-border-strong hover:text-fg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          GitHub
                        </a>
                      )}
                    </>
                  )}
                </div>
              )}
              
              <p className="text-fg text-sm leading-relaxed">
                {project.description}
              </p>

              {/* Project Image */}
              {project.images && project.images.length > 0 && (
                <div className="mt-4">
                  <img
                    src={project.images[0]}
                    alt={project.name}
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                </div>
              )}

              {/* Expanded Details */}
              {expandedProject === index && (
                <div className="space-y-4 pt-4 border-t border-border">
                  {/* Image Gallery for Expanded Cards */}
                  {project.images && project.images.length > 1 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-fg text-sm">
                        Project Gallery:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {project.images.slice(1).map((image, imageIndex) => (
                          <img
                            key={imageIndex}
                            src={image}
                            alt={`${project.name} ${imageIndex + 2}`}
                            className="w-full h-32 object-cover rounded-lg border border-border hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {project.detailedDescription && (
                    <p className="text-fg text-sm leading-relaxed">
                      {project.detailedDescription}
                    </p>
                  )}
                  
                  {project.achievements && project.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-fg text-sm mb-2">
                        Key Achievements:
                      </h4>
                      <ul className="space-y-1">
                        {project.achievements.map((achievement, achievementIndex) => (
                          <li 
                            key={achievementIndex}
                            className="text-xs text-muted pl-4 relative before:content-['•'] before:absolute before:left-0"
                          >
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="text-xs px-2 py-1 bg-surface-hover text-fg rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </AboutCard>
        ))}
      </div>
    </AboutSection>
  );
}
