"use client";

import { useRef } from "react";
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
 *  - the animation is gated on `[data-animate]`, decided during render and
 *    true only for a route the client router has actually navigated to. The
 *    initially hydrated document therefore carries no animation at all: an
 *    entrance that begins at `opacity: 0` would count as "not painted" and
 *    push out Largest Contentful Paint, and one added after hydration would
 *    flash content that is already on screen. Because the `key` change
 *    remounts the div in the same commit that adds the attribute, no element
 *    is ever animated after it has been painted.
 *  - `opacity` and `transform` only, so the transition is compositor work and
 *    cannot shift layout.
 *
 * `usePathname` reads the client router; unlike `useSearchParams` it does not
 * opt a route out of static rendering.
 */
export function RouteMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // RouteMotion itself never unmounts, so this ref outlives every keyed child
  // and records which route the current wrapper belongs to. The verdict is
  // reached here, during render, so `data-animate` is on the element before
  // its first style resolution instead of arriving a paint later. Keeping the
  // verdict next to the path makes it stable across re-renders of the same
  // route: a mid-animation re-render must not strip the attribute.
  const route = useRef({ pathname, animate: false });
  if (route.current.pathname !== pathname) {
    route.current = { pathname, animate: true };
  }

  return (
    <div
      key={pathname}
      className="route-motion"
      data-animate={route.current.animate ? "" : undefined}
    >
      {children}
    </div>
  );
}
