import {
  Bell,
  CalendarCheck,
  ChevronRight,
  Edit3,
  Flame,
  HeartPulse,
  Medal,
  Settings,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { activityLogs, meetups } from "@/shared/data/mock-data";

const stats = [
  { label: "운동 기록", value: `${activityLogs.length + 12}개` },
  { label: "참여 모임", value: `${meetups.length}개` },
  { label: "획득 배지", value: "8개" },
  { label: "친구", value: "24명" },
];

const workoutFeeds = [
  { title: "아침 러닝", meta: "오늘 06:32", value: "3.2km", sub: "24분 · 312kcal", tone: "lime" },
  { title: "퇴근 후 걷기", meta: "어제 20:10", value: "4,820보", sub: "38분 · 146kcal", tone: "purple" },
  { title: "상체 루틴", meta: "6월 21일", value: "50분", sub: "벤치 · 로우 · 숄더", tone: "dark" },
];

const joinedGroups = [
  { title: "퇴근 후 한강 러닝", time: "오늘 20:00", status: "참여 예정", count: "8/12명" },
  { title: "성수 라이트 라이딩", time: "토요일 09:30", status: "승인 완료", count: "5/8명" },
];

const badges = [
  { label: "7일 연속", icon: Flame },
  { label: "첫 모임", icon: UsersRound },
  { label: "5K 완주", icon: Medal },
  { label: "신뢰 호스트", icon: ShieldCheck },
];

const friends = ["강민", "서연", "지후"];

const menuItems = [
  { label: "프로필 편집", desc: "닉네임, 관심 운동, 운동 성향", icon: Edit3 },
  { label: "알림 설정", desc: "모임, 챌린지, 운동 리마인드", icon: Bell },
  { label: "참여 모임 관리", desc: "신청 내역과 취소 관리", icon: CalendarCheck },
  { label: "앱 설정", desc: "위치, 건강 데이터, 계정", icon: Settings },
];

export default function ProfilePage() {
  return (
    <main className="space-y-4 pb-4 pt-1">
      <section className="rounded-[24px] bg-gradient-to-br from-spark-lime via-spark-lavender to-spark-purple p-[1px] text-black">
        <div className="rounded-[23px] bg-[linear-gradient(135deg,#dfff4c_0%,#f3effe_54%,#8e6ecf_100%)] p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-black text-base font-black text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
                SP
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-black/55">MY SPARK</p>
                <h2 className="mt-0.5 truncate text-xl font-black leading-tight">스파커 님</h2>
                <p className="mt-1 text-[11px] font-bold text-black/58">러닝 · 걷기 · 헬스</p>
              </div>
            </div>
            <button className="rounded-full bg-black px-3 py-2 text-[11px] font-black text-white">편집</button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniMetric label="레벨" value="LV.15" />
            <MiniMetric label="도전" value="18일째" />
            <MiniMetric label="신뢰도" value="92%" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-2">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[18px] border border-white/8 bg-card p-2.5">
            <p className="text-[10px] font-bold text-white/42">{item.label}</p>
            <p className="mt-1 text-sm font-black">{item.value}</p>
          </div>
        ))}
      </section>

      <section>
        <SectionTitle title="최근 운동 기록" action="전체보기" />
        <div className="mt-2.5 space-y-2">
          {workoutFeeds.map((feed) => (
            <article key={feed.title} className="flex items-center justify-between rounded-[20px] border border-white/8 bg-card p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={[
                    "grid size-10 shrink-0 place-items-center rounded-[15px]",
                    feed.tone === "lime" ? "bg-spark-lime text-black" : "",
                    feed.tone === "purple" ? "bg-spark-purple text-white" : "",
                    feed.tone === "dark" ? "bg-white/8 text-spark-lime" : "",
                  ].join(" ")}
                >
                  <HeartPulse size={18} strokeWidth={2.6} />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black">{feed.title}</h3>
                  <p className="mt-0.5 text-[11px] font-bold text-white/42">{feed.meta}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-black">{feed.value}</p>
                <p className="mt-0.5 text-[10px] font-bold text-white/42">{feed.sub}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="참여 모임 관리" action="관리" />
        <div className="mt-2.5 grid gap-2">
          {joinedGroups.map((group) => (
            <article key={group.title} className="rounded-[20px] border border-white/8 bg-card p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black">{group.title}</h3>
                  <p className="mt-1 text-[11px] font-bold text-white/42">{group.time}</p>
                </div>
                <span className="rounded-full bg-spark-lime px-2.5 py-1 text-[10px] font-black text-black">{group.status}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-white/48">
                <span>{group.count}</span>
                <button className="font-black text-spark-lime">상세 보기</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="획득 배지" action="8개" />
        <div className="scrollbar-none mt-2.5 flex gap-2 overflow-x-auto">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="w-[78px] shrink-0 rounded-[18px] border border-white/8 bg-card p-2.5 text-center">
                <div className="mx-auto grid size-9 place-items-center rounded-[14px] bg-white/8 text-spark-lime">
                  <Icon size={17} strokeWidth={2.6} />
                </div>
                <p className="mt-2 truncate text-[11px] font-black">{badge.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[22px] border border-white/8 bg-card p-3">
        <SectionTitle title="친구" action="친구 관리" compact />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2">
            {friends.map((friend, index) => (
              <div
                key={friend}
                className="grid size-9 place-items-center rounded-full border-2 border-card bg-spark-purple text-[11px] font-black text-white"
                style={{ backgroundColor: index === 0 ? "#8e6ecf" : index === 1 ? "#dfff4c" : "#f3effe", color: index === 0 ? "#fff" : "#111" }}
              >
                {friend.slice(0, 1)}
              </div>
            ))}
          </div>
          <p className="text-[11px] font-bold text-white/48">최근 함께 운동한 친구 3명</p>
        </div>
      </section>

      <section className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} className="flex w-full items-center gap-3 rounded-[20px] border border-white/8 bg-card p-3 text-left">
              <div className="grid size-9 shrink-0 place-items-center rounded-[14px] bg-white/8 text-spark-lime">
                <Icon size={17} strokeWidth={2.6} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black">{item.label}</p>
                <p className="mt-0.5 truncate text-[11px] font-bold text-white/42">{item.desc}</p>
              </div>
              <ChevronRight size={17} className="text-white/28" />
            </button>
          );
        })}
      </section>
    </main>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-black/12 px-2.5 py-2">
      <p className="text-[10px] font-black text-black/45">{label}</p>
      <p className="mt-0.5 text-sm font-black">{value}</p>
    </div>
  );
}

function SectionTitle({ title, action, compact = false }: { title: string; action: string; compact?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className={compact ? "text-sm font-black" : "text-base font-black"}>{title}</h2>
      <button className="text-[11px] font-black text-spark-lime">{action}</button>
    </div>
  );
}
