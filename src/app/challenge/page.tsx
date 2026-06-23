"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  Flame,
  Gift,
  Grid2X2,
  List,
  MapPin,
  Medal,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type ChallengeCategory = "전체" | "운동" | "모임" | "이벤트";
type ViewMode = "list" | "grid";

type ChallengeItem = {
  id: string;
  category: Exclude<ChallengeCategory, "전체">;
  title: string;
  status: string;
  reward: string;
  progress: number;
  progressLabel: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  rule?: string;
};

const categories: ChallengeCategory[] = ["전체", "운동", "모임", "이벤트"];

const challengeItems: ChallengeItem[] = [
  {
    id: "running-30",
    category: "운동",
    title: "30일 러닝 챌린지",
    status: "완료",
    reward: "25 xp",
    progress: 100,
    progressLabel: "30/30일",
    description: "운동 시작 후 1분을 초과하고 칼로리 기록이 있어야 1일 운동으로 인정돼요.",
    icon: Trophy,
    accent: "text-spark-lime",
    rule: "운동 시작 버튼을 누른 뒤 1분을 초과하고 소모 칼로리가 있어야 1일 운동으로 인정돼요.",
  },
  {
    id: "weekly-4",
    category: "운동",
    title: "주4일 운동하기",
    status: "진행중",
    reward: "18 xp",
    progress: 75,
    progressLabel: "3/4회",
    description: "이번 주에 4번 이상 운동하면 주간 루틴 배지를 받을 수 있어요.",
    icon: Dumbbell,
    accent: "text-spark-purple",
  },
  {
    id: "group-2",
    category: "모임",
    title: "이번 주 모임 2회 참여",
    status: "진행중",
    reward: "모임 신뢰도 +2",
    progress: 50,
    progressLabel: "1/2회",
    description: "근처 모임에 참여하고 함께 운동한 기록을 남겨보세요.",
    icon: Users,
    accent: "text-[#F3EFFF]",
  },
  {
    id: "friend-rank",
    category: "모임",
    title: "친구 랭킹 TOP 10",
    status: "도전중",
    reward: "랭킹 배지",
    progress: 64,
    progressLabel: "현재 12위",
    description: "친구들과 누적 운동 시간으로 경쟁하는 가벼운 랭킹 챌린지예요.",
    icon: Medal,
    accent: "text-spark-lime",
  },
  {
    id: "hangang-event",
    category: "이벤트",
    title: "5km 한강 달리고 오! 소리 나게 선물 받자",
    status: "참여 가능",
    reward: "경험치 5배",
    progress: 20,
    progressLabel: "7월 예정",
    description: "반포한강공원 달빛광장에서 열리는 SPARK 이벤트 챌린지예요.",
    icon: Gift,
    accent: "text-spark-purple",
  },
];

const eventRewards = [
  { label: "1등 선물 (3명)", value: "신세계 상품권 5만원권" },
  { label: "2등 선물 (10명)", value: "신세계 상품권 5천원권" },
  { label: "참여자 전원", value: "앱 내 경험치 5배 지급" },
];

