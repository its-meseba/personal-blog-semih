import { withHeadingId } from "./utils";

export function H3({ children }) {
  return (
    <h3 className="group relative mb-3 mt-block font-display text-h3 font-semibold text-fg">
      {withHeadingId(children)}
    </h3>
  );
}
