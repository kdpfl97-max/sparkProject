import Link from "next/link";

const navItems = [
  { label: "홈", href: "/home" },
  { label: "모임", href: "/groups" },
  { label: "spark", href: "/spark" },
  { label: "챌린지", href: "/challenge" },
  { label: "마이페이지", href: "/profile" },
];

export default function EntryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-8">
      <section className="flex flex-1 flex-col justify-between rounded-[32px] border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur">
        <div>
          <p className="text-sm font-semibold text-spark-lime">SPARK WEB MVP</p>
          <h1 className="mt-4 text-5xl font-black leading-none tracking-tight">
            운동을
            <br />
            켜는 순간
          </h1>
          <p className="mt-5 text-sm leading-6 text-white/68">
            주변 모임을 찾고, 혼자 또는 모임으로 운동을 시작하는 모바일 웹앱 작업 환경입니다.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/home"
            className="block rounded-full bg-spark-lime px-5 py-4 text-center text-sm font-black text-black"
          >
            홈 대시보드로 이동
          </Link>
          <div className="grid grid-cols-5 gap-2 rounded-full bg-black px-2 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-2 py-3 text-center text-[11px] font-bold text-white/70 transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
