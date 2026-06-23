"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, Home, Map, Plus, UserRound, Zap } from "lucide-react";

const tabs = [
  { label: "홈", href: "/home", icon: Home },
  { label: "모임", href: "/groups", icon: Map },
  { label: "spark", href: "/spark", icon: Zap, primary: true },
  { label: "챌린지", href: "/challenge", icon: Award },
  { label: "프로필", href: "/profile", icon: UserRound },
];

const shellHiddenPrefixes = ["/login", "/onboarding"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldHideShell = pathname === "/" || shellHiddenPrefixes.some((path) => pathname.startsWith(path));

  if (shouldHideShell) {
    return children;
  }

  const isHome = pathname === "/home";
  const isMapPage = pathname === "/groups";
  const shouldShowHeader = !isHome && !isMapPage;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-background shadow-2xl ring-1 ring-white/10 sm:my-6 sm:min-h-[860px] sm:rounded-[36px]">
      {shouldShowHeader && (
        <header className="flex h-24 shrink-0 items-end justify-between px-5 pb-4">
          <div>
            <p className="text-xs font-black text-spark-lime">SPARK WEB MVP</p>
            <h1 className="mt-1 text-3xl font-black leading-none">spark</h1>
          </div>
          <Link
            href="/groups/new"
            aria-label="모임 만들기"
            className="grid size-11 place-items-center rounded-full bg-spark-lime text-black shadow-[0_0_28px_rgba(223,255,76,0.28)]"
          >
            <Plus size={21} strokeWidth={3} />
          </Link>
        </header>
      )}

      <div
        className={
          isHome
            ? "min-h-0 flex-1 overflow-y-auto pb-28"
            : isMapPage
              ? "min-h-0 flex-1 overflow-hidden"
              : "min-h-0 flex-1 overflow-y-auto px-5 pb-28"
        }
      >
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] px-3 pb-3 sm:bottom-6">
        <div className="grid grid-cols-5 gap-1 rounded-[28px] border border-white/10 bg-black/92 p-2 shadow-2xl backdrop-blur-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-[22px] text-[11px] font-black transition",
                  active ? "bg-spark-lime text-black" : "text-white/54 hover:bg-white/8 hover:text-white",
                  tab.primary && !active ? "border border-spark-lime/35 bg-card text-white" : "",
                  tab.primary && active ? "bg-gradient-to-br from-spark-lime to-spark-purple text-black" : "",
                ].join(" ")}
              >
                <Icon size={19} strokeWidth={2.6} />
                <span className="truncate">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
