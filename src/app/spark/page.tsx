"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bike,
  ChevronRight,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  MapPin,
  Mountain,
  Navigation,
  Plus,
  Radio,
  Timer,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";

type StartMode = "solo" | "group";

const soloActivities: {
  label: string;
  desc: string;
  icon: LucideIcon;
  metric: string;
  pace: string;
}[] = [
  { label: "러닝", desc: "페이스와 경로 기록", icon: Zap, metric: "3.2km", pace: "5'48\"" },
  { label: "라이딩", desc: "속도와 고도 기록", icon: Bike, metric: "12.4km", pace: "21km/h" },
  { label: "걷기", desc: "걸음수와 활동 시간", icon: Footprints, metric: "4,820보", pace: "38분" },
  { label: "헬스", desc: "루틴과 세트 기록", icon: Dumbbell, metric: "상체", pace: "50분" },
  { label: "등산", desc: "고도와 코스 기록", icon: Mountain, metric: "410m", pace: "1h 20m" },
  { label: "자유 운동", desc: "직접 입력으로 시작", icon: Plus, metric: "커스텀", pace: "직접" },
];

const groupMatches = [
  { title: "퇴근 후 한강 러닝", meta: "727m · 오늘 20:00", fit: "성향 92%", people: "3/6명" },
  { title: "성수 라이트 라이딩", meta: "1.8km · 오늘 19:30", fit: "레벨 적합", people: "8/12명" },
  { title: "초보 헬스 루틴", meta: "1.2km · 내일 07:00", fit: "입문 추천", people: "2/4명" },
];

