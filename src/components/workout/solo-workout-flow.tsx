"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Bike, ChevronRight, Dumbbell, Flame, Footprints,
  HeartPulse, LocateFixed, Lock, MapPin, Mountain, Pause, Play, Plus,
  RotateCcw, Route, Save, Timer, Trophy, X, Zap, type LucideIcon,
} from "lucide-react";
import {
  SparkCharacter,
} from "@/components/character/spark-character";

type Stage = "setup" | "countdown" | "active" | "paused" | "finish" | "summary";
type ActivityId = "running" | "riding" | "walking" | "fitness" | "hiking" | "free";
type Activity = {
  id: ActivityId;
  label: string;
  icon: LucideIcon;
  unit: string;
  goalLabel: string;
  goals: string[];
  speedLabel: string;
};

const activities: Activity[] = [
  { id: "running", label: "러닝", icon: Zap, unit: "km", goalLabel: "거리 목표", goals: ["목표 없음", "3km", "5km", "10km"], speedLabel: "평균 페이스" },
  { id: "riding", label: "라이딩", icon: Bike, unit: "km", goalLabel: "거리 목표", goals: ["목표 없음", "10km", "20km", "30km"], speedLabel: "평균 속도" },
  { id: "walking", label: "걷기", icon: Footprints, unit: "km", goalLabel: "시간 목표", goals: ["목표 없음", "30분", "45분", "60분"], speedLabel: "평균 페이스" },
  { id: "fitness", label: "헬스", icon: Dumbbell, unit: "세트", goalLabel: "시간 목표", goals: ["목표 없음", "30분", "45분", "60분"], speedLabel: "운동 강도" },
  { id: "hiking", label: "등산", icon: Mountain, unit: "km", goalLabel: "고도 목표", goals: ["목표 없음", "300m", "500m", "800m"], speedLabel: "누적 고도" },
  { id: "free", label: "자유 운동", icon: Plus, unit: "분", goalLabel: "시간 목표", goals: ["목표 없음", "20분", "30분", "60분"], speedLabel: "운동 강도" },
];

const aliases: Record<string, ActivityId> = {
  러닝: "running", 라이딩: "riding", 걷기: "walking",
  헬스: "fitness", 등산: "hiking", "자유 운동": "free",
};

