import { Caption } from "./caption";
import { CodeBlock } from "./code-block";

export const Snippet = ({
  children,
  scroll = true,
  caption = null,
  filename = null,
}) => (
  <>
    <CodeBlock filename={filename} scroll={scroll}>
      {children}
    </CodeBlock>
    {caption != null ? <Caption>{caption}</Caption> : null}
  </>
);