export default function SparkPage() {
  const [mode, setMode] = useState<StartMode>("solo");
  const [selectedActivity, setSelectedActivity] = useState(soloActivities[0].label);
  const selected = useMemo(
    () => soloActivities.find((activity) => activity.label === selectedActivity) ?? soloActivities[0],
    [selectedActivity],
  );
  const SelectedIcon = selected.icon;

  return (
    <main className="min-h-full space-y-4 pb-4 pt-1 text-white">
      <section className="rounded-[24px] bg-[radial-gradient(circle_at_top_left,#DFFF4C_0%,#DFFF4C_24%,#8E6CEF_64%,#121212_100%)] p-[1px]">
        <div className="rounded-[23px] bg-black/78 p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-spark-lime">Start Spark</p>
              <h1 className="mt-1.5 text-[24px] font-black leading-[1.08]">
                어떤 운동을
                <br />
                시작할까요?
              </h1>
              <p className="mt-2 text-xs font-bold text-white/58">혼자 시작하거나, 근처 모임과 함께 기록해요.</p>
            </div>
            <div className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-spark-lime text-black shadow-[0_0_24px_rgba(223,255,76,0.24)]">
              <Radio size={24} strokeWidth={2.8} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-[18px] bg-white/[0.06] p-1">
            <ModeButton active={mode === "solo"} label="혼자운동" onClick={() => setMode("solo")} />
            <ModeButton active={mode === "group"} label="모임운동" onClick={() => setMode("group")} />
          </div>
        </div>
      </section>

      {mode === "solo" ? (
        <>
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black">운동 선택</h2>
              <Link href={`/spark/solo?activity=${encodeURIComponent(selected.label)}`} className="text-[11px] font-black text-spark-lime">
                전체보기
              </Link>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {soloActivities.map((activity) => {
                const Icon = activity.icon;
                const active = selectedActivity === activity.label;

                return (
                  <button
                    key={activity.label}
                    type="button"
                    onClick={() => setSelectedActivity(activity.label)}
                    className={[
                      "min-h-[86px] rounded-[18px] border p-2.5 text-left transition",
                      active ? "border-spark-lime bg-spark-lime text-black" : "border-white/8 bg-card text-white",
                    ].join(" ")}
                  >
                    <div className={active ? "text-black" : "text-spark-lime"}>
                      <Icon size={19} strokeWidth={2.6} />
                    </div>
                    <p className="mt-2 text-xs font-black">{activity.label}</p>
                    <p className={active ? "mt-0.5 text-[10px] font-bold text-black/58" : "mt-0.5 text-[10px] font-bold text-white/42"}>
                      {activity.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[22px] border border-white/10 bg-card p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black text-spark-lime">LIVE PREVIEW</p>
                <h2 className="mt-1 text-lg font-black">{selected.label} 모드</h2>
                <p className="mt-1 text-xs font-bold text-white/50">{selected.desc}</p>
              </div>
              <div className="grid size-11 shrink-0 place-items-center rounded-[17px] bg-white/8 text-spark-lime">
                <SelectedIcon size={22} strokeWidth={2.7} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <LiveMetric icon={Timer} label="시간" value="00:00" />
              <LiveMetric icon={Navigation} label="기록" value={selected.metric} />
              <LiveMetric icon={HeartPulse} label="페이스" value={selected.pace} />
            </div>

            <Link
              href={`/spark/solo?activity=${encodeURIComponent(selected.label)}`}
              className="mt-3 flex h-11 items-center justify-center rounded-[17px] bg-spark-lime text-[13px] font-black text-black shadow-[0_0_24px_rgba(223,255,76,0.18)]"
            >
              {selected.label} 시작하기
            </Link>
          </section>
        </>
      ) : (
        <>
          <section className="rounded-[22px] border border-white/10 bg-card p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black text-spark-lime">MATCHING</p>
                <h2 className="mt-1 text-lg font-black leading-tight">내 성향과 레벨에 맞는 모임</h2>
                <p className="mt-1 text-xs font-bold text-white/50">근처 모임 중 가장 빠르게 참여 가능한 순서예요.</p>
              </div>
              <div className="grid size-11 shrink-0 place-items-center rounded-[17px] bg-white/8 text-spark-lime">
                <UsersRound size={22} strokeWidth={2.7} />
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {groupMatches.map((group, index) => (
                <Link
                  key={group.title}
                  href="/groups"
                  className="flex items-center gap-2.5 rounded-[18px] bg-white/[0.05] p-2.5"
                >
                  <div className={index === 0 ? "grid size-9 place-items-center rounded-[14px] bg-spark-lime text-black" : "grid size-9 place-items-center rounded-[14px] bg-white/8 text-spark-lime"}>
                    <MapPin size={17} strokeWidth={2.6} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-black">{group.title}</h3>
                    <p className="mt-0.5 text-[10px] font-bold text-white/42">{group.meta}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-black text-spark-lime">{group.fit}</p>
                    <p className="mt-0.5 text-[10px] font-bold text-white/42">{group.people}</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/spark/group"
              className="mt-3 flex h-11 items-center justify-center gap-1 rounded-[17px] bg-spark-lime text-[13px] font-black text-black shadow-[0_0_24px_rgba(223,255,76,0.18)]"
            >
              모임운동 시작하기
              <ChevronRight size={16} strokeWidth={2.8} />
            </Link>
          </section>

          <Link href="/groups" className="flex items-center justify-between rounded-[20px] border border-white/10 bg-card p-3.5">
            <div>
              <p className="text-[10px] font-black text-spark-lime">MAP</p>
              <h2 className="mt-1 text-sm font-black">지도에서 모임 먼저 찾기</h2>
            </div>
            <ChevronRight size={18} className="text-white/40" />
          </Link>
        </>
      )}

      <section className="grid grid-cols-2 gap-2">
        <QuickInfo label="오늘 컨디션" value="좋음" icon={Flame} />
        <QuickInfo label="추천 강도" value="중간" icon={HeartPulse} />
      </section>
    </main>
  );
}

function ModeButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "h-9 rounded-[14px] bg-white text-xs font-black text-black" : "h-9 rounded-[14px] text-xs font-black text-white/62"}
    >
      {label}
    </button>
  );
}

function LiveMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-white/[0.05] p-2.5">
      <Icon size={15} className="text-spark-lime" strokeWidth={2.6} />
      <p className="mt-1.5 text-[10px] font-bold text-white/42">{label}</p>
      <p className="mt-0.5 text-xs font-black">{value}</p>
    </div>
  );
}

function QuickInfo({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-card p-3">
      <div className="grid size-8 place-items-center rounded-[13px] bg-white/8 text-spark-lime">
        <Icon size={16} strokeWidth={2.6} />
      </div>
      <p className="mt-2 text-[10px] font-bold text-white/42">{label}</p>
      <p className="mt-0.5 text-sm font-black">{value}</p>
    </div>
  );
}