export function SoloWorkoutFlow({ initialActivity }: { initialActivity?: string }) {
  const [stage, setStage] = useState<Stage>("setup");
  const [activityId, setActivityId] = useState<ActivityId>(
    initialActivity ? aliases[initialActivity] ?? "running" : "running",
  );
  const [goal, setGoal] = useState("목표 없음");
  const [countdown, setCountdown] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [voiceGuide, setVoiceGuide] = useState(true);
  const [saved, setSaved] = useState(false);
  const activity = useMemo(() => activities.find((item) => item.id === activityId) ?? activities[0], [activityId]);

  useEffect(() => {
    if (stage !== "countdown") return;
    const timer = window.setTimeout(() => {
      setCountdown((value) => {
        if (value <= 1) {
          setStage("active");
          return 0;
        }
        return value - 1;
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [countdown, stage]);

  useEffect(() => {
    if (stage !== "active") return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  if (stage === "countdown") {
    return <Countdown activity={activity} count={countdown} onCancel={() => setStage("setup")} />;
  }

  if (stage === "active" || stage === "paused" || stage === "finish") {
    return (
      <LiveWorkout
        activity={activity}
        seconds={seconds}
        paused={stage === "paused" || stage === "finish"}
        finishOpen={stage === "finish"}
        onPause={() => setStage("paused")}
        onResume={() => setStage("active")}
        onFinish={() => setStage("finish")}
        onCancelFinish={() => setStage("paused")}
        onConfirmFinish={() => setStage("summary")}
      />
    );
  }

  if (stage === "summary") {
    return (
      <WorkoutSummary
        activity={activity}
        seconds={seconds}
        saved={saved}
        onSave={() => setSaved(true)}
        onReset={() => {
          setSeconds(0);
          setSaved(false);
          setStage("setup");
        }}
      />
    );
  }

  const ActivityIcon = activity.icon;
  return (
    <main className="space-y-4 pb-4 pt-1 text-white">
      <div className="flex items-center justify-between">
        <Link href="/spark" className="grid size-9 place-items-center rounded-full bg-white/8" aria-label="운동 시작 화면으로 돌아가기">
          <ArrowLeft size={18} />
        </Link>
        <p className="text-sm font-black">혼자 운동</p>
        <button type="button" className="grid size-9 place-items-center rounded-full bg-white/8" aria-label="위치 설정"><LocateFixed size={17} /></button>
      </div>

      <section className="rounded-[24px] border border-white/10 bg-card p-3.5">
        <p className="text-[10px] font-black text-spark-lime">ACTIVITY</p>
        <h1 className="mt-1 text-[22px] font-black">오늘 어떤 운동을 할까요?</h1>
        <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">
          {activities.map((item) => {
            const Icon = item.icon;
            const active = item.id === activityId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActivityId(item.id);
                  setGoal("목표 없음");
                }}
                className={`flex h-[74px] w-[72px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[18px] border text-[11px] font-black transition ${active ? "border-spark-lime bg-spark-lime text-black" : "border-white/8 bg-white/[0.04] text-white"}`}
              >
                <Icon size={20} strokeWidth={2.6} />
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-white/10 bg-card">
        <div className="relative h-[174px] overflow-hidden bg-[#171719]">
          <MapPattern />
          <div className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-spark-lime text-black shadow-[0_0_30px_rgba(223,255,76,0.35)]">
            <ActivityIcon size={22} strokeWidth={2.8} />
          </div>
          <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-black">
            <MapPin size={12} className="mr-1 inline text-spark-lime" />안양천, 내 위치에서 시작
          </div>
        </div>

        <div className="divide-y divide-white/8 px-3.5">
          <SettingRow icon={Trophy} label={activity.goalLabel} value={goal} onClick={() => setGoalsOpen((value) => !value)} />
          {goalsOpen && (
            <div className="scrollbar-none flex gap-1.5 overflow-x-auto py-3">
              {activity.goals.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setGoal(option);
                    setGoalsOpen(false);
                  }}
                  className={goal === option ? "shrink-0 rounded-full bg-spark-lime px-3 py-2 text-[11px] font-black text-black" : "shrink-0 rounded-full bg-white/8 px-3 py-2 text-[11px] font-black text-white"}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          <div className="flex min-h-14 items-center gap-3">
            <div className="grid size-8 place-items-center rounded-[12px] bg-white/8 text-spark-lime"><HeartPulse size={16} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black">음성 가이드</p>
              <p className="mt-0.5 text-[10px] font-bold text-white/42">1km마다 기록 안내</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={voiceGuide}
              onClick={() => setVoiceGuide((value) => !value)}
              className={voiceGuide ? "relative h-7 w-12 rounded-full bg-spark-lime" : "relative h-7 w-12 rounded-full bg-white/12"}
            >
              <span className={`absolute top-1 size-5 rounded-full bg-black transition ${voiceGuide ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>
      </section>

      <section className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.04] px-3 py-2">
        <SparkCharacter level={1} state="default" size={58} />
        <div>
          <p className="text-xs font-black">꼬마 불씨가 준비됐어요</p>
          <p className="mt-1 text-[10px] font-bold text-white/42">안전하게 몸을 풀고 함께 출발해요.</p>
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          setCountdown(3);
          setSeconds(0);
          setStage("countdown");
        }}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-[19px] bg-spark-lime text-sm font-black text-black shadow-[0_0_28px_rgba(223,255,76,0.2)]"
      >
        <Play size={19} fill="currentColor" />{activity.label} 시작하기
      </button>
      <p className="text-center text-[10px] font-bold text-white/35">시작하면 위치와 건강 데이터가 운동 기록에 사용됩니다.</p>
    </main>
  );
}

function Countdown({ activity, count, onCancel }: { activity: Activity; count: number; onCancel: () => void }) {
  return (
    <main className="flex min-h-full flex-col items-center justify-center pb-24 text-white">
      <div className="grid size-28 place-items-center rounded-[32px] bg-spark-lime/10 shadow-[0_0_42px_rgba(223,255,76,0.2)]">
        <SparkCharacter level={1} state="workout" size={108} priority />
      </div>
      <p className="mt-6 text-sm font-black text-white/55">{activity.label} 준비</p>
      <p className="mt-2 text-[84px] font-black leading-none text-spark-lime">{count || "GO"}</p>
      <p className="mt-4 text-xs font-bold text-white/40">안전하게 주변을 확인하세요.</p>
      <button type="button" onClick={onCancel} className="mt-10 rounded-full bg-white/10 px-6 py-3 text-xs font-black">취소</button>
    </main>
  );
}

function LiveWorkout({
  activity, seconds, paused, finishOpen, onPause, onResume, onFinish, onCancelFinish, onConfirmFinish,
}: {
  activity: Activity;
  seconds: number;
  paused: boolean;
  finishOpen: boolean;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onCancelFinish: () => void;
  onConfirmFinish: () => void;
}) {
  const metrics = workoutMetrics(activity, seconds);
  return (
    <main className="relative -mx-4 min-h-full overflow-hidden bg-[#111113] text-white">
      <div className="relative h-[42%] min-h-[290px] overflow-hidden">
        <MapPattern active />
        <div className="absolute left-[22%] top-[54%] h-2 w-[42%] rotate-[-18deg] rounded-full bg-spark-lime shadow-[0_0_14px_rgba(223,255,76,0.6)]" />
        <div className="absolute left-[58%] top-[43%] size-4 rounded-full border-4 border-white bg-spark-lime shadow-xl" />
        <div className="absolute left-4 top-5 rounded-full bg-black/75 px-3 py-2 text-[11px] font-black">
          <span className={`mr-1.5 inline-block size-2 rounded-full ${paused ? "bg-white/40" : "animate-pulse bg-spark-lime"}`} />{paused ? "일시정지" : "기록 중"}
        </div>
        <button type="button" className="absolute right-4 top-5 grid size-9 place-items-center rounded-full bg-black/75" aria-label="현재 위치로 이동"><LocateFixed size={17} /></button>
      </div>

      <section className="relative -mt-6 min-h-[430px] rounded-t-[28px] bg-[#1C1C1E] px-4 pb-28 pt-5">
        <div className="text-center">
          <p className="text-[11px] font-black text-white/42">{activity.label} 시간</p>
          <p className="mt-1 text-[48px] font-black leading-none tracking-normal">{formatTime(seconds)}</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <MetricCard label={activity.unit === "세트" ? "완료 세트" : "거리"} value={metrics.distance} unit={activity.unit} />
          <MetricCard label={activity.speedLabel} value={metrics.pace} unit={metrics.paceUnit} />
          <MetricCard label="칼로리" value={metrics.calories} unit="kcal" />
          <MetricCard label="심박수" value={metrics.heartRate} unit="bpm" />
        </div>
        {paused && (
          <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.04] px-3 py-2">
            <SparkCharacter level={1} state="paused" size={62} />
            <div>
              <p className="text-xs font-black">잠깐 숨을 고르는 중</p>
              <p className="mt-0.5 text-[10px] font-bold text-white/42">물을 마시고 준비되면 다시 시작해요.</p>
            </div>
          </div>
        )}
        <div className="mt-5 flex items-center justify-center gap-5">
          <button type="button" onClick={onFinish} className="flex size-14 flex-col items-center justify-center rounded-full bg-white/10 text-[9px] font-black"><span className="mb-1 size-3 rounded-[3px] bg-white" />종료</button>
          <button type="button" onClick={paused ? onResume : onPause} className="grid size-20 place-items-center rounded-full bg-spark-lime text-black shadow-[0_0_30px_rgba(223,255,76,0.24)]" aria-label={paused ? "운동 재개" : "운동 일시정지"}>
            {paused ? <Play size={30} fill="currentColor" /> : <Pause size={30} fill="currentColor" />}
          </button>
          <div className="flex size-14 flex-col items-center justify-center rounded-full bg-white/10 text-[9px] font-black text-white/55"><Lock size={15} className="mb-1" />잠금</div>
        </div>
      </section>

      {finishOpen && (
        <div className="absolute inset-0 z-40 flex items-end bg-black/72 p-3">
          <div className="w-full rounded-[24px] border border-white/10 bg-card p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black">운동을 종료할까요?</h2>
              <button type="button" onClick={onCancelFinish} className="grid size-8 place-items-center rounded-full bg-white/8" aria-label="종료 확인 닫기"><X size={16} /></button>
            </div>
            <p className="mt-2 text-xs font-bold text-white/48">지금까지의 운동 기록을 저장하고 결과를 확인합니다.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={onCancelFinish} className="h-11 rounded-[16px] bg-white/8 text-xs font-black">계속 운동</button>
              <button type="button" onClick={onConfirmFinish} className="h-11 rounded-[16px] bg-spark-lime text-xs font-black text-black">운동 종료</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function WorkoutSummary({ activity, seconds, saved, onSave, onReset }: {
  activity: Activity;
  seconds: number;
  saved: boolean;
  onSave: () => void;
  onReset: () => void;
}) {
  const metrics = workoutMetrics(activity, seconds);
  return (
    <main className="space-y-4 pb-4 pt-1 text-white">
      <section className="rounded-[24px] bg-spark-lime p-4 text-black">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black">WORKOUT COMPLETE</p>
            <h1 className="mt-1 text-[24px] font-black">오늘의 SPARK 완료!</h1>
            <p className="mt-1 text-xs font-bold text-black/58">{activity.label} 기록이 완성됐어요.</p>
          </div>
          <div className="grid size-[76px] shrink-0 place-items-center">
            <SparkCharacter level={1} state="complete" size={76} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-white/10 bg-card">
        <div className="relative h-[170px] overflow-hidden">
          <MapPattern active />
          <div className="absolute left-[22%] top-[54%] h-2 w-[42%] rotate-[-18deg] rounded-full bg-spark-lime" />
          <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-black">안양천 운동 경로</div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/8">
          <SummaryMetric icon={Timer} label="운동 시간" value={formatTime(seconds)} />
          <SummaryMetric icon={Route} label="거리" value={`${metrics.distance} ${activity.unit}`} />
          <SummaryMetric icon={Flame} label="소모 칼로리" value={`${metrics.calories} kcal`} />
          <SummaryMetric icon={HeartPulse} label="평균 심박수" value={`${metrics.heartRate} bpm`} />
        </div>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-card p-3.5">
        <p className="text-xs font-black">운동 메모</p>
        <textarea rows={3} placeholder="오늘 운동은 어땠나요?" className="mt-2 w-full resize-none rounded-[16px] bg-white/[0.05] p-3 text-xs font-bold text-white outline-none placeholder:text-white/30" />
      </section>
      {saved ? (
        <div className="rounded-[18px] border border-spark-lime/30 bg-spark-lime/10 p-3 text-center text-xs font-black text-spark-lime">운동 기록이 마이페이지에 저장됐어요.</div>
      ) : (
        <button type="button" onClick={onSave} className="flex h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-spark-lime text-sm font-black text-black"><Save size={17} />운동 기록 저장</button>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onReset} className="flex h-11 items-center justify-center gap-1.5 rounded-[16px] bg-white/8 text-xs font-black"><RotateCcw size={15} />다시 운동</button>
        <Link href="/home" className="flex h-11 items-center justify-center gap-1 rounded-[16px] bg-white text-xs font-black text-black">홈으로<ChevronRight size={15} /></Link>
      </div>
    </main>
  );
}

function SettingRow({ icon: Icon, label, value, onClick }: { icon: LucideIcon; label: string; value: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-14 w-full items-center gap-3 text-left">
      <div className="grid size-8 place-items-center rounded-[12px] bg-white/8 text-spark-lime"><Icon size={16} /></div>
      <div className="min-w-0 flex-1"><p className="text-xs font-black">{label}</p><p className="mt-0.5 text-[10px] font-bold text-white/42">{value}</p></div>
      <ChevronRight size={16} className="text-white/28" />
    </button>
  );
}

function MapPattern({ active = false }: { active?: boolean }) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_50%,rgba(223,255,76,0.14),transparent_24%),linear-gradient(145deg,#161618,#242229)]">
      <div className="absolute left-[-20%] top-[40%] h-px w-[150%] rotate-[-18deg] bg-white/12" />
      <div className="absolute left-[-10%] top-[65%] h-[2px] w-[130%] rotate-[12deg] bg-white/8" />
      <div className="absolute left-[27%] top-[-20%] h-[140%] w-px rotate-[14deg] bg-white/10" />
      <div className="absolute right-[19%] top-[-20%] h-[140%] w-px rotate-[-12deg] bg-white/8" />
      {active && <div className="absolute right-4 top-4 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-black text-white/60">GPS 양호</div>}
    </div>
  );
}

function MetricCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return <div className="rounded-[18px] bg-white/[0.05] p-3"><p className="text-[10px] font-black text-white/40">{label}</p><p className="mt-1 text-[24px] font-black leading-none">{value} <span className="text-[10px] text-white/42">{unit}</span></p></div>;
}

function SummaryMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="bg-card p-3.5"><Icon size={16} className="text-spark-lime" /><p className="mt-2 text-[10px] font-bold text-white/42">{label}</p><p className="mt-0.5 text-sm font-black">{value}</p></div>;
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return [hours, minutes, rest].map((value) => String(value).padStart(2, "0")).join(":");
}

function workoutMetrics(activity: Activity, seconds: number) {
  const minutes = seconds / 60;
  const rate = activity.id === "riding" ? 0.32 : activity.id === "walking" ? 0.075 : activity.id === "hiking" ? 0.06 : 0.16;
  const distance = activity.id === "fitness"
    ? String(Math.max(1, Math.floor(minutes / 3) + 1))
    : activity.id === "free"
      ? String(Math.max(1, Math.ceil(minutes)))
      : Math.max(0.01, minutes * rate).toFixed(2);
  return {
    distance,
    pace: activity.id === "riding" ? "19.2" : activity.id === "fitness" || activity.id === "free" ? "중간" : activity.id === "hiking" ? String(Math.max(4, Math.round(minutes * 7))) : "6'12\"",
    paceUnit: activity.id === "riding" ? "km/h" : activity.id === "fitness" || activity.id === "free" ? "" : activity.id === "hiking" ? "m" : "/km",
    calories: String(Math.max(3, Math.round(minutes * (activity.id === "riding" ? 8 : 10)))),
    heartRate: String(118 + Math.min(36, Math.floor(seconds / 12))),
  };
}
