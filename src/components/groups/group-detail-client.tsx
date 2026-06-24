"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ChevronRight,
  Dumbbell,
  MapPin,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { deleteMeetup, getClientMeetups } from "@/shared/data-access/client-meetup-store";
import type { ActivityType, GenderPolicy, Meetup, MeetupLevel, Partner } from "@/shared/types";

type Participant = {
  id: string;
  name: string;
  role: "host" | "member";
  level: string;
  style: string;
  joinedCount: number;
  trustScore: number;
  favorite: string;
};

const MOCK_CURRENT_USER_ID = "user-host-002";

const activityLabels: Record<ActivityType, string> = {
  running: "러닝",
  riding: "라이딩",
  walking: "걷기",
  gym: "헬스",
  hiking: "등산",
  free: "자유 운동",
  custom: "직접 입력",
};

const levelLabels: Record<MeetupLevel, string> = {
  beginner: "입문",
  easy: "초급",
  medium: "중급",
  hard: "고급",
};

const genderLabels: Record<GenderPolicy, string> = {
  all: "전체",
  women_only: "여성 전용",
  men_only: "남성 전용",
};

const sampleMembers = [
  { name: "민준", level: "초급 러너", style: "가볍게 꾸준히", favorite: "러닝", joinedCount: 12, trustScore: 94 },
  { name: "서연", level: "입문 러너", style: "함께 동기부여", favorite: "걷기", joinedCount: 8, trustScore: 91 },
  { name: "지훈", level: "중급 헬스", style: "루틴 중심", favorite: "헬스", joinedCount: 16, trustScore: 88 },
  { name: "하린", level: "초급 라이더", style: "천천히 안전하게", favorite: "라이딩", joinedCount: 6, trustScore: 86 },
  { name: "도윤", level: "입문", style: "처음 만나는 모임 선호", favorite: "러닝", joinedCount: 4, trustScore: 84 },
  { name: "유나", level: "중급", style: "기록 관리형", favorite: "등산", joinedCount: 19, trustScore: 96 },
];

