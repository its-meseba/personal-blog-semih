// `[ul_&]` styles only the unordered variety; <OL> keeps native markers.
export function LI({ children }) {
  return (
    <li
      className={`
        my-2
        font-serif
        text-body
        text-fg
        [ul_&]:relative
        [ul_&]:pl-5
        [ul_&]:before:absolute
        [ul_&]:before:left-0
        [ul_&]:before:font-mono
        [ul_&]:before:text-accent
        [ul_&]:before:content-['—']
      `}
    >
      {children}
    </li>
  );
}
