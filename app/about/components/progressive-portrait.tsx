"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./personal-home.module.css";

export function ProgressivePortrait() {
  const [loadHighQuality, setLoadHighQuality] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <div className={styles.portraitFrame}>
      <Image
        src="/images/photo.jpeg"
        alt="Mehmet Semih Babacan"
        width={640}
        height={640}
        sizes="(max-width: 700px) 90vw, 440px"
        priority
        onLoad={() => setLoadHighQuality(true)}
        onError={() => setLoadHighQuality(true)}
      />
      {loadHighQuality && (
        <Image
          src="/images/portrait-high-quality.png"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          sizes="(max-width: 700px) 90vw, 440px"
          loading="eager"
          className={styles.portraitHighQuality}
          data-ready={ready}
          onLoad={async event => {
            try {
              await event.currentTarget.decode();
              setReady(true);
            } catch {
              // Leave the original portrait visible if decoding fails.
            }
          }}
          onError={() => setReady(false)}
        />
      )}
    </div>
  );
}