export function GroupDetailClient({
  groupId,
  seedMeetups,
  partners,
}: {
  groupId: string;
  seedMeetups: Meetup[];
  partners: Partner[];
}) {
  const router = useRouter();
  const [meetups, setMeetups] = useState(seedMeetups);
  const [ready, setReady] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setMeetups(getClientMeetups(seedMeetups));
      setReady(true);
    });
  }, [seedMeetups]);

  const meetup = useMemo(() => meetups.find((item) => item.id === groupId), [groupId, meetups]);

  if (!ready) {
    return (
      <main className="pt-1">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-spark-lime">Group Detail</p>
        <h1 className="mt-2 text-2xl font-black">모임을 불러오는 중</h1>
      </main>
    );
  }

  if (!meetup) {
    return (
      <main className="pt-1">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-spark-lime">Group Detail</p>
        <h1 className="mt-2 text-2xl font-black">모임을 찾을 수 없어요</h1>
        <Link href="/groups" className="mt-5 flex h-11 items-center justify-center rounded-[17px] bg-spark-lime text-sm font-black text-black">
          모임탭으로 돌아가기
        </Link>
      </main>
    );
  }

  const partner = meetup.partnerId ? partners.find((item) => item.id === meetup.partnerId) : undefined;
  const isHost = meetup.hostId === MOCK_CURRENT_USER_ID;
  const participants = buildParticipants(meetup);
  const visibleParticipants = participants.slice(0, Math.max(4, Math.min(participants.length, 8)));

  function handleDelete() {
    if (!meetup || !isHost) return;
    if (!window.confirm("이 모임을 삭제할까요?")) return;
    deleteMeetup(groupId);
    router.push("/groups");
    router.refresh();
  }

  return (
    <main className="space-y-4 pb-4 pt-1 text-white">
      <section className="rounded-[24px] bg-[radial-gradient(circle_at_top_left,#DFFF4C_0%,#8E6CEF_58%,#1C1C1E_100%)] p-[1px]">
        <div className="rounded-[23px] bg-black/78 p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-spark-lime">Group Detail</p>
              <h1 className="mt-1.5 text-[23px] font-black leading-tight">{meetup.title}</h1>
              <p className="mt-2 flex items-center gap-1 text-xs font-bold text-white/58">
                <MapPin size={13} />
                {meetup.address}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-spark-lime px-2.5 py-1 text-[10px] font-black text-black">
              {meetup.status === "open" ? "모집중" : meetup.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Info label="인원" value={`${meetup.participantCount}/${meetup.capacity}`} />
            <Info label="난이도" value={levelLabels[meetup.level]} />
            <Info label="신뢰도" value={`${meetup.hostTrustScore}`} />
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-card p-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black">모임 상세정보</h2>
          <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-black text-white/62">{activityLabels[meetup.activityType]}</span>
        </div>
        <div className="mt-3 grid gap-2">
          <DetailRow icon={CalendarClock} label="시작 시간" value={formatDateTime(meetup.startAt)} />
          <DetailRow icon={Dumbbell} label="운동 조건" value={`${levelLabels[meetup.level]} · ${genderLabels[meetup.genderPolicy]} · ${meetup.ageRange ?? "전체"}`} />
          <DetailRow icon={MapPin} label="장소" value={partner ? `${partner.name} 연동 장소` : meetup.address} />
          <DetailRow icon={ShieldCheck} label="준비물" value={meetup.supplies.join(", ")} />
          <DetailRow icon={Star} label="비용" value={meetup.priceType === "free" ? "무료" : `${meetup.price?.toLocaleString() ?? 0}원`} />
        </div>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-card p-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black">참여한 인원</h2>
            <p className="mt-1 text-[11px] font-bold text-white/42">참여자를 선택하면 간단한 사용자 정보를 볼 수 있어요.</p>
          </div>
          <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-black text-white/62">{meetup.participantCount}명</span>
        </div>

        <div className="mt-3 space-y-2">
          {visibleParticipants.map((participant) => (
            <button
              key={participant.id}
              type="button"
              onClick={() => setSelectedParticipant(participant)}
              className={[
                "flex w-full items-center gap-3 rounded-[18px] border p-2.5 text-left transition",
                participant.role === "host" ? "border-spark-lime/45 bg-spark-lime/10" : "border-white/8 bg-white/[0.04]",
              ].join(" ")}
            >
              <div className={participant.role === "host" ? "grid size-10 place-items-center rounded-[15px] bg-spark-lime text-black" : "grid size-10 place-items-center rounded-[15px] bg-white/8 text-spark-lime"}>
                {participant.role === "host" ? <ShieldCheck size={18} strokeWidth={2.7} /> : <UserRound size={18} strokeWidth={2.7} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-black">{participant.name}</p>
                  {participant.role === "host" && <span className="rounded-full bg-spark-lime px-2 py-0.5 text-[9px] font-black text-black">모임장</span>}
                </div>
                <p className="mt-0.5 truncate text-[11px] font-bold text-white/44">{participant.level} · {participant.style}</p>
              </div>
              <ChevronRight size={17} className="text-white/28" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-card p-3.5">
        <div className="flex items-start gap-3">
          <div className="grid size-10 place-items-center rounded-[15px] bg-spark-lime text-black">
            <ShieldCheck size={19} strokeWidth={2.7} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-spark-lime">HOST</p>
            <h2 className="mt-0.5 text-base font-black">{meetup.hostName}</h2>
            <p className="mt-1 text-[11px] font-bold text-white/48">신뢰도 {meetup.hostTrustScore} · 모임 운영 경험 보유</p>
          </div>
        </div>
      </section>

      {isHost ? (
        <div className="grid grid-cols-2 gap-2.5">
          <Link href={`/groups/${meetup.id}/edit`} className="flex h-11 items-center justify-center rounded-[17px] bg-white text-sm font-black text-black">
            수정
          </Link>
          <button type="button" onClick={handleDelete} className="flex h-11 items-center justify-center gap-1 rounded-[17px] bg-red-500/16 text-sm font-black text-red-100">
            <Trash2 size={15} />
            삭제
          </button>
        </div>
      ) : (
        <p className="rounded-[18px] border border-white/8 bg-white/[0.04] p-3 text-center text-[11px] font-bold text-white/46">
          수정과 삭제는 모임장만 할 수 있어요.
        </p>
      )}

      {!isHost && (
        <button className="h-11 w-full rounded-[17px] bg-spark-lime text-sm font-black text-black">
          참여 신청
        </button>
      )}

      {selectedParticipant && <ParticipantModal participant={selectedParticipant} onClose={() => setSelectedParticipant(null)} />}
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-white/[0.06] p-2.5">
      <p className="text-[10px] font-bold text-white/42">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[16px] bg-white/[0.045] p-2.5">
      <Icon size={15} className="shrink-0 text-spark-lime" strokeWidth={2.6} />
      <span className="w-16 shrink-0 text-[11px] font-black text-white/42">{label}</span>
      <span className="min-w-0 flex-1 text-xs font-bold text-white/78">{value}</span>
    </div>
  );
}

function ParticipantModal({ participant, onClose }: { participant: Participant; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-4">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="닫기" onClick={onClose} />
      <section className="relative w-full max-w-[360px] rounded-[24px] border border-white/10 bg-[#1C1C1E] p-4 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className={participant.role === "host" ? "grid size-12 place-items-center rounded-[18px] bg-spark-lime text-black" : "grid size-12 place-items-center rounded-[18px] bg-white/8 text-spark-lime"}>
            {participant.role === "host" ? <ShieldCheck size={24} /> : <UserRound size={24} />}
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full bg-white/10 text-white/70">
            <X size={16} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <h3 className="text-lg font-black">{participant.name}</h3>
          {participant.role === "host" && <span className="rounded-full bg-spark-lime px-2 py-0.5 text-[10px] font-black text-black">모임장</span>}
        </div>
        <p className="mt-1 text-xs font-bold text-white/50">{participant.level} · {participant.style}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Info label="참여" value={`${participant.joinedCount}회`} />
          <Info label="신뢰도" value={`${participant.trustScore}`} />
          <Info label="관심" value={participant.favorite} />
        </div>
        <button type="button" onClick={onClose} className="mt-4 h-10 w-full rounded-[16px] bg-spark-lime text-[13px] font-black text-black">
          확인
        </button>
      </section>
    </div>
  );
}

function buildParticipants(meetup: Meetup): Participant[] {
  const host: Participant = {
    id: meetup.hostId,
    name: meetup.hostName,
    role: "host",
    level: `${levelLabels[meetup.level]} ${activityLabels[meetup.activityType]}`,
    style: "모임을 안정적으로 이끄는 타입",
    joinedCount: 24,
    trustScore: meetup.hostTrustScore,
    favorite: activityLabels[meetup.activityType],
  };

  const members = sampleMembers
    .filter((member) => member.name !== meetup.hostName)
    .slice(0, Math.max(0, meetup.participantCount - 1))
    .map<Participant>((member, index) => ({
      id: `member-${meetup.id}-${index}`,
      role: "member",
      ...member,
    }));

  return [host, ...members];
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
