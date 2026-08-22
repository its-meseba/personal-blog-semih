import Balancer from "react-wrap-balancer";
import type { ReactNode } from "react";

export function Caption({ children }: { children: ReactNode }) {
  return (
    <span className="my-3 block w-full text-center font-mono text-caption leading-normal text-faint">
      <Balancer>
        <span className="[&>a]:text-accent">{children}</span>
      </Balancer>
    </span>
  );
}
