"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Bike, Check, ChevronRight, Clock3, Crown,
  LocateFixed, MapPin, MessageCircle, Pause, Play,
  Route, Square, Timer, UserCheck, UsersRound, X, Zap,
  type LucideIcon,
} from "lucide-react";
import {
  CURRENT_SPARK_LEVEL,
  SparkCharacter,
} from "@/components/character/spark-character";

type Role = "host" | "member";
type Stage = "select" | "lobby" | "waiting" | "countdown" | "active" | "paused" | "finish" | "summary";
type Member = { id: string; name: string; level: string; checkedIn: boolean; isHost?: boolean };
type Group = {
  id: string;
  title: string;
  activity: string;
  icon: LucideIcon;
  place: string;
  time: string;
  distance: string;
  pace: string;
  participants: number;
};

const groups: Group[] = [
  { id: "run-01", title: "퇴근 후 안양천 5K", activity: "러닝", icon: Zap, place: "안양천 중앙광장", time: "오늘 20:00", distance: "727m", pace: "6'30\" /km", participants: 6 },
  { id: "ride-01", title: "한강 야간 라이딩", activity: "라이딩", icon: Bike, place: "여의나루 2번 출구", time: "오늘 20:30", distance: "1.8km", pace: "20km/h", participants: 8 },
];

const initialMembers: Member[] = [
  { id: "host", name: "서연", level: "러닝 중급", checkedIn: true, isHost: true },
  { id: "me", name: "도윤", level: "러닝 입문", checkedIn: false },
  { id: "m1", name: "민지", level: "러닝 초급", checkedIn: true },
  { id: "m2", name: "준호", level: "러닝 중급", checkedIn: false },
  { id: "m3", name: "하루", level: "러닝 초급", checkedIn: true },
];

export function GroupWorkoutFlow() {
  const [role, setRole] = useState<Role>("member");
  const [stage, setStage] = useState<Stage>("select");
  const [groupId, setGroupId] = useState(groups[0].id);
  const [members, setMembers] = useState(initialMembers);
  const [countdown, setCountdown] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const group = useMemo(() => groups.find((item) => item.id === groupId) ?? groups[0], [groupId]);
  const checkedInCount = members.filter((member) => member.checkedIn).length;
  const isLive = stage === "active" || stage === "paused" || stage === "finish";

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

  const changeRole = (nextRole: Role) => {
    setRole(nextRole);
    setStage("select");
    setSeconds(0);
    setMembers(initialMembers);
  };

  const startCountdown = () => {
    setCountdown(3);
    setStage("countdown");
  };

  if (stage === "countdown") {
    return <GroupCountdown group={group} role={role} count={countdown} onCancel={() => setStage(role === "host" ? "lobby" : "waiting")} />;
  }

  if (isLive) {
    return (
      <LiveGroupWorkout
        role={role}
        group={group}
        members={members}
        seconds={seconds}
        paused={stage !== "active"}
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
    return <GroupSummary role={role} group={group} members={members} seconds={seconds} onReset={() => changeRole(role)} />;
  }

  return (
    <main className="space-y-4 pb-4 pt-1 text-white">
      <header className="flex items-center justify-between">
        <Link href="/spark" className="grid size-9 place-items-center rounded-full bg-white/8" aria-label="운동 시작 화면으로 돌아가기"><ArrowLeft size={18} /></Link>
        <p className="text-sm font-black">모임 운동</p>
        <button type="button" className="grid size-9 place-items-center rounded-full bg-white/8" aria-label="모임 채팅"><MessageCircle size={17} /></button>
      </header>

      <section className="grid grid-cols-2 gap-1 rounded-[18px] bg-white/[0.05] p-1">
        <RoleButton active={role === "host"} icon={Crown} label="모임장으로 보기" onClick={() => changeRole("host")} />
        <RoleButton active={role === "member"} icon={UserCheck} label="모임원으로 보기" onClick={() => changeRole("member")} />
      </section>

      {stage === "select" && (
        <GroupSelect
          role={role}
          groupId={groupId}
          onSelect={setGroupId}
          onContinue={() => setStage("lobby")}
        />
      )}

      {(stage === "lobby" || stage === "waiting") && (
        <GroupLobby
          role={role}
          group={group}
          members={members}
          checkedInCount={checkedInCount}
          waiting={stage === "waiting"}
          onToggleMember={(id) => setMembers((current) => current.map((member) => member.id === id ? { ...member, checkedIn: !member.checkedIn } : member))}
          onMemberCheckIn={() => {
            setMembers((current) => current.map((member) => member.id === "me" ? { ...member, checkedIn: true } : member));
            setStage("waiting");
          }}
          onStart={startCountdown}
          onReceiveStart={startCountdown}
        />
      )}
    </main>
  );
}

function GroupSelect({
  role, groupId, onSelect, onContinue,
}: {
  role: Role;
  groupId: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <section>
        <p className="text-[10px] font-black text-spark-lime">{role === "host" ? "HOSTING" : "MY GROUPS"}</p>
        <h1 className="mt-1 text-[23px] font-black">{role === "host" ? "진행할 모임을 선택하세요" : "참여할 모임을 선택하세요"}</h1>
        <p className="mt-1 text-xs font-bold text-white/45">{role === "host" ? "모임장은 출석과 전체 운동을 관리합니다." : "체크인 후 모임장의 시작 신호를 기다립니다."}</p>
      </section>

      <section className="space-y-2">
        {groups.map((group) => {
          const Icon = group.icon;
          const active = group.id === groupId;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onSelect(group.id)}
              className={`w-full rounded-[22px] border p-3.5 text-left transition ${active ? "border-spark-lime bg-spark-lime/10" : "border-white/8 bg-card"}`}
            >
              <div className="flex items-start gap-3">
                <div className={active ? "grid size-11 place-items-center rounded-[16px] bg-spark-lime text-black" : "grid size-11 place-items-center rounded-[16px] bg-white/8 text-spark-lime"}><Icon size={21} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/8 px-2 py-1 text-[9px] font-black">{group.activity}</span>
                    <span className="text-[10px] font-black text-spark-lime">{group.time}</span>
                  </div>
                  <h2 className="mt-1.5 text-sm font-black">{group.title}</h2>
                  <p className="mt-1 text-[10px] font-bold text-white/42">{group.place} · {group.participants}명 참여</p>
                </div>
                {active && <Check size={18} className="text-spark-lime" />}
              </div>
            </button>
          );
        })}
      </section>

      <button type="button" onClick={onContinue} className="flex h-13 w-full items-center justify-center gap-1 rounded-[18px] bg-spark-lime text-sm font-black text-black">
        모임 준비 화면으로<ChevronRight size={17} />
      </button>
    </>
  );
}

