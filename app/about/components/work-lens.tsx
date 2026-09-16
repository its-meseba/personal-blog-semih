"use client";

import { useState } from "react";
import styles from "./personal-home.module.css";

const lenses = [
  { title: "Understand", subtitle: "Find the problem worth solving.", description: "I use customer insights and data to decide what to build.", input: "Customer signals", output: "Product priorities" },
  { title: "Build", subtitle: "Stay close to the code.", description: "I turn ideas into working products and keep improving them.", input: "Product decisions", output: "Working systems" },
  { title: "Improve", subtitle: "Learn from what people actually do.", description: "I use product data to improve user experiences and grow revenue.", input: "Real user behavior", output: "The next experiment" },
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
    </div>
  </div>;
}
