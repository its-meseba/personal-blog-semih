"use client";

import { useState, type FormEvent } from "react";

export type FreeResourceId =
  | "ai-app-shipping-ebook"
  | "claude-code-kit"
  | "launch-checklists"
  | "project-planner";

type Locale = "en" | "tr";
type Status = "idle" | "sending" | "done" | "error";

const LUMIO_URL = "https://www.lumiostudio.co";
const LEAD_MAGNET_URL = `${LUMIO_URL}/api/lead-magnet`;
const LEAD_SOURCE = "blog";

const RESOURCES: Record<FreeResourceId, Record<Locale, { title: string; blurb: string }>> = {
  "ai-app-shipping-ebook": {
    en: {
      title: "Shipping an app with AI: the 30% nobody tells you",
      blurb: "A free ebook on the part of shipping that the AI does not do for you.",
    },
    tr: {
      title: "Yapay zekâyla uygulama çıkarmak: kimsenin anlatmadığı %30",
      blurb: "Uygulama yayınlarken yapay zekânın senin yerine yapmadığı kısım üzerine ücretsiz bir e-kitap.",
    },
  },
  "claude-code-kit": {
    en: {
      title: "The Claude Code rulebook behind 5 live apps",
      blurb: "The rules and setup I actually run Claude Code with, as a free kit.",
    },
    tr: {
      title: "5 canlı uygulamanın arkasındaki Claude Code kuralları",
      blurb: "Claude Code'u gerçekte hangi kurallarla çalıştırdığım, ücretsiz bir kit olarak.",
    },
  },
  "launch-checklists": {
    en: {
      title: "Launch checklists: analytics, store release, SEO",
      blurb: "Three checklists to run through before and after you ship.",
    },
    tr: {
      title: "Yayın kontrol listeleri: analitik, mağaza yayını, SEO",
      blurb: "Yayından önce ve sonra gözden geçirebileceğin üç kontrol listesi.",
    },
  },
  "project-planner": {
    en: {
      title: "App project planner",
      blurb: "A free planner to turn an app idea into a scoped project.",
    },
    tr: {
      title: "Uygulama proje planlayıcı",
      blurb: "Bir uygulama fikrini kapsamı belli bir projeye çeviren ücretsiz planlayıcı.",
    },
  },
};

const COPY: Record<
  Locale,
  {
    credit: string;
    placeholder: string;
    submit: string;
    sending: string;
    thanks: string;
    download: string;
    error: string;
    open: string;
  }
> = {
  en: {
    credit: "Free, from Lumio Studio — the studio I run.",
    placeholder: "you@example.com",
    submit: "Send it to me",
    sending: "Sending…",
    thanks: "Thanks. Your download is ready:",
    download: "Download",
    error: "That did not go through. Please try again in a moment.",
    open: "Open the planner",
  },
  tr: {
    credit: "Ücretsiz, yönettiğim stüdyo Lumio Studio'dan.",
    placeholder: "sen@ornek.com",
    submit: "Bana gönder",
    sending: "Gönderiliyor…",
    thanks: "Teşekkürler. İndirmen hazır:",
    download: "İndir",
    error: "Gönderilemedi. Lütfen birazdan tekrar dene.",
    open: "Planlayıcıyı aç",
  },
};

const LINK_CLASS =
  "text-accent underline underline-offset-4 transition-colors duration-quick ease-console hover:text-fg";

export function FreeResource({
  resource,
  locale = "en",
}: {
  resource: FreeResourceId;
  locale?: Locale;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const item = RESOURCES[resource][locale];
  const copy = COPY[locale];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch(LEAD_MAGNET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          locale,
          resource,
          source: LEAD_SOURCE,
          website: String(form.get("website") ?? ""),
        }),
      });
      const data: { ok?: boolean; downloadUrl?: string } = await response.json();
      if (!response.ok || !data.ok || !data.downloadUrl) {
        setStatus("error");
        return;
      }
      setDownloadUrl(`${LUMIO_URL}${data.downloadUrl}`);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <aside className="my-block rounded-card border border-border bg-surface p-4 font-serif text-body text-fg">
      <strong className="block">{item.title}</strong>
      <span className="mt-1 block text-muted">{item.blurb}</span>

      {resource === "project-planner" ? (
        <a
          className={`mt-3 inline-block ${LINK_CLASS}`}
          href={`${LUMIO_URL}/${locale}/free/project-planner`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.open} ↗
        </a>
      ) : status === "done" && downloadUrl ? (
        <span className="mt-3 block" role="status">
          {copy.thanks}{" "}
          <a className={LINK_CLASS} href={downloadUrl} target="_blank" rel="noopener noreferrer">
            {copy.download} ↗
          </a>
        </span>
      ) : (
        <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            aria-label="Email"
            placeholder={copy.placeholder}
            className="grow rounded-card border border-border bg-transparent px-3 py-2 text-fg"
          />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            defaultValue=""
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-card border border-border-strong px-4 py-2 text-fg transition-colors duration-quick ease-console hover:text-accent disabled:opacity-60"
          >
            {status === "sending" ? copy.sending : copy.submit}
          </button>
        </form>
      )}

      {status === "error" ? (
        <span className="mt-2 block text-muted" role="alert">
          {copy.error}
        </span>
      ) : null}

      <span className="mt-3 block font-mono text-meta text-faint">{copy.credit}</span>
    </aside>
  );
}
