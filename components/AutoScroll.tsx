// AutoScroll.tsx
"use client";

import { Pause, Play, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AutoScrollProps {
  targetRef?: React.RefObject<HTMLElement>;
}

export default function AutoScroll({ targetRef }: AutoScrollProps) {
  const animationRef = useRef<number | null>(null);
  const lastTimestamp = useRef(0);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollAccumulator = useRef(0);
  const speedRef = useRef(60);
  const panelRef = useRef<HTMLDivElement>(null);

  const [speed, setSpeed] = useState(60);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("auto-scroll-speed");
    if (saved) {
      const value = Number(saved);
      setSpeed(value);
      speedRef.current = value;
    }
  }, []);

  useEffect(() => {
    speedRef.current = speed;
    localStorage.setItem("auto-scroll-speed", speed.toString());
  }, [speed]);

  function stop() {
    setRunning(false);
    setPaused(false);
    scrollAccumulator.current = 0;
    lastTimestamp.current = 0;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }

  function start() {
    scrollAccumulator.current = 0;
    lastTimestamp.current = 0;
    setRunning(true);
  }

  useEffect(() => {
    if (!running) return;

    const step = (timestamp: number) => {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;

      const delta = (timestamp - lastTimestamp.current) / 1000;
      lastTimestamp.current = timestamp;

      if (!paused) {
        scrollAccumulator.current += delta * speedRef.current;
        const pixels = Math.floor(scrollAccumulator.current);

        if (pixels > 0) {
          scrollAccumulator.current -= pixels;

          if (targetRef?.current) {
            const el = targetRef.current;
            el.scrollTop += pixels;

            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
              stop();
              return;
            }
          } else {
            window.scrollBy({ top: pixels, behavior: "auto" });

            const doc = document.documentElement;
            if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
              stop();
              return;
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [running, paused, targetRef]);

  useEffect(() => {
    const handler = () => {
      if (!running) return;

      setPaused(true);

      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);

      pauseTimeout.current = setTimeout(() => {
        setPaused(false);
      }, 1500);
    };

    const target = targetRef?.current;

    if (target) {
      target.addEventListener("wheel", handler, { passive: true });
      target.addEventListener("touchmove", handler, { passive: true });

      return () => {
        target.removeEventListener("wheel", handler);
        target.removeEventListener("touchmove", handler);
      };
    }

    window.addEventListener("wheel", handler, { passive: true });
    window.addEventListener("touchmove", handler, { passive: true });

    return () => {
      window.removeEventListener("wheel", handler);
      window.removeEventListener("touchmove", handler);
    };
  }, [running, targetRef]);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowControls(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
      stop();
    };
  }, []);

  return (
    <div ref={panelRef} className="fixed bottom-2 right-6 z-50">
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-white shadow-xl">
        <div className="flex divide-x divide-slate-700">
          <button
            className="p-3 transition hover:bg-slate-800"
            onClick={() => {
              running ? stop() : start();
              setShowControls(false);
            }}
          >
            {running ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            className="p-3 transition hover:bg-slate-800"
            onClick={() => setShowControls((v) => !v)}
          >
            <Settings size={18} />
          </button>
        </div>

        {showControls && (
          <div className="w-64 border-t border-slate-700 p-4">
            <div className="mb-2 text-sm font-medium">Scroll Speed</div>

            <input
              className="w-full"
              type="range"
              min={10}
              max={150}
              step={1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />

            <div className="mt-2 text-xs text-slate-300">
              {speed} px/sec
            </div>

            {paused && (
              <div className="mt-2 text-xs text-yellow-400">
                Paused while you're scrolling…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
