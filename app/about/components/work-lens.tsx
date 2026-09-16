"use client";

import { useState } from "react";
import styles from "./personal-home.module.css";

const lenses = [
  { title: "Understand", subtitle: "Find the problem worth solving.", description: "Customer interviews, support conversations, behavioral analytics, and competitor research help me decide what deserves to be built.", input: "Customer signals", output: "Product priorities", examples: ["Global user interviews", "PostHog dashboards", "Market opportunities"] },
  { title: "Build", subtitle: "Stay close to the code.", description: "I write code, deploy and maintain systems, and work with engineering and design to carry decisions through to a working product.", input: "Product decisions", output: "Working systems", examples: ["Production AI agents", "Product development", "Team AI adoption"] },
  { title: "Improve", subtitle: "Learn from what people actually do.", description: "I use experiments and product data to refine onboarding, lifecycle marketing, and pricing for different markets and customer needs.", input: "Real user behavior", output: "The next experiment", examples: ["Onboarding analysis", "Lifecycle marketing", "Regional pricing"] },
];

export function WorkLens() {
  const [selected, setSelected] = useState(0);
  const lens = lenses[selected];
  return <div className={styles.lens}>
    <div className={styles.lensControls} aria-label="Explore how I work">
      {lenses.map((item, index) => <button key={item.title} type="button" aria-pressed={selected === index} aria-controls="work-detail" onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.title}<span aria-hidden="true">↗</span></button>)}
    </div>
    <div id="work-detail" className={styles.lensDetail} aria-live="polite" aria-atomic="true">
      <div className={styles.flow} aria-label={`${lens.input} to ${lens.output}`}><span>{lens.input}</span><span aria-hidden="true">→</span><span>{lens.output}</span></div>
      <h3>{lens.subtitle}</h3><p>{lens.description}</p>
      <ul>{lens.examples.map(example => <li key={example}>{example}</li>)}</ul>
    </div>
  </div>;
}
