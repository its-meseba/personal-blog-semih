import Image from "next/image";
import Link from "next/link";
import { author, ROLE, SITE_NAME } from "@/app/author";
import { WorkLens } from "./work-lens";
import styles from "./personal-home.module.css";

export function PersonalHero() {
  return (
    <section className={styles.hero} aria-labelledby="personal-heading">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{SITE_NAME} / {ROLE}</p>
        <h1 id="personal-heading">Products,<br />mostly.<br /><span>Companies,<br />sometimes.</span></h1>
        <p className={styles.introduction}>I’m Semih. I connect product thinking with hands-on engineering to turn ideas into things people use.</p>
        <a href="#work" className={styles.primaryLink}>Explore my work <span aria-hidden="true">↗</span></a>
      </div>
      <figure className={styles.portrait}>
        <Image src="/images/photo.jpeg" alt="Mehmet Semih Babacan" width={640} height={640} sizes="(max-width: 700px) 90vw, 440px" priority />
        <figcaption><span>A builder, at heart.</span><span className={styles.signature}>meseba</span></figcaption>
      </figure>
    </section>
  );
}

export function PersonalHome({ children }: { children: React.ReactNode }) {
  return <div className={styles.home}>{children}</div>;
}

export function WorkSection() {
  return (
    <section id="work" className={styles.work} aria-labelledby="work-heading">
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>01 / How I work</p><h2 id="work-heading">From the right question<br />to working software.</h2></div>
      <WorkLens />
    </section>
  );
}

export function CraftNoteSection() {
  return (
    <section className={styles.craftnote} aria-labelledby="craftnote-heading">
      <div className={styles.craftnoteCopy}>
        <p className={styles.eyebrow}>02 / In practice · Jan 2026–Present</p>
        <h2 id="craftnote-heading">CraftNote</h2>
        <p className={styles.role}>Founder’s Associate &amp;<br />AI Technical Growth Product Manager</p>
        <p>Working closely with the founders, engineering, design, and product teams to connect customer needs, AI systems, and growth.</p>
        <ul><li>Built and deployed AI agents and internal systems.</li><li>Turned support insights and global interviews into product priorities.</li><li>Owned lifecycle marketing, pricing strategy, and product analytics.</li></ul>
      </div>
      <div className={styles.scale}>
        <p className={styles.eyebrow}>The product’s scale</p>
        <div><strong>140K<span>+</span></strong><p>monthly active users</p></div>
        <div><strong>240K<span>+</span></strong><p>notes created monthly</p></div>
        <p className={styles.scaleNote}>CraftNote product usage<br />August 2026</p>
      </div>
    </section>
  );
}

export function CareerSection({ children }: { children: React.ReactNode }) {
  return <section className={styles.career} id="experience"><p className={styles.eyebrow}>04 / The path here</p>{children}</section>;
}

export function PersonalContact() {
  return (
    <section className={styles.contact}>
      <p className={styles.eyebrow}>Good products start with a conversation.</p>
      <h2>Let’s build<br /><span>something useful.</span></h2>
      <div><a href={author.links.linkedin} className={styles.primaryLink}>Connect on LinkedIn <span aria-hidden="true">↗</span></a><Link href="/thoughts" className={styles.secondaryLink}>Read my writing ↗</Link></div>
    </section>
  );
}
