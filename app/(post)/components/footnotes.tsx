import { A } from "./a";
import { P } from "./p";

export const FootNotes = ({ children }) => (
  <div className="mt-section border-t border-border pt-rhythm font-serif text-caption text-muted">
    {children}
  </div>
);

export const Ref = ({ id }) => (
  <a
    href={`#f${id}`}
    id={`s${id}`}
    className="relative top-[-5px] font-mono text-meta text-accent no-underline"
  >
    [{id}]
  </a>
);

export const FootNote = ({ id, children }) => (
  <P>
    {id}.{" "}
    <A href={`#s${id}`} id={`f${id}`} className="no-underline">
      ^
    </A>{" "}
    {children}
  </P>
);