export default function ChallengePage() {
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory>("전체");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedRule, setSelectedRule] = useState<ChallengeItem | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeCategory === "전체") {
      return challengeItems;
    }

    return challengeItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const completedCount = challengeItems.filter((item) => item.status === "완료").length;
  const averageProgress = Math.round(
    challengeItems.reduce((sum, item) => sum + item.progress, 0) / challengeItems.length,
  );

  return (
    <main className="min-h-full px-4 pb-5 pt-4 text-white">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-spark-lime">Challenge</p>
          <h1 className="mt-1 text-[28px] font-black leading-tight">챌린지</h1>
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white"
          aria-label={viewMode === "list" ? "그리드 보기" : "리스트 보기"}
          onClick={() => setViewMode((mode) => (mode === "list" ? "grid" : "list"))}
        >
          {viewMode === "list" ? <Grid2X2 size={18} /> : <List size={18} />}
        </button>
      </header>

      <section className="mt-4 overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_top_left,#DFFF4C_0%,#DFFF4C_26%,#8E6CEF_62%,#1C1C1E_100%)] p-[1px]">
        <div className="rounded-[25px] bg-black/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white/55">오늘도</p>
              <h2 className="mt-1 text-[26px] font-black leading-[1.08]">
                챌린지
                <br />
                진행중!
              </h2>
            </div>
            <div
              className="grid size-[92px] place-items-center rounded-full"
              style={{
                background: `conic-gradient(#DFFF4C 0 ${averageProgress}%, rgba(255,255,255,0.11) ${averageProgress}% 100%)`,
              }}
            >
              <div className="grid size-[68px] place-items-center rounded-full bg-[#121212] text-center">
                <span className="text-[22px] font-black text-spark-lime">{averageProgress}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <SummaryTile label="달성도" value={`${completedCount}/${challengeItems.length}`} />
            <SummaryTile label="진행중" value="3개" />
            <SummaryTile label="획득 XP" value="125" />
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`h-9 shrink-0 rounded-full px-4 text-sm font-black transition ${
                activeCategory === category
                  ? "bg-spark-lime text-black"
                  : "border border-white/10 bg-white/[0.06] text-white/70"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4">
        {viewMode === "list" ? (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <ChallengeCard key={item.id} item={item} onOpenRule={() => setSelectedRule(item)} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <ChallengeBadge key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {(activeCategory === "전체" || activeCategory === "이벤트") && (
        <section className="mt-5 rounded-[26px] border border-white/10 bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-spark-purple">Event</p>
              <h2 className="mt-2 text-[22px] font-black leading-tight">
                5km 한강 달리고
                <br />
                오! 소리 나게 선물 받자
              </h2>
              <p className="mt-2 text-sm leading-5 text-white/55">
                스파크와 함께 건강도, 선물도 모두 챙겨가세요.
              </p>
            </div>
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-spark-lime text-black">
              <Flame size={24} />
            </div>
          </div>

          <div className="mt-4 space-y-2 rounded-2xl bg-white/[0.06] p-3 text-sm text-white/70">
            <EventInfo icon={CalendarDays} label="일시" value="2026. 7. OO" />
            <EventInfo icon={MapPin} label="장소" value="반포한강공원 달빛광장" />
            <p className="pt-1 text-xs leading-5 text-white/45">러닝 코스는 이벤트 상세 안내에서 확인할 수 있어요.</p>
          </div>

          <div className="mt-3 grid gap-2">
            {eventRewards.map((reward) => (
              <div key={reward.label} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-3 py-3">
                <p className="text-xs font-bold text-white/45">{reward.label}</p>
                <p className="text-sm font-black text-white">{reward.value}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsJoined(true)}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-spark-purple text-sm font-black text-white shadow-[0_0_22px_rgba(142,108,239,0.35)]"
          >
            참여하기
          </button>
        </section>
      )}

      {selectedRule && (
        <Modal onClose={() => setSelectedRule(null)}>
          <div className="flex items-start justify-between gap-4">
            <div className="grid size-12 place-items-center rounded-2xl bg-spark-lime text-black">
              <Trophy size={24} />
            </div>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full bg-white/10 text-white/70"
              onClick={() => setSelectedRule(null)}
              aria-label="닫기"
            >
              <X size={18} />
            </button>
          </div>
          <h3 className="mt-4 text-xl font-black">{selectedRule.title}</h3>
          <p className="mt-2 text-sm font-bold text-spark-lime">{selectedRule.status}</p>
          <div className="mt-4 rounded-2xl bg-white/[0.06] p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">보상</span>
              <span className="font-black">{selectedRule.reward}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-white/50">달성률</span>
              <span className="font-black">{selectedRule.progress}%</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/65">{selectedRule.rule ?? selectedRule.description}</p>
        </Modal>
      )}

      {isJoined && (
        <Modal onClose={() => setIsJoined(false)}>
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-spark-lime text-black">
            <CheckCircle2 size={30} />
          </div>
          <h3 className="mt-4 text-center text-xl font-black">이벤트 참여완료!</h3>
          <button
            type="button"
            onClick={() => setIsJoined(false)}
            className="mt-5 h-11 w-full rounded-2xl bg-spark-lime text-sm font-black text-black"
          >
            확인
          </button>
        </Modal>
      )}
    </main>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.08] px-3 py-3">
      <p className="text-[11px] font-bold text-white/45">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function ChallengeCard({ item, onOpenRule }: { item: ChallengeItem; onOpenRule: () => void }) {
  const Icon = item.icon;

  return (
    <article className="rounded-[24px] border border-white/10 bg-card p-4">
      <div className="flex items-start gap-3">
        <div className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[0.06] ${item.accent}`}>
          <Icon size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-black text-white/70">{item.category}</span>
            <span className="text-[11px] font-black text-spark-lime">{item.status}</span>
          </div>
          <h2 className="mt-2 text-lg font-black leading-tight">{item.title}</h2>
          <p className="mt-1 text-xs leading-5 text-white/50">{item.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="font-bold text-white/45">보상 : {item.reward}</span>
        <span className="font-black text-white">{item.progressLabel}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-spark-lime" style={{ width: `${item.progress}%` }} />
      </div>

      {item.rule && (
        <button type="button" onClick={onOpenRule} className="mt-3 text-xs font-black text-spark-purple">
          챌린지 규칙 보기
        </button>
      )}
    </article>
  );
}

function ChallengeBadge({ item }: { item: ChallengeItem }) {
  const Icon = item.icon;

  return (
    <article className="min-h-[148px] rounded-[24px] border border-white/10 bg-card p-4">
      <div className={`grid size-11 place-items-center rounded-2xl bg-white/[0.06] ${item.accent}`}>
        <Icon size={22} />
      </div>
      <h2 className="mt-3 line-clamp-2 text-sm font-black leading-5">{item.title}</h2>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="font-bold text-white/45">{item.status}</span>
        <span className="font-black text-spark-lime">{item.progress}%</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-spark-purple" style={{ width: `${item.progress}%` }} />
      </div>
    </article>
  );
}

function EventInfo({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-spark-lime" />
      <span className="w-8 text-xs font-black text-white/45">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-6">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="닫기" onClick={onClose} />
      <section className="relative w-full max-w-[320px] rounded-[28px] border border-white/10 bg-[#1C1C1E] p-5 shadow-2xl">
        {children}
      </section>
    </div>
  );
}
