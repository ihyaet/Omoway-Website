/**
 * GSAP-compatible ease from a damped spring (critical / overdamped — no bounce).
 * Matches typical design-tool spring: stiffness, damping, mass; compresses the
 * simulated response into tween progress 0→1.
 */
export function createDampedSpringEase(config: {
  stiffness: number;
  damping: number;
  mass: number;
  deltaTime?: number;
  restEpsilon?: number;
}): (t: number) => number {
  const k = config.stiffness;
  const c = config.damping;
  const m = config.mass;
  const dt = config.deltaTime ?? 1 / 240;
  const restE = config.restEpsilon ?? 1e-3;

  const target = 1;
  const xs: number[] = [0];
  let x = 0;
  let v = 0;
  let simulatedTime = 0;

  for (let iter = 0; iter < 20_000; iter++) {
    const a = (k * (target - x) - c * v) / m;
    v += a * dt;
    x += v * dt;
    x = Math.min(Math.max(x, 0), target);
    simulatedTime += dt;
    xs.push(x);

    if (
      simulatedTime > 1 / 60 &&
      Math.abs(target - x) < restE &&
      Math.abs(v) < restE * 12
    ) {
      break;
    }
  }

  const xFinal = xs[xs.length - 1] ?? 1;
  const norm = xFinal > 1e-6 ? 1 / xFinal : 1;
  const maxIndex = xs.length - 1;

  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const idx = t * maxIndex;
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, maxIndex);
    const f = idx - i0;
    const y = xs[i0]! * (1 - f) + xs[i1]! * f;
    return Math.min(1, Math.max(0, y * norm));
  };
}

/** Color variant image reveal — tool: 300ms, stiffness 320, damping 40, mass 1 */
export const colorVariantImageRevealEase = createDampedSpringEase({
  stiffness: 320,
  damping: 40,
  mass: 1,
});
