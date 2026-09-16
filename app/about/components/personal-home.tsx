import { author, ROLE, SITE_NAME } from "@/app/author";
import { aboutData } from "../about-data";
import { ProgressivePortrait } from "./progressive-portrait";
import styles from "./personal-home.module.css";

export function PersonalHome({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.home} data-personal-home>
      <div className={styles.columns}>
        <aside className={styles.identity}>
          <div className={styles.portrait}><ProgressivePortrait /></div>
          <div className={styles.identityCopy}>
            <h1>{SITE_NAME}</h1>
            <p className={styles.role}>{ROLE}</p>
          </div>
          <a href={author.links.linkedin} className={styles.primaryLink}>Connect on LinkedIn <span aria-hidden="true">↗</span></a>
          <div className={styles.social}><a href={author.links.twitter}>X ↗</a><a href={author.links.github}>GitHub ↗</a></div>
        </aside>
        <div className={styles.content}>
          <section className={styles.intro}>
            <p className={styles.eyebrow}>Hello, I’m Semih.</p>
            <h2>Products, mostly.<br /><em>Companies,<br />sometimes.</em></h2>
            <p>I build products and sometimes build companies.</p>
          </section>
          <section id="work" className={styles.experience} aria-label="Experience">
            {aboutData.experience.positions.map((position, index) => (
              <article key={position.company} className={styles.position}>
                <div className={styles.positionMeta}><span>{index === 0 ? "Latest company" : position.company}</span><span>{position.period}</span></div>
                <h2>{index === 0 ? position.company : position.role}</h2>
                {index === 0 && <p className={styles.positionRole}>{position.role}</p>}
                <p className={styles.description}>{position.description}</p>
                {index === 0 && <>
                  <div className={styles.scale}><div><strong>140K+</strong><span>monthly active users</span></div><div><strong>$4M</strong><span>revenue</span></div></div>
                  <p className={styles.scaleNote}>MAU · August 2026</p>
                </>}
              </article>
            ))}
          </section>
          {children}
        </div>
      </div>
      <section className={styles.contact}>
        <h2>Let’s build something useful.</h2>
        <a href={author.links.linkedin}>Start a conversation ↗</a>
      </section>
    </main>
  );
}

export function BackgroundSection({ children }: { children: React.ReactNode }) {
  return <div className={styles.background}>{children}</div>;
}
