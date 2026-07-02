"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SparkCharacter } from "@/components/character/spark-character";

const SPLASH_VISITED_KEY = "spark-splash-visited";
const ONBOARDING_COMPLETE_KEY = "spark-onboarding-complete";

export function SplashScreen() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasVisited = window.sessionStorage.getItem(SPLASH_VISITED_KEY) === "true";
    const duration = reducedMotion ? 250 : hasVisited ? 650 : 1800;

    window.sessionStorage.setItem(SPLASH_VISITED_KEY, "true");

    const leaveTimer = window.setTimeout(() => setLeaving(true), Math.max(0, duration - 220));
    const target = window.localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true" ? "/home" : "/onboarding";
    const navigationTimer = window.setTimeout(() => router.replace(target), duration);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(navigationTimer);
    };
  }, [router]);

  const skipSplash = () => {
    window.sessionStorage.setItem(SPLASH_VISITED_KEY, "true");
    setLeaving(true);
    const target = window.localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true" ? "/home" : "/onboarding";
    window.setTimeout(() => router.replace(target), 160);
  };

  return (
    <main
      className={`mx-auto flex min-h-dvh w-full max-w-[393px] flex-col overflow-hidden bg-[#0A0A0B] px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))] text-white transition-opacity duration-200 ${leaving ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex justify-end">
        <button
          type="button"
          onClick={skipSplash}
          className="h-9 rounded-full px-3 text-[11px] font-black text-white/48 transition hover:bg-white/8 hover:text-white"
        >
          건너뛰기
        </button>
      </div>

      <section className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="spark-character-rise relative grid size-44 place-items-center">
          <div className="absolute inset-5 rounded-full border border-spark-lime/22 shadow-[0_0_52px_rgba(223,255,76,0.16)]" />
          <SparkCharacter level={1} state="default" size={160} priority className="relative z-10" />
        </div>

        <div className="spark-copy-rise mt-5">
          <p className="text-[11px] font-black text-spark-lime">WELCOME TO</p>
          <h1 className="mt-1 text-[36px] font-black leading-none">SPARK</h1>
          <p className="mt-3 text-sm font-bold text-white/62">오늘의 불씨를 깨워볼까요?</p>
        </div>

        <div className="mt-8 h-1 w-24 overflow-hidden rounded-full bg-white/10" aria-label="앱을 준비하는 중">
          <span className="spark-progress block h-full rounded-full bg-spark-lime" />
        </div>
      </section>

      <p className="text-center text-[10px] font-bold text-white/28">MOVE TOGETHER. GROW BRIGHTER.</p>
    </main>
  );
}
