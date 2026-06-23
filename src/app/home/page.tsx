import Link from "next/link";
import {
  Activity,
  Bike,
  Dumbbell,
  Flame,
  Footprints,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Timer,
  Trophy,
} from "lucide-react";
import { getHomeDashboardData } from "@/shared/data-access/spark-data";
import type { ActivityLog } from "@/shared/types";

const routines = [
  { label: "축구", icon: Trophy },
  { label: "농구", icon: Activity },
  { label: "요가", icon: Flame },
  { label: "런닝", icon: Footprints },
  { label: "테니스", icon: ShieldCheck },
  { label: "Gym", icon: Dumbbell },
];

const meetupCards = [
  {
    title: "퇴근 후 축구 한 판",
    tag: "축구",
    place: "해바라기 공원, 구로동",
    time: "오늘, 6:00 PM",
    members: "9/10 참여",
    tone: "from-spark-lime via-[#b8ff5f] to-spark-purple",
  },
  {
    title: "출근 전 요가 챌린지 하실분",
    tag: "요가",
    place: "개인 집에서 진행",
    time: "1주일, 매일 7:00 AM",
    members: "12/15 참여",
    tone: "from-spark-lavender via-white to-spark-purple",
  },
  {
    title: "날씨 좋은데 같이 뛰어요!",
    tag: "Running",
    place: "동네 하천",
    time: "월, 8:00 PM",
    members: "3/5 참여",
    tone: "from-[#2a2a2d] via-spark-purple to-spark-lime",
  },
];

const logFallbacks = [
  { title: "30분 러닝", time: "오늘 · 6:30 AM", calories: "320 kcal", place: "** 동네" },
  { title: "1시간 헬스장", time: "어제 · 5:45 PM", calories: "450 kcal", place: "헬스장" },
  { title: "20분 사이클링", time: "Oct 24 · 10:15 AM", calories: "180 kcal", place: "집" },
];

export default function HomePage() {
  const { ad, adPartner, health, recentLogs, recommendedMeetups } = getHomeDashboardData();

  return (
    <main className="min-h-full bg-background px-4 pb-5 pt-5 text-white">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-xl bg-card text-spark-lime ring-1 ring-white/10 shadow-[0_0_24px_rgba(223,255,76,0.18)]">
            <Flame size={17} fill="currentColor" strokeWidth={2.4} />
          </div>
          <p className="text-lg font-black tracking-[-0.02em]">SPARK</p>
        </div>
        <Link
          href="/groups/new"
          aria-label="번개 모임 만들기"
          className="grid size-9 place-items-center rounded-full bg-spark-lime text-black shadow-[0_0_26px_rgba(223,255,76,0.25)]"
        >
          <Plus size={18} strokeWidth={2.8} />
        </Link>
      </section>

      <section className="mt-6">
        <p className="text-xs font-black text-spark-lime">오늘의 SPARK</p>
        <h1 className="mt-2 max-w-[300px] text-[30px] font-black leading-[1.05] tracking-[-0.03em]">
          OO님 운동할 준비가 되셨나요?
        </h1>
        <p className="mt-2 text-[13px] font-semibold text-white/58">
          이번 주에 3개의 모임이 예정되어 있습니다.
        </p>
      </section>

      <section className="mt-6 overflow-hidden rounded-[24px] bg-spark-lime p-4 text-black">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-black">철수님 꾸준히 운동하고 계신데요?</p>
            <h2 className="mt-2 text-2xl font-black leading-none">{health.streakDays || 50}일째 운동 중</h2>
            <p className="mt-2 text-xs font-bold text-black/62">근성장이 되고 있어요!</p>
          </div>
          <div className="grid size-[76px] shrink-0 place-items-center rounded-full bg-black text-center text-[11px] font-black leading-tight text-spark-lime shadow-[0_0_28px_rgba(0,0,0,0.25)]">
            운동 Lv
            <br />
            뱃지
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-black/10 p-3">
            <p className="text-xs font-black text-black/55">총 운동 횟수</p>
            <p className="mt-1 text-xl font-black">85 번</p>
          </div>
          <div className="rounded-2xl bg-black p-3 text-white">
            <p className="text-xs font-black text-white/55">오늘 루틴</p>
            <p className="mt-1 text-xl font-black">{health.routineProgress}%</p>
          </div>
        </div>
      </section>

      <Link
        href="/spark"
        className="mt-4 flex h-12 items-center justify-center rounded-full bg-white text-[13px] font-black tracking-[0.04em] text-black shadow-[0_0_28px_rgba(255,255,255,0.1)]"
      >
        지금 운동 시작하기
      </Link>

      <SectionHeader title="자주하는 운동 루틴" action="직접입력" href="/spark/solo" />
      <div className="scrollbar-none -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2">
        {routines.map((routine) => {
          const Icon = routine.icon;
          return (
            <Link key={routine.label} href="/spark/solo" className="w-16 shrink-0 text-center">
              <div className="grid size-14 place-items-center rounded-[18px] border border-white/10 bg-card text-spark-lime">
                <Icon size={23} strokeWidth={2.4} />
              </div>
              <p className="mt-2 text-[11px] font-black text-white/78">{routine.label}</p>
            </Link>
          );
        })}
      </div>

      <SectionHeader title="추천 번개" action="전체보기" href="/groups" />
      <div className="scrollbar-none -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2">
        {meetupCards.map((meetup, index) => (
          <MeetupCard
            key={meetup.title}
            meetup={{
              ...meetup,
              id: recommendedMeetups[index]?.id ?? `fallback-${index}`,
            }}
          />
        ))}
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <ActionCard
          href="/groups/new"
          icon={Plus}
          title="번개 모임 열기"
          body="운동 모임을 열어 볼까요?"
        />
        <ActionCard
          href="/groups"
          icon={Search}
          title="내 주변 번개운동 찾기"
          body="우리 동네 운동 참여"
        />
      </section>

      <section className="mt-6 rounded-[24px] bg-card p-4 ring-1 ring-white/10">
        <h2 className="text-[13px] font-black">오늘의 운동 현황</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <HealthMetric value={`${(health.steps / 1000).toFixed(1)}k`} label="걸음 수" icon={Footprints} />
          <HealthMetric value={`${health.calories}`} label="kcal" icon={Flame} />
          <HealthMetric value={`${health.activeMinutes}m`} label="활동 시간" icon={Timer} />
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">이전 운동 기록</h2>
          <Link href="/profile" className="text-xs font-black text-spark-lime">
            전체보기
          </Link>
        </div>
        <div className="mt-3 space-y-3">
          {logFallbacks.map((fallback, index) => (
            <WorkoutLogCard key={fallback.title} fallback={fallback} log={recentLogs[index]} />
          ))}
        </div>
      </section>

      {ad && (
        <section className="mt-6 rounded-[24px] bg-gradient-to-br from-spark-lavender to-spark-purple p-4 text-black">
          <p className="text-xs font-black">{adPartner?.name ?? "광고"}</p>
          <h2 className="mt-2 text-xl font-black">광고</h2>
          <p className="mt-2 text-sm font-bold text-black/62">{ad.description || "광고 문구 들어가는 곳"}</p>
          <Link
            href="/groups"
            className="mt-4 inline-flex rounded-full bg-black px-4 py-2.5 text-xs font-black text-white"
          >
            탐색하기
          </Link>
        </section>
      )}
    </main>
  );
}

