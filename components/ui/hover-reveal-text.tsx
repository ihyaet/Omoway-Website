import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HoverRevealTextProps = {
  children: ReactNode;
  className?: string;
  /** Horizontal: enter from left / exit right (set size via `className`, e.g. `size-[16px]`). */
  direction?: "vertical" | "horizontal";
};

const horizontalEase =
  "transition-transform duration-[400ms] ease-[cubic-bezier(0.33,1,0.68,1)] will-change-transform motion-reduce:transition-none";

/**
 * Duplicated label in a clipped stack; on parent hover it translates so one copy exits
 * while the other enters. Vertical: up/down (`h-[1lh]`). Horizontal: front exits right, duplicate
 * enters from the left — pass dimensions via className.
 * Parent must include Tailwind `group` (see hero CTAs, `Button`).
 */
export function HoverRevealText({
  children,
  className,
  direction = "vertical",
}: HoverRevealTextProps) {
  const translateY =
    "group-hover:-translate-y-1/2 motion-reduce:group-hover:translate-y-0";

  /** Front row slides out to the right. */
  const horizontalOut =
    "translate-x-0 group-hover:translate-x-full motion-reduce:group-hover:translate-x-0";

  /** Duplicate starts off the left edge and moves into place (same direction as the exit). */
  const horizontalIn =
    "-translate-x-full group-hover:translate-x-0 motion-reduce:group-hover:-translate-x-full";

  if (direction === "horizontal") {
    return (
      <span
        className={cn(
          "relative inline-block max-w-full overflow-hidden align-middle",
          className,
        )}
      >
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center [&>*]:shrink-0",
            horizontalEase,
            horizontalOut,
          )}
        >
          {children}
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center [&>*]:shrink-0",
            horizontalEase,
            horizontalIn,
          )}
          aria-hidden
        >
          {children}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-block max-w-full overflow-hidden align-middle",
        "h-[1lh]",
        className,
      )}
    >
      <span
        className={cn(
          "flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.33,1,0.68,1)] will-change-transform motion-reduce:transition-none",
          translateY,
        )}
      >
        <span className="block">{children}</span>
        <span className="block" aria-hidden>
          {children}
        </span>
      </span>
    </span>
  );
}
