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
import {
  CURRENT_SPARK_LEVEL,
  getSparkLevelName,
  SparkCharacter,
} from "@/components/character/spark-character";

const routines = [
  { label: "축구", icon: Trophy },
  { label: "농구", icon: Activity },
  { label: "요가", icon: Flame },
  { label: "러닝", icon: Footprints },
  { label: "테니스", icon: ShieldCheck },
  { label: "헬스", icon: Dumbbell },
];

const meetupCards = [
  {
    title: "퇴근 후 가볍게 뛰어요",
    tag: "러닝",
    place: "안양천",
    time: "오늘 20:00",
    members: "3/6",
    tone: "from-spark-lime via-[#b8ff5f] to-spark-purple",
  },
  {
    title: "성수 라이트 라이딩",
    tag: "라이딩",
    place: "서울숲 입구",
    time: "오늘 19:30",
    members: "8/12",
    tone: "from-[#2a2a2d] via-spark-purple to-spark-lime",
  },
  {
    title: "헬린이 루틴 같이 해요",
    tag: "헬스",
    place: "00 헬스장",
    time: "내일 07:00",
    members: "2/2",
    tone: "from-spark-lavender via-white to-spark-purple",
  },
];

const logFallbacks = [
  { title: "30분 러닝", time: "오늘 · 6:30 AM", calories: "320 kcal", place: "동네 하천" },
  { title: "1시간 헬스", time: "어제 · 5:45 PM", calories: "450 kcal", place: "헬스장" },
  { title: "20분 사이클", time: "Oct 24 · 10:15 AM", calories: "180 kcal", place: "집" },
];

