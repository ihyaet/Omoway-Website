"use client";

import { useId, useMemo, useState } from "react";

import { ProductModesStaggerReveal } from "@/components/sections/ProductModesStaggerReveal";
import type { ProductModesSectionProps } from "@/lib/product-modes-section-types";

/** Large typographic backdrop behind the mode image — keyed by `mode.id`. */
const MODE_BACKGROUND_LABEL: Partial<Record<string, string>> = {
  scooter: "SCOOTER",
  street: "STREET",
  gt: "GT MODE",
};

export function ProductModesSection(props: ProductModesSectionProps) {
  const { modes, defaultModeId } = props;

  const baseId = useId();

  const initialId = useMemo(() => {
    if (!modes.length) return "";
    if (defaultModeId && modes.some((m) => m.id === defaultModeId))
      return defaultModeId;
    return modes[0].id;
  }, [modes, defaultModeId]);

  const [activeId, setActiveId] = useState(initialId);

  const active = modes.find((m) => m.id === activeId) ?? modes[0];

  if (!active) return null;

  const backgroundLabel =
    MODE_BACKGROUND_LABEL[active.id] ?? active.backdropLabel.toUpperCase();

  return (
    <section
      id="product-modes"
      aria-labelledby={`${baseId}-section-heading`}
      className="isolate flex min-h-dvh w-full min-w-0 flex-col overflow-x-hidden bg-[color:var(--color-bg-light)] px-[length:var(--space-4)] pt-[var(--space-10)] pb-0 sm:pt-[var(--space-12)] md:px-[length:var(--space-6)] md:pt-[var(--space-16)] xl:px-[length:var(--page-margin-inline-desktop)] xl:pt-[var(--space-10)]"
    >
      <h2 id={`${baseId}-section-heading`} className="sr-only">
        OMO X driving modes
      </h2>

      <div
        role="tablist"
        aria-label="OMO X configuration modes"
        className="relative z-[10] flex w-full min-w-0 shrink-0 flex-row flex-nowrap items-stretch gap-[12px] overflow-x-auto overflow-y-visible overscroll-x-contain scroll-smooth pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[480px]:overflow-x-visible min-[480px]:pb-0"
      >
        {modes.map((mode) => {
          const selected = mode.id === active.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${mode.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(mode.id)}
              className={`w-fit shrink-0 whitespace-nowrap px-[var(--space-4)] py-[var(--space-5)] text-center font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] transition-[color,background-color,border-color,border-bottom-width] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none min-[480px]:flex-1 min-[480px]:min-w-0 min-[480px]:whitespace-normal min-[480px]:px-[var(--space-6)] min-[480px]:py-[var(--space-6)] xl:text-[length:var(--text-exp-body-xs)] ${
                selected
                  ? "border-b-4 border-b-[color:var(--color-primary-default)] bg-[rgba(83,116,0,0.1)] text-[color:var(--color-black)]"
                  : "border-b-2 border-b-[color:var(--color-border-light)] bg-[color:var(--color-bg-light)] text-[color:var(--color-text-primary-light)] hover:bg-[color:var(--color-accent-subtle)]"
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      <div className="relative z-0 mx-auto flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-visible">
        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${active.id}`}
          className="mt-[var(--space-12)] flex min-h-0 w-full flex-1 flex-col overflow-visible xl:mt-[var(--space-16)]"
        >
          <ProductModesStaggerReveal
            modeId={active.id}
            description={active.description}
            features={active.features}
            backgroundLabel={backgroundLabel}
            image={active.image}
          />
        </div>
      </div>
    </section>
  );
}
