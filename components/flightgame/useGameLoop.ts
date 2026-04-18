import { useEffect, useRef } from "react";

const FIXED_DT = 1 / 60;
const MAX_ACCUM_S = 0.25;

export function useGameLoop(
  tick: (dt: number) => void,
  enabled: boolean = true
): void {
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    if (!enabled) return;

    let rafId: number | null = null;
    let last: number | null = null;
    let accumulator = 0;

    const loop = (now: number) => {
      if (last != null) {
        let elapsed = (now - last) / 1000;
        if (elapsed > MAX_ACCUM_S) elapsed = MAX_ACCUM_S;
        accumulator += elapsed;
        while (accumulator >= FIXED_DT) {
          tickRef.current(FIXED_DT);
          accumulator -= FIXED_DT;
        }
      }
      last = now;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [enabled]);
}