export default function HomePage() {
  const { ad, adPartner, health, recentLogs, recommendedMeetups } = getHomeDashboardData();

  return (
    <main className="min-h-full bg-background px-3.5 pb-4 pt-4 text-white">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-xl bg-card text-spark-lime ring-1 ring-white/10 shadow-[0_0_20px_rgba(223,255,76,0.16)]">
            <Flame size={16} fill="currentColor" strokeWidth={2.4} />
          </div>
          <p className="text-base font-black">SPARK</p>
        </div>
      </section>

      <section className="mt-5">
        <p className="text-[11px] font-black text-spark-lime">오늘의 SPARK</p>
        <h1 className="mt-1.5 max-w-[270px] text-[24px] font-black leading-[1.08]">
          오늘 운동,
          <br />
          바로 시작해볼까요?
        </h1>
        <p className="mt-2 text-xs font-semibold text-white/58">
          이번 주에 3개의 모임이 예정되어 있어요.
        </p>
      </section>

      <section className="mt-5 overflow-hidden rounded-[20px] bg-spark-lime p-3.5 text-black">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black">꾸준히 운동하고 있어요</p>
            <h2 className="mt-1.5 text-xl font-black leading-none">{health.streakDays || 8}일째 도전 중</h2>
            <p className="mt-1.5 text-[11px] font-bold text-black/62">오늘 루틴도 거의 완료했어요.</p>
          </div>
          <div className="relative flex w-[78px] shrink-0 flex-col items-center">
            <SparkCharacter level={CURRENT_SPARK_LEVEL} size={70} priority />
            <span className="-mt-1 rounded-full bg-black px-2 py-1 text-[9px] font-black text-spark-lime">
              {getSparkLevelName(CURRENT_SPARK_LEVEL)}
            </span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <MiniStat label="총 운동" value="85회" dark={false} />
          <MiniStat label="오늘 루틴" value={`${health.routineProgress}%`} dark />
        </div>
      </section>

      <Link
        href="/spark"
        className="mt-3 flex h-11 items-center justify-center rounded-full bg-white text-xs font-black tracking-[0.02em] text-[#070707] shadow-[0_0_24px_rgba(255,255,255,0.1)]"
      >
        지금 운동 시작하기
      </Link>

      <SectionHeader title="자주하는 운동 루틴" action="직접입력" href="/spark/solo" />
      <div className="scrollbar-none -mx-3.5 mt-2.5 flex gap-2.5 overflow-x-auto px-3.5 pb-1.5">
        {routines.map((routine) => {
          const Icon = routine.icon;
          return (
            <Link key={routine.label} href="/spark/solo" className="w-14 shrink-0 text-center">
              <div className="grid size-12 place-items-center rounded-[16px] border border-white/10 bg-card text-spark-lime">
                <Icon size={20} strokeWidth={2.4} />
              </div>
              <p className="mt-1.5 text-[10px] font-black text-white/78">{routine.label}</p>
            </Link>
          );
        })}
      </div>

      <SectionHeader title="추천 번개" action="전체보기" href="/groups" />
      <div className="scrollbar-none -mx-3.5 mt-2.5 flex gap-2.5 overflow-x-auto px-3.5 pb-1.5">
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

      <section className="mt-5 grid grid-cols-2 gap-2.5">
        <ActionCard href="/groups/new" icon={Plus} title="번개 만들기" body="운동 모임을 열어볼까요?" />
        <ActionCard href="/groups" icon={Search} title="주변 번개 찾기" body="가까운 운동 모임 참여" />
      </section>

      <section className="mt-5 rounded-[20px] bg-card p-3.5 ring-1 ring-white/10">
        <h2 className="text-xs font-black">오늘 운동 현황</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <HealthMetric value={`${(health.steps / 1000).toFixed(1)}k`} label="걸음 수" icon={Footprints} />
          <HealthMetric value={`${health.calories}`} label="kcal" icon={Flame} />
          <HealthMetric value={`${health.activeMinutes}m`} label="활동 시간" icon={Timer} />
        </div>
      </section>

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black">이전 운동 기록</h2>
          <Link href="/profile" className="text-[11px] font-black text-spark-lime">
            전체보기
          </Link>
        </div>
        <div className="mt-2.5 space-y-2.5">
          {logFallbacks.map((fallback, index) => (
            <WorkoutLogCard key={fallback.title} fallback={fallback} log={recentLogs[index]} />
          ))}
        </div>
      </section>

      {ad && (
        <section className="mt-5 rounded-[20px] bg-gradient-to-br from-spark-lavender to-spark-purple p-[1px]">
          <div className="rounded-[19px] bg-black/78 p-3.5 text-white">
            <p className="text-[11px] font-black text-spark-lime">{adPartner?.name ?? "파트너 광고"}</p>
            <h2 className="mt-1.5 text-lg font-black">{ad.title || "운동 후 리커버리 혜택"}</h2>
            <p className="mt-1.5 text-xs font-bold text-white/68">{ad.description}</p>
            <Link href="/groups" className="mt-3 inline-flex rounded-full bg-spark-lime px-3.5 py-2 text-[11px] font-black text-black">
              살펴보기
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function MiniStat({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  return (
    <div className={`rounded-[16px] p-2.5 ${dark ? "bg-black text-white" : "bg-black/10"}`}>
      <p className={`text-[11px] font-black ${dark ? "text-white/55" : "text-black/55"}`}>{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function SectionHeader({ title, action, href }: { title: string; action: string; href: string }) {
  return (
    <div className="mt-5 flex items-center justify-between">
      <h2 className="text-base font-black">{title}</h2>
      <Link href={href} className="text-[11px] font-black text-spark-lime">
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
    <Link href={`/groups/${meetup.id}`} className="w-[210px] shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-card">
      <div className={`relative h-24 bg-gradient-to-br ${meetup.tone}`}>
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black px-2 py-0.5 text-[10px] font-black text-white">
          {meetup.tag}
        </span>
      </div>
      <div className="p-3">
        <h3 className="truncate text-xs font-black">{meetup.title}</h3>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-white/58">
          <MapPin size={12} />
          {meetup.place}
        </p>
        <div className="mt-2.5 flex items-center justify-between text-[10px] font-black text-white/48">
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
  icon: typeof Search;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="rounded-[18px] border border-white/10 bg-card p-3">
      <div className="grid size-8 place-items-center rounded-[14px] bg-spark-lime text-black">
        <Icon size={16} strokeWidth={2.7} />
      </div>
      <p className="mt-2.5 text-xs font-black">{title}</p>
      <p className="mt-1 text-[11px] font-bold text-white/48">{body}</p>
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
    <div className="rounded-[16px] bg-white/5 p-2 text-center">
      <div className="mx-auto grid size-8 place-items-center rounded-full bg-black text-spark-lime">
        <Icon size={15} strokeWidth={2.5} />
      </div>
      <p className="mt-1.5 text-xs font-black">{value}</p>
      <p className="text-[10px] font-bold text-white/45">{label}</p>
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
    <article className="flex items-center gap-2.5 rounded-[18px] border border-white/10 bg-card p-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-[14px] bg-white/8 text-spark-lime">
        {log?.activityType === "riding" ? <Bike size={18} /> : <Footprints size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-xs font-black">{fallback.title}</h3>
        <p className="mt-1 text-[10px] font-bold text-white/45">{fallback.time}</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-black">{fallback.calories}</p>
        <p className="mt-1 text-[10px] font-bold text-white/45">{fallback.place}</p>
      </div>
    </article>
  );
}
