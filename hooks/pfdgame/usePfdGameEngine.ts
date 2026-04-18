import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createInitialState,
  DIFFICULTY_CONFIG,
  Difficulty,
  PlayerInputState,
  tickGameState,
} from "@/data/pfdgame";

const FRAME_MS = 1000 / 30;

export function usePfdGameEngine(difficulty: Difficulty) {
  const config = useMemo(() => DIFFICULTY_CONFIG[difficulty], [difficulty]);
  const [state, setState] = useState(() => createInitialState(config));
  const [running, setRunning] = useState(false);
  const inputRef = useRef<PlayerInputState>({ pitch: 0, roll: 0, speed: 0, ball: 0 });
  const startedAtRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);

  const reset = useCallback(() => {
    setState(createInitialState(config));
    inputRef.current = { pitch: 0, roll: 0, speed: 0, ball: 0 };
    startedAtRef.current = 0;
    lastFrameRef.current = 0;
    setRunning(false);
  }, [config]);

  const start = useCallback(() => {
    setState(createInitialState(config));
    startedAtRef.current = Date.now();
    lastFrameRef.current = 0;
    setRunning(true);
  }, [config]);

  const stop = useCallback(() => setRunning(false), []);

  const setInput = useCallback((next: Partial<PlayerInputState>) => {
    inputRef.current = {
      ...inputRef.current,
      ...next,
    };
  }, []);

  useEffect(() => {
    reset();
  }, [difficulty, reset]);

  useEffect(() => {
    if (!running) return;

    const loop = () => {
      const now = Date.now();
      const previous = lastFrameRef.current || now - FRAME_MS;
      const deltaMs = Math.min(now - previous, 50);
      lastFrameRef.current = now;

      setState((prev) => {
        const next = tickGameState(prev, inputRef.current, deltaMs, config);
        if (next.over) {
          setRunning(false);
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [config, running]);

  return {
    state,
    running,
    start,
    stop,
    reset,
    setInput,
    config,
  };
}
