export type TechSpecStat = {
  id: string;
  /** Small caps label, e.g. "TOP SPEED" */
  label: string;
  /** Large numeric display */
  value: string;
  /** Unit beside the value, e.g. "km/hour" */
  unit: string;
  /** Optional secondary line under the value (e.g. "drag coefficient") */
  sublabel?: string;
};

export type TechSpecsSectionProps = {
  stats: TechSpecStat[];
  cta: { label: string; href: string };
};
