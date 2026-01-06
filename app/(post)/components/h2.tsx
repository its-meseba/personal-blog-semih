import { withHeadingId } from "./utils";

export function H2({ children }) {
  return (
    <h2
      className="group font-bold text-[28px] mt-14 mb-4 pt-4 relative leading-tight"
      style={{ fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}
    >
      {withHeadingId(children)}
    </h2>
  );
}