function SectionHeader({ title, action, href }: { title: string; action: string; href: string }) {
  return (
    <div className="mt-7 flex items-center justify-between">
      <h2 className="text-lg font-black tracking-[-0.01em]">{title}</h2>
      <Link href={href} className="text-xs font-black text-spark-lime">
        {action}
      </Link>
    </div>
  );
}

function MeetupCard({
  meetup,
}: {
  meetup: (typeof meetupCards)[number] & { id: string };
}) {
  return (
    <Link
      href={`/groups/${meetup.id}`}
      className="w-64 shrink-0 overflow-hidden rounded-[22px] border border-white/10 bg-card shadow-2xl"
    >
      <div className={`relative h-32 bg-gradient-to-br ${meetup.tone}`}>
        <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-1 text-[11px] font-black text-white">
          {meetup.tag}
        </span>
      </div>
      <div className="p-3.5">
        <h3 className="truncate text-[13px] font-black">{meetup.title}</h3>
        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-white/58">
          <MapPin size={13} />
          {meetup.place}
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] font-black text-white/48">
          <span>{meetup.time}</span>
          <span>{meetup.members}</span>
        </div>
      </div>
    </Link>
  );
}

function ActionCard({
  href,
  icon: Icon,
  title,
  body,
}: {
  href: string;
  icon: typeof Plus;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="rounded-[22px] border border-white/10 bg-card p-3.5">
      <div className="grid size-9 place-items-center rounded-2xl bg-spark-lime text-black">
        <Icon size={18} strokeWidth={2.7} />
      </div>
      <p className="mt-3 text-[13px] font-black">{title}</p>
      <p className="mt-1 text-xs font-bold text-white/48">{body}</p>
    </Link>
  );
}

function HealthMetric({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: typeof Footprints;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-2.5 text-center">
      <div className="mx-auto grid size-9 place-items-center rounded-full bg-black text-spark-lime">
        <Icon size={17} strokeWidth={2.5} />
      </div>
      <p className="mt-2 text-[13px] font-black">{value}</p>
      <p className="text-[11px] font-bold text-white/45">{label}</p>
    </div>
  );
}

function WorkoutLogCard({
  fallback,
  log,
}: {
  fallback: (typeof logFallbacks)[number];
  log?: ActivityLog;
}) {
  return (
    <article className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-card p-3.5">
      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white/8 text-spark-lime">
        {log?.activityType === "riding" ? <Bike size={20} /> : <Footprints size={20} />}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[13px] font-black">{fallback.title}</h3>
        <p className="mt-1 text-[11px] font-bold text-white/45">{fallback.time}</p>
      </div>
      <div className="text-right">
        <p className="text-[13px] font-black">{fallback.calories}</p>
        <p className="mt-1 text-[11px] font-bold text-white/45">{fallback.place}</p>
      </div>
    </article>
  );
}
