import Link from "next/link";

const LINK =
  "text-accent underline decoration-accent/35 underline-offset-[3px] transition-colors duration-quick ease-console hover:text-accent-hover hover:decoration-accent";

export function A({ children, className = "", href, ...props }) {
  const cls = `${LINK} ${className}`;

  if (href[0] === "#") {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  );
}
