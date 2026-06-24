"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, Home, Map, UserRound, Zap } from "lucide-react";

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
    <div className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col overflow-hidden bg-background shadow-2xl ring-1 ring-white/10 sm:my-5 sm:min-h-[852px] sm:rounded-[34px]">
      {shouldShowHeader && (
        <header className="flex h-20 shrink-0 items-end px-4 pb-3">
          <div>
            <p className="text-[10px] font-black text-spark-lime">SPARK WEB MVP</p>
            <h1 className="mt-1 text-2xl font-black leading-none">spark</h1>
          </div>
        </header>
      )}

      <div
        className={
          isHome
            ? "min-h-0 flex-1 overflow-y-auto pb-24"
            : isMapPage
              ? "min-h-0 flex-1 overflow-hidden"
              : "min-h-0 flex-1 overflow-y-auto px-4 pb-24"
        }
      >
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[393px] px-2.5 pb-2.5 sm:bottom-5">
        <div className="grid grid-cols-5 gap-1 rounded-[24px] border border-white/10 bg-black/92 p-1.5 shadow-2xl backdrop-blur-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-[19px] text-[10px] font-black transition",
                  active ? "bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.18)]" : "text-white/62 hover:bg-white/8 hover:text-white",
                  tab.primary && !active ? "bg-spark-lime text-black shadow-[0_0_22px_rgba(223,255,76,0.28)] hover:bg-spark-lime hover:text-black" : "",
                  tab.primary && active ? "bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.18)]" : "",
                ].join(" ")}
              >
                <Icon size={17} strokeWidth={2.5} />
                <span className="truncate">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