function GroupLobby({
  role, group, members, checkedInCount, waiting, onToggleMember,
  onMemberCheckIn, onStart, onReceiveStart,
}: {
  role: Role;
  group: Group;
  members: Member[];
  checkedInCount: number;
  waiting: boolean;
  onToggleMember: (id: string) => void;
  onMemberCheckIn: () => void;
  onStart: () => void;
  onReceiveStart: () => void;
}) {
  return (
    <>
      <section className="overflow-hidden rounded-[24px] border border-white/10 bg-card">
        <div className="relative h-[148px] overflow-hidden">
          <MapPattern />
          <div className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-spark-lime text-black shadow-[0_0_28px_rgba(223,255,76,0.35)]"><UsersRound size={22} /></div>
          <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-black"><MapPin size={12} className="mr-1 inline text-spark-lime" />{group.place}</div>
        </div>
        <div className="p-3.5">
          <div className="flex items-center justify-between">
            <div><p className="text-[10px] font-black text-spark-lime">{group.activity}</p><h1 className="mt-1 text-lg font-black">{group.title}</h1></div>
            <div className="rounded-[14px] bg-white/8 px-3 py-2 text-center"><p className="text-[9px] font-bold text-white/40">시작</p><p className="text-xs font-black">20:00</p></div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MiniInfo icon={MapPin} label="거리" value={group.distance} />
            <MiniInfo icon={Route} label="목표" value="5km" />
            <MiniInfo icon={Timer} label="페이스" value={group.pace} />
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-card p-3.5">
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-black">참가자 체크인</p><p className="mt-0.5 text-[10px] font-bold text-white/42">{checkedInCount}/{members.length}명 도착</p></div>
          {role === "host" && <span className="rounded-full bg-spark-lime px-2.5 py-1 text-[9px] font-black text-black"><Crown size={11} className="mr-1 inline" />모임장 관리</span>}
        </div>
        <div className="mt-3 space-y-2">
          {members.map((member) => (
            <div key={member.id} className={`flex items-center gap-2.5 rounded-[16px] border p-2.5 ${member.isHost ? "border-spark-lime/35 bg-spark-lime/8" : "border-white/8 bg-white/[0.03]"}`}>
              <div className={member.isHost ? "grid size-9 place-items-center rounded-[13px] bg-spark-lime text-black" : "grid size-9 place-items-center rounded-[13px] bg-white/8 text-spark-lime"}>
                {member.isHost ? <Crown size={16} /> : <span className="text-[11px] font-black">{member.name.slice(0, 1)}</span>}
              </div>
              <div className="min-w-0 flex-1"><p className="text-xs font-black">{member.name}{member.id === "me" ? " (나)" : ""}</p><p className="mt-0.5 text-[9px] font-bold text-white/38">{member.level}</p></div>
              {role === "host" && !member.isHost ? (
                <button type="button" onClick={() => onToggleMember(member.id)} className={member.checkedIn ? "rounded-full bg-spark-lime px-2.5 py-1.5 text-[9px] font-black text-black" : "rounded-full bg-white/8 px-2.5 py-1.5 text-[9px] font-black text-white/50"}>
                  {member.checkedIn ? "도착" : "미도착"}
                </button>
              ) : (
                <span className={member.checkedIn ? "text-[10px] font-black text-spark-lime" : "text-[10px] font-black text-white/30"}>{member.checkedIn ? "체크인" : "이동 중"}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {role === "host" ? (
        <button type="button" onClick={onStart} disabled={checkedInCount < 2} className="flex h-14 w-full items-center justify-center gap-2 rounded-[19px] bg-spark-lime text-sm font-black text-black"><Play size={18} fill="currentColor" />{checkedInCount}명과 운동 시작</button>
      ) : waiting ? (
        <section className="rounded-[22px] border border-spark-lime/25 bg-spark-lime/8 p-4 text-center">
          <span className="mx-auto block size-3 animate-pulse rounded-full bg-spark-lime" />
          <h2 className="mt-3 text-sm font-black">모임장의 시작을 기다리는 중</h2>
          <p className="mt-1 text-[10px] font-bold text-white/45">출석이 확인됐어요. 시작 신호가 오면 함께 기록됩니다.</p>
          <button type="button" onClick={onReceiveStart} className="mt-4 h-10 rounded-[15px] bg-white px-5 text-[11px] font-black text-black">시작 신호 받기 (MVP)</button>
        </section>
      ) : (
        <button type="button" onClick={onMemberCheckIn} className="flex h-14 w-full items-center justify-center gap-2 rounded-[19px] bg-spark-lime text-sm font-black text-black"><LocateFixed size={18} />장소 도착 · 체크인</button>
      )}
    </>
  );
}

function GroupCountdown({ group, role, count, onCancel }: { group: Group; role: Role; count: number; onCancel: () => void }) {
  return (
    <main className="flex min-h-full flex-col items-center justify-center pb-8 text-center text-white">
      <div className="flex -space-x-2">
        {["서", "도", "민", "하"].map((name, index) => <div key={name} className={`grid size-11 place-items-center rounded-full border-2 border-background text-xs font-black ${index === 0 ? "bg-spark-lime text-black" : "bg-spark-purple text-white"}`}>{name}</div>)}
      </div>
      <p className="mt-5 text-sm font-black text-white/55">{group.title}</p>
      <p className="mt-2 text-[84px] font-black leading-none text-spark-lime">{count || "GO"}</p>
      <p className="mt-4 text-xs font-bold text-white/42">{role === "host" ? "모든 참가자에게 시작 신호를 보냈어요." : "모임장과 운동 기록을 동기화합니다."}</p>
      <button type="button" onClick={onCancel} className="mt-10 rounded-full bg-white/10 px-6 py-3 text-xs font-black">취소</button>
    </main>
  );
}

function LiveGroupWorkout({
  role, group, members, seconds, paused, finishOpen, onPause, onResume,
  onFinish, onCancelFinish, onConfirmFinish,
}: {
  role: Role;
  group: Group;
  members: Member[];
  seconds: number;
  paused: boolean;
  finishOpen: boolean;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onCancelFinish: () => void;
  onConfirmFinish: () => void;
}) {
  const distance = Math.max(0.01, seconds / 375).toFixed(2);
  return (
    <main className="relative -mx-4 min-h-full overflow-hidden bg-[#111113] text-white">
      <div className="relative h-[300px] overflow-hidden">
        <MapPattern active />
        <div className="absolute left-[15%] top-[62%] h-2 w-[56%] rotate-[-19deg] rounded-full bg-spark-lime shadow-[0_0_14px_rgba(223,255,76,0.6)]" />
        {members.filter((member) => member.checkedIn).slice(0, 4).map((member, index) => (
          <div key={member.id} className="absolute grid size-8 place-items-center rounded-full border-2 border-white bg-spark-purple text-[9px] font-black shadow-xl" style={{ left: `${28 + index * 12}%`, top: `${55 - index * 5}%` }}>{member.name.slice(0, 1)}</div>
        ))}
        <div className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-2 text-[10px] font-black"><span className={`mr-1.5 inline-block size-2 rounded-full ${paused ? "bg-white/40" : "animate-pulse bg-spark-lime"}`} />{paused ? "모임 일시정지" : `${members.filter((member) => member.checkedIn).length}명 함께 운동 중`}</div>
        <button type="button" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-black/75" aria-label="현재 위치로 이동"><LocateFixed size={17} /></button>
      </div>

      <section className="relative -mt-6 min-h-[430px] rounded-t-[28px] bg-card px-4 pb-8 pt-5">
        <div className="flex items-center justify-between">
          <div><p className="text-[10px] font-black text-spark-lime">{role === "host" ? "HOST CONTROL" : "GROUP LIVE"}</p><h1 className="mt-1 text-base font-black">{group.title}</h1></div>
          <div className="rounded-[14px] bg-white/8 px-3 py-2 text-center"><p className="text-[9px] text-white/40">운동 시간</p><p className="text-sm font-black">{formatTime(seconds)}</p></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Metric label="내 거리" value={distance} unit="km" />
          <Metric label="그룹 페이스" value={`6'28"`} unit="/km" />
          <Metric label="칼로리" value={String(Math.max(3, Math.round(seconds / 6)))} unit="kcal" />
          <Metric label="심박수" value={String(121 + Math.min(32, Math.floor(seconds / 10)))} unit="bpm" />
        </div>
        <div className="mt-5 flex items-center justify-center gap-5">
          <button type="button" onClick={onFinish} className="flex size-14 flex-col items-center justify-center rounded-full bg-white/10 text-[9px] font-black"><Square size={14} fill="currentColor" className="mb-1" />{role === "host" ? "전체 종료" : "나만 종료"}</button>
          {role === "host" ? (
            <button type="button" onClick={paused ? onResume : onPause} className="grid size-20 place-items-center rounded-full bg-spark-lime text-black" aria-label={paused ? "모임 운동 재개" : "모임 운동 일시정지"}>{paused ? <Play size={30} fill="currentColor" /> : <Pause size={30} fill="currentColor" />}</button>
          ) : (
            <div className="flex size-20 flex-col items-center justify-center rounded-full bg-spark-lime text-center text-black"><UsersRound size={25} /><span className="mt-1 text-[9px] font-black">동기화 중</span></div>
          )}
          <button type="button" className="flex size-14 flex-col items-center justify-center rounded-full bg-white/10 text-[9px] font-black"><MessageCircle size={15} className="mb-1" />채팅</button>
        </div>
        {role === "member" && <p className="mt-4 text-center text-[10px] font-bold text-white/38">일시정지와 전체 종료는 모임장만 제어할 수 있어요.</p>}
      </section>

      {finishOpen && (
        <div className="absolute inset-0 z-40 flex items-end bg-black/72 p-3">
          <div className="w-full rounded-[24px] border border-white/10 bg-card p-4">
            <div className="flex items-center justify-between"><h2 className="text-base font-black">{role === "host" ? "모임 운동을 종료할까요?" : "내 운동 기록을 종료할까요?"}</h2><button type="button" onClick={onCancelFinish} className="grid size-8 place-items-center rounded-full bg-white/8" aria-label="종료 확인 닫기"><X size={16} /></button></div>
            <p className="mt-2 text-xs font-bold text-white/48">{role === "host" ? "참가자 전원의 운동이 종료되고 각 기록이 저장됩니다." : "다른 모임원은 계속 운동하며 내 기록만 종료됩니다."}</p>
            <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={onCancelFinish} className="h-11 rounded-[16px] bg-white/8 text-xs font-black">계속 운동</button><button type="button" onClick={onConfirmFinish} aria-label={role === "host" ? "모임 운동 전체 종료 확인" : "모임원 운동 종료 확인"} className="h-11 rounded-[16px] bg-spark-lime text-xs font-black text-black">{role === "host" ? "전체 종료" : "나만 종료"}</button></div>
          </div>
        </div>
      )}
    </main>
  );
}

function GroupSummary({ role, group, members, seconds, onReset }: { role: Role; group: Group; members: Member[]; seconds: number; onReset: () => void }) {
  const [saved, setSaved] = useState(false);
  const recordedDistanceKm = seconds / 375;
  const distanceKm = Math.max(0.01, recordedDistanceKm);
  const averageSpeed = seconds > 0 ? recordedDistanceKm / (seconds / 3600) : 0;
  return (
    <main className="space-y-4 pb-4 pt-1 text-white">
      <section className="rounded-[24px] bg-spark-lime p-4 text-black">
        <div className="flex items-start justify-between gap-2"><div><p className="text-[10px] font-black">GROUP COMPLETE</p><h1 className="mt-1 text-[23px] font-black">함께한 SPARK 완료!</h1><p className="mt-1 text-xs font-bold text-black/58">{role === "host" ? "모임 운동을 안전하게 마쳤어요." : "내 모임 운동 기록이 완성됐어요."}</p></div><div className="grid size-[76px] shrink-0 place-items-center"><SparkCharacter level={CURRENT_SPARK_LEVEL} state="complete" size={76} /></div></div>
      </section>
      <section className="rounded-[22px] border border-white/10 bg-card p-3.5">
        <p className="text-[10px] font-black text-spark-lime">{group.activity}</p><h2 className="mt-1 text-base font-black">{group.title}</h2>
        <div className={`mt-3 grid gap-2 ${group.activity === "러닝" ? "grid-cols-2" : "grid-cols-3"}`}>
          <MiniInfo icon={Clock3} label="시간" value={formatTime(seconds)} />
          <MiniInfo icon={Route} label="거리" value={`${distanceKm.toFixed(2)}km`} />
          {group.activity === "러닝" && <MiniInfo icon={Zap} label="평균 속도" value={`${averageSpeed.toFixed(1)}km/h`} />}
          <MiniInfo icon={UsersRound} label="함께" value={`${members.filter((member) => member.checkedIn).length}명`} />
        </div>
      </section>
      {role === "host" && <section className="rounded-[22px] border border-white/10 bg-card p-3.5"><div className="flex items-center justify-between"><h2 className="text-sm font-black">참가 기록</h2><span className="text-[10px] font-black text-spark-lime">전원 기록 생성</span></div><div className="mt-3 space-y-2">{members.filter((member) => member.checkedIn).map((member) => <div key={member.id} className="flex items-center justify-between rounded-[14px] bg-white/[0.04] px-3 py-2.5"><span className="text-xs font-black">{member.name}</span><span className="text-[10px] font-black text-spark-lime">완료</span></div>)}</div></section>}
      {saved ? <div className="rounded-[18px] bg-spark-lime/10 p-3 text-center text-xs font-black text-spark-lime">모임 운동 기록이 저장됐어요.</div> : <button type="button" onClick={() => setSaved(true)} className="h-12 w-full rounded-[18px] bg-spark-lime text-sm font-black text-black">운동 기록 저장</button>}
      <div className="grid grid-cols-2 gap-2"><button type="button" onClick={onReset} className="h-11 rounded-[16px] bg-white/8 text-xs font-black">다른 모임 운동</button><Link href="/home" className="flex h-11 items-center justify-center rounded-[16px] bg-white text-xs font-black text-black">홈으로</Link></div>
    </main>
  );
}

function RoleButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: LucideIcon; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={active ? "flex h-10 items-center justify-center gap-1.5 rounded-[14px] bg-white text-[11px] font-black text-black" : "flex h-10 items-center justify-center gap-1.5 rounded-[14px] text-[11px] font-black text-white/48"}><Icon size={14} />{label}</button>;
}

function MiniInfo({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="rounded-[14px] bg-white/[0.05] p-2.5"><Icon size={14} className="text-spark-lime" /><p className="mt-1.5 text-[9px] font-bold text-white/38">{label}</p><p className="mt-0.5 truncate text-[11px] font-black">{value}</p></div>;
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return <div className="rounded-[18px] bg-white/[0.05] p-3"><p className="text-[10px] font-black text-white/40">{label}</p><p className="mt-1 text-[24px] font-black leading-none">{value} <span className="text-[10px] text-white/42">{unit}</span></p></div>;
}

function MapPattern({ active = false }: { active?: boolean }) {
  return <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_50%,rgba(223,255,76,0.14),transparent_24%),radial-gradient(circle_at_25%_20%,rgba(142,108,239,0.2),transparent_30%),linear-gradient(145deg,#161618,#242229)]"><div className="absolute left-[-20%] top-[40%] h-px w-[150%] rotate-[-18deg] bg-white/12" /><div className="absolute left-[-10%] top-[65%] h-[2px] w-[130%] rotate-[12deg] bg-white/8" /><div className="absolute left-[27%] top-[-20%] h-[140%] w-px rotate-[14deg] bg-white/10" />{active && <div className="absolute bottom-4 right-4 rounded-full bg-black/65 px-2.5 py-1 text-[9px] font-black text-spark-lime">그룹 GPS 연결</div>}</div>;
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return [hours, minutes, rest].map((value) => String(value).padStart(2, "0")).join(":");
}
