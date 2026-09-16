import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { author } from "./author";

export function Header() {
  return (
    <header className="site-header">
      <Logo />
      <nav aria-label="Main navigation">
        <Link href="/about#work">Work</Link>
        <Link href="/thoughts">Writing</Link>
        <Link href="/series">Series</Link>
        <a href={author.links.linkedin}>Connect <span aria-hidden="true">↗</span></a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
