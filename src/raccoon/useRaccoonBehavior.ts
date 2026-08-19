import { useEffect, useRef, useState } from "react";
import { useSystem } from "../state/SystemContext";
import { useRaccoon } from "./RaccoonContext";
import { raccoonMemory, msSinceInput, markVisited } from "./raccoonMemory";
import { subscribeRaccoonSignal } from "./raccoonBus";
import type { RaccoonBehavior } from "./types";

const STEAL_IDLE_MS = 5 * 60 * 1000; // 5 minutes, per explicit direction
const STEAL_COOLDOWN_MS = 6 * 60 * 1000;
const STEAL_CHANCE_PER_TICK = 0.25;
const SLEEP_AFTER_MS = 24_000;
const WATCH_RADIUS = 150;
const CLICK_REACT_RADIUS = 160;
const CLICK_COOLDOWN_MS = 20_000;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function deriveVisibility(behavior: RaccoonBehavior) {
  if (behavior === "hidden") return "hidden";
  if (behavior === "peek_ears") return "peek_ears";
  if (behavior === "peek_eyes" || behavior === "hiding") return "peek_eyes";
  return "full";
}

interface Options {
  spotId: string;
  wanderRadius: number;
  isFirstVisitSpot?: boolean;
}

export function useRaccoonBehavior({ wanderRadius, isFirstVisitSpot }: Options) {
  const { isReturning } = useRaccoon();
  const { setCursorCaptured } = useSystem();

  const rootRef = useRef<HTMLDivElement>(null);
  const [behavior, setBehavior] = useState<RaccoonBehavior>("hidden");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [bubble, setBubble] = useState<string | null>(null);
  const [walkOffset, setWalkOffset] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [earTwitch, setEarTwitch] = useState(false);

  const behaviorRef = useRef(behavior);
  behaviorRef.current = behavior;
  const sequenceActive = useRef(false);
  const lastClickHandledAt = useRef(0);
  const lastClickReactAt = useRef(0);
  const proximityHits = useRef(0);
  const idleSinceTs = useRef(Date.now());
  const reduceMotion = useRef(false);
  const walkOffsetRef = useRef(0);
  walkOffsetRef.current = walkOffset;

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // ---------------- one-shot cancellable sequence helper ----------------
  async function runSequence(steps: Array<() => void>, stepDelaysMs: number[]) {
    sequenceActive.current = true;
    const startInput = raccoonMemory.lastInputAt;
    for (let i = 0; i < steps.length; i++) {
      steps[i]();
      await sleep(stepDelaysMs[i]);
      if (raccoonMemory.lastInputAt !== startInput) {
        return false; // real input arrived — caller decides how to unwind
      }
    }
    sequenceActive.current = false;
    return true;
  }

  // ---------------- greeting (first visit vs return) ----------------
  useEffect(() => {
    if (!isFirstVisitSpot) return;
    // Read-only: whether THIS run should play the long or short greeting.
    // Deliberately not mutated until the sequence actually finishes, so a
    // dev-mode StrictMode phantom run (mount→cleanup→mount) that gets
    // cancelled mid-sequence can't permanently mark "already greeted" and
    // leave the real run skipped with nothing to fall back on.
    if (raccoonMemory.hasGreetedThisSession) return;

    let cancelled = false;
    (async () => {
      await sleep(2200);
      if (cancelled) return;

      if (!isReturning) {
        setBehavior("peek_ears");
        await sleep(650);
        if (cancelled) return;
        setBehavior("hidden");
        await sleep(280);
        if (cancelled) return;
        setBehavior("peek_eyes");
        await sleep(750);
        if (cancelled) return;
        setBehavior("emerging");
        await sleep(950);
        if (cancelled) return;
        setBehavior("greeting_wave");
        setBubble("HI.");
        await sleep(1500);
        if (cancelled) return;
        setBubble(null);
        setBehavior("idle_stand");
      } else {
        setBehavior("peek_eyes");
        await sleep(350);
        if (cancelled) return;
        setBehavior("emerging");
        await sleep(500);
        if (cancelled) return;
        setBehavior("greeting_wave");
        setBubble("BACK AGAIN?");
        await sleep(1300);
        if (cancelled) return;
        setBubble(null);
        setBehavior("idle_stand");
      }
      raccoonMemory.hasGreetedThisSession = true;
      markVisited();
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstVisitSpot]);

  // ---------------- transient blink / ear twitch, organic timing ----------------
  useEffect(() => {
    if (reduceMotion.current) return;
    let blinkTimer: number;
    let earTimer: number;

    function scheduleBlink() {
      blinkTimer = window.setTimeout(
        () => {
          if (behaviorRef.current !== "hidden" && behaviorRef.current !== "sleeping") {
            setBlinking(true);
            window.setTimeout(() => setBlinking(false), 140);
          }
          scheduleBlink();
        },
        2200 + Math.random() * 4200,
      );
    }
    function scheduleEarTwitch() {
      earTimer = window.setTimeout(
        () => {
          if (behaviorRef.current === "idle_stand" || behaviorRef.current === "idle_sit") {
            setEarTwitch(true);
            window.setTimeout(() => setEarTwitch(false), 400);
          }
          scheduleEarTwitch();
        },
        5000 + Math.random() * 9000,
      );
    }

    scheduleBlink();
    scheduleEarTwitch();
    return () => {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(earTimer);
    };
  }, []);

  // ---------------- signals: project category / error ----------------
  useEffect(() => {
    return subscribeRaccoonSignal((signal) => {
      if (sequenceActive.current) return;
      if (signal.type === "project-category") {
        if (!signal.category) return;
        const reaction: Partial<Record<string, RaccoonBehavior>> = {
          VIDEO: "idle_sit",
          DESIGN: "curious",
          EXPERIMENTAL: "confused",
          MOTION: "excited",
        };
        const b = reaction[signal.category];
        if (!b) return;
        setBehavior(b);
        window.setTimeout(() => {
          if (!sequenceActive.current) setBehavior("idle_stand");
        }, 2200);
      } else if (signal.type === "celebrate") {
        setBehavior("excited");
        window.setTimeout(() => {
          if (!sequenceActive.current) setBehavior("idle_stand");
        }, 1500);
      } else if (signal.type === "error-seen") {
        setBehavior("startled");
        window.setTimeout(() => setBehavior("hiding"), 450);
        window.setTimeout(() => {
          if (!sequenceActive.current) setBehavior("idle_stand");
        }, 2600);
      }
    });
  }, []);

  // ---------------- main tick scheduler ----------------
  useEffect(() => {
    if (behavior === "hidden" && (!isFirstVisitSpot || raccoonMemory.hasGreetedThisSession)) {
      // spots without a scripted intro, or a spot the raccoon is
      // revisiting after already greeting once this session, start idle
      // immediately instead of waiting on a greeting that won't replay.
      setBehavior("idle_stand");
    }

    let timer: number;

    function scheduleTick(delay: number) {
      timer = window.setTimeout(tick, delay);
    }

    function tick() {
      scheduleTick(2600 + Math.random() * 2600);

      if (sequenceActive.current) return;
      const b = behaviorRef.current;
      if (b === "hidden" || b === "peek_ears" || b === "peek_eyes" || b === "emerging" || b === "greeting_wave") {
        return; // still inside a scripted moment
      }

      const el = rootRef.current;
      const rect = el?.getBoundingClientRect();
      const idle = msSinceInput();

      // click proximity reaction
      const click = raccoonMemory.lastClick;
      if (
        click &&
        click.t !== lastClickHandledAt.current &&
        rect &&
        Date.now() - lastClickReactAt.current > CLICK_COOLDOWN_MS
      ) {
        lastClickHandledAt.current = click.t;
        const dx = click.x - (rect.left + rect.width / 2);
        const dy = click.y - (rect.top + rect.height / 2);
        if (Math.hypot(dx, dy) < CLICK_REACT_RADIUS && Date.now() - click.t < 1200) {
          lastClickReactAt.current = Date.now();
          setBehavior("startled");
          window.setTimeout(() => setBehavior("idle_stand"), 500);
          return;
        }
      }

      // cursor-steal gate (very deliberate: long idle, low odds, cooldown)
      if (
        !reduceMotion.current &&
        idle >= STEAL_IDLE_MS &&
        Date.now() - raccoonMemory.lastStealAttemptAt > STEAL_COOLDOWN_MS &&
        Math.random() < STEAL_CHANCE_PER_TICK
      ) {
        void runStealSequence();
        return;
      }

      // sleep after a long, quiet dwell
      if (idle > SLEEP_AFTER_MS && (b === "idle_stand" || b === "idle_sit")) {
        if (Date.now() - idleSinceTs.current > SLEEP_AFTER_MS && Math.random() < 0.4) {
          setBehavior("sleeping");
          return;
        }
      } else {
        idleSinceTs.current = Date.now();
      }

      if (b === "sleeping") {
        // wake if the cursor comes back near, or on any fresh input
        if (idle < 1200 || (rect && cursorDistance(rect) < WATCH_RADIUS)) {
          setBehavior("waking");
          window.setTimeout(() => setBehavior("idle_stand"), 500);
        }
        return;
      }

      // cursor watching / curiosity build-up
      if (rect) {
        const dist = cursorDistance(rect);
        if (dist < WATCH_RADIUS) {
          proximityHits.current = Math.min(proximityHits.current + 1, 5);
          setFacing(raccoonMemory.mouse.x < rect.left + rect.width / 2 ? -1 : 1);
          setBehavior(proximityHits.current >= 3 ? "curious" : "watching_cursor");
          return;
        }
        proximityHits.current = Math.max(0, proximityHits.current - 1);
      }

      // otherwise: mostly idle, occasionally walk, rarely something odd
      const roll = Math.random();
      if (roll < 0.1 && reduceMotion.current === false) {
        const target = (Math.random() * 2 - 1) * wanderRadius;
        setFacing(target < walkOffsetRef.current ? -1 : 1);
        setBehavior("walking");
        setWalkOffset(target);
        window.setTimeout(() => setBehavior("idle_stand"), 1700);
      } else if (roll < 0.16) {
        setBehavior(Math.random() < 0.5 ? "idle_sit" : "idle_stand");
      } else if (roll < 0.19) {
        setBehavior("eating");
        window.setTimeout(() => setBehavior("idle_stand"), 1400);
      } else if (roll < 0.21) {
        setBehavior("confused");
        window.setTimeout(() => setBehavior("idle_stand"), 1100);
      } else if (roll < 0.225 && !reduceMotion.current) {
        setBehavior("glitching");
        window.setTimeout(() => setBehavior("idle_stand"), 450);
      }
    }

    function cursorDistance(rect: DOMRect) {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return Math.hypot(raccoonMemory.mouse.x - cx, raccoonMemory.mouse.y - cy);
    }

    async function runStealSequence() {
      raccoonMemory.lastStealAttemptAt = Date.now();
      const dir = raccoonMemory.mouse.x < window.innerWidth / 2 ? -1 : 1;

      const ok = await runSequence(
        [
          () => setBehavior("steal_observe"),
          () => setBehavior("steal_approach"),
          () => {
            setFacing(dir as 1 | -1);
            setWalkOffset((w) => w + dir * wanderRadius * 0.5);
          },
          () => setBehavior("steal_reach"),
          () => setBubble("MINE."),
        ],
        [700, 500, 900, 700, 500],
      );

      if (!ok) return abortSequence();

      setBubble(null);
      setBehavior("steal_run");
      setCursorCaptured(true);
      setWalkOffset((w) => w + dir * 26);

      const ran = await runSequence([() => {}], [1100]);
      if (!ran) return abortSequence();

      setCursorCaptured(false);
      setBehavior("steal_return");
      setBubble("...");
      await sleep(700);
      setBubble(null);
      setBehavior("idle_stand");
      setWalkOffset(0);
      sequenceActive.current = false;
    }

    function abortSequence() {
      setCursorCaptured(false);
      setBubble("OH.");
      setBehavior("idle_stand");
      window.setTimeout(() => setBubble(null), 900);
      window.setTimeout(() => setWalkOffset(0), 50);
      sequenceActive.current = false;
    }

    scheduleTick(1200);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanderRadius, isFirstVisitSpot]);

  return {
    rootRef,
    behavior,
    facing,
    bubble,
    walkOffset,
    blinking,
    earTwitch,
    visibility: deriveVisibility(behavior),
  };
}
