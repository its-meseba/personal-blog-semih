"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The soft-navigation half of the page transition.
 *
 * Every `next/link` click is a client-side navigation, which the native View
 * Transitions API never sees (see the long note in `app/globals.css`). This
 * wrapper is the substitute: keying the element on the pathname makes the
 * browser create a fresh element on every route change, which replays the
 * `page-enter` keyframes - a ~200ms cross-fade and six pixels of rise on the
 * incoming content, with the masthead left standing still.
 *
 * Two deliberate properties:
 *
 *  - the animation is gated on `[data-motion-ready]`, which is set once after
 *    hydration. The first document paint therefore starts fully opaque: an
 *    entrance that begins at `opacity: 0` would count as "not painted" and
 *    push out Largest Contentful Paint.
 *  - `opacity` and `transform` only, so the transition is compositor work and
 *    cannot shift layout.
 *
 * `usePathname` reads the client router; unlike `useSearchParams` it does not
 * opt a route out of static rendering.
 */
export function RouteMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-motion-ready", "");
  }, []);

  return (
    <div key={pathname} className="route-motion">
      {children}
    </div>
  );
}
