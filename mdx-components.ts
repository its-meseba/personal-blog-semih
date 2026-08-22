import { A as a } from "app/(post)/components/a";
import { P as p } from "app/(post)/components/p";
import { H1 as h1 } from "app/(post)/components/h1";
import { H2 as h2 } from "app/(post)/components/h2";
import { H3 as h3 } from "app/(post)/components/h3";
import { OL as ol } from "app/(post)/components/ol";
import { UL as ul } from "app/(post)/components/ul";
import { LI as li } from "app/(post)/components/li";
import { HR as hr } from "app/(post)/components/hr";
import { Code as code } from "app/(post)/components/code";
import { Tweet } from "app/(post)/components/tweet";
import { Image } from "app/(post)/components/image";
import { Figure } from "app/(post)/components/figure";
import { Snippet } from "app/(post)/components/snippet";
import { Caption } from "app/(post)/components/caption";
import { Callout } from "app/(post)/components/callout";
import { Diagram } from "app/(post)/components/diagram";
import { PullQuote } from "app/(post)/components/pull-quote";
import { Steps, Step } from "app/(post)/components/steps";
import { CodeCompare } from "app/(post)/components/code-compare";
import { Embed } from "app/(post)/components/embed";
import { YouTube } from "app/(post)/components/youtube";
import { Ref, FootNotes, FootNote } from "app/(post)/components/footnotes";
import { Blockquote as blockquote } from "app/(post)/components/blockquote";
import { Table, Thead, Tbody, Tr, Th, Td } from "app/(post)/components/table";

export function useMDXComponents(components: {
  [component: string]: React.ComponentType;
}) {
  return {
    ...components,
    a,
    h1,
    h2,
    h3,
    p,
    ol,
    ul,
    li,
    hr,
    code,
    pre: Snippet,
    img: Image,
    blockquote,
    Tweet,
    Image,
    Figure,
    Snippet,
    Caption,
    Callout,
    Diagram,
    PullQuote,
    Steps,
    Step,
    CodeCompare,
    Embed,
    YouTube,
    Ref,
    FootNotes,
    FootNote,
    table: Table,
    thead: Thead,
    tbody: Tbody,
    tr: Tr,
    th: Th,
    td: Td,
  };
}
