import { withHeadingId } from "./utils";

export function H1({ children }) {
  return (
    <h1 className="mb-flow mt-section font-display text-h1 font-semibold text-fg">
      {withHeadingId(children)}
    </h1>
  );
}
