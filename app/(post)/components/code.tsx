export const Code = ({ children }) => {
  return (
    <code
      className={`
        [p_&]:rounded-xs
        [p_&]:border
        [p_&]:border-border
        [p_&]:bg-surface
        [p_&]:px-1
        [p_&]:py-0.5
        [p_&]:font-mono
        [p_&]:text-[0.875em]
        [p_&]:text-fg
        [li_&]:rounded-xs
        [li_&]:border
        [li_&]:border-border
        [li_&]:bg-surface
        [li_&]:px-1
        [li_&]:py-0.5
        [li_&]:font-mono
        [li_&]:text-[0.875em]
        [li_&]:text-fg
      `}
    >
      {children}
    </code>
  );
};
