"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Dumbbell,
  LocateFixed,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Meetup, Partner, PartnerLocation } from "@/shared/types";

type FilterKey = "all" | "now" | "near" | "easy" | "free";

type LightningMeetup = {
  id: string;
  sourceId?: string;
  title: string;
  place: string;
  distanceM: number;
  time: string;
  headcount: string;
  capacityLeft: number;
  activity: string;
  level: string;
  gender: string;
  age: string;
  price: string;
  host: string;
  hostTrust: number;
  description: string;
  participants: string[];
  status: "open" | "soon" | "full";
  position: { left: string; top: string };
  partner?: string;
};

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "now", label: "곧 시작" },
  { key: "near", label: "가까운 순" },
  { key: "easy", label: "입문/초보" },
  { key: "free", label: "무료" },
];

const baseMeetups: LightningMeetup[] = [
  {
    id: "walk-after-work",
    sourceId: "meetup-run-002",
    title: "퇴근 후 산책 하실 분",
    place: "안양천",
    distanceM: 727,
    time: "오늘 20:00 ~ 21:00",
    headcount: "3/6",
    capacityLeft: 3,
    activity: "걷기",
    level: "전체 수준 가능",
    gender: "전체 성별 가능",
    age: "22~26세",
    price: "무료",
    host: "강아지",
    hostTrust: 92,
    description: "비슷한 나이대의 분들과 천천히 걷는 산책 번개예요.",
    participants: ["강아지", "개나리", "문어"],
    status: "soon",
    position: { left: "51%", top: "45%" },
  },
  {
    id: "run-beginner",
    sourceId: "meetup-run-002",
    title: "마음만은 적토마 런닝",
    place: "더현대서울",
    distanceM: 727,
    time: "오늘 20:10 ~ 21:00",
    headcount: "4/8",
    capacityLeft: 4,
    activity: "러닝",
    level: "입문자",
    gender: "전체 성별 가능",
    age: "20대",
    price: "무료",
    host: "달려라",
    hostTrust: 89,
    description: "페이스 7:30 정도로 가볍게 뛰는 입문 러닝 번개입니다.",
    participants: ["달려라", "키티", "문어", "개나리"],
    status: "open",
    position: { left: "28%", top: "33%" },
  },
  {
    id: "gym-newbie",
    sourceId: "meetup-gym-003",
    title: "헬린이 모임",
    place: "00 헬스장",
    distanceM: 1200,
    time: "내일 07:00 ~ 08:00",
    headcount: "2/2",
    capacityLeft: 0,
    activity: "헬스",
    level: "초보자",
    gender: "전체 성별 가능",
    age: "20~30대",
    price: "유료",
    host: "운동장",
    hostTrust: 88,
    description: "기구 사용이 어색한 사람끼리 루틴을 맞춰보는 모임이에요.",
    participants: ["운동장", "키티"],
    status: "full",
    position: { left: "68%", top: "58%" },
  },
  {
    id: "ride-seoul",
    sourceId: "meetup-r-001",
    title: "성수 라이트 라이딩",
    place: "서울숲 입구",
    distanceM: 1800,
    time: "오늘 19:30 ~ 20:40",
    headcount: "8/12",
    capacityLeft: 4,
    activity: "라이딩",
    level: "초보자",
    gender: "전체 성별 가능",
    age: "20~40대",
    price: "무료",
    host: "민재",
    hostTrust: 94,
    description: "성수 주변을 가볍게 도는 야간 라이딩 모임이에요.",
    participants: ["민재", "서연", "지훈", "하루"],
    status: "open",
    position: { left: "39%", top: "64%" },
  },
];

const activityLabels: Record<string, string> = {
  running: "러닝",
  riding: "라이딩",
  walking: "걷기",
  gym: "헬스",
  hiking: "등산",
  free: "자유 운동",
  custom: "직접입력",
};

const levelLabels: Record<string, string> = {
  beginner: "입문자",
  easy: "초보자",
  medium: "중급자",
  hard: "고급자",
};

const fallbackPositions = [
  { left: "22%", top: "55%" },
  { left: "74%", top: "36%" },
  { left: "58%", top: "24%" },
];

export function GroupsClient({
  seedMeetups,
  partnerLocations,
  partners,
}: {
  seedMeetups: Meetup[];
  partnerLocations: PartnerLocation[];
  partners: Partner[];
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(baseMeetups[0].id);
  const [joinedMeetup, setJoinedMeetup] = useState<LightningMeetup | null>(null);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const [hasMovedMap, setHasMovedMap] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [sheetDragStartY, setSheetDragStartY] = useState<number | null>(null);

  const adminMeetups = useMemo(
    () =>
      seedMeetups.slice(0, 3).map<LightningMeetup>((meetup, index) => {
        const fallback = baseMeetups[index % baseMeetups.length];
        const partner = meetup.partnerId ? partners.find((item) => item.id === meetup.partnerId) : undefined;

        return {
          ...fallback,
          id: `admin-${meetup.id}`,
          sourceId: meetup.id,
          headcount: `${meetup.participantCount}/${meetup.capacity}`,
          capacityLeft: Math.max(0, meetup.capacity - meetup.participantCount),
          activity: activityLabels[meetup.activityType] ?? fallback.activity,
          level: levelLabels[meetup.level] ?? fallback.level,
          price: meetup.priceType === "free" ? "무료" : `${meetup.price?.toLocaleString() ?? 0}원`,
          host: meetup.hostName || fallback.host,
          hostTrust: meetup.hostTrustScore,
          partner: partner?.name,
          position: fallbackPositions[index] ?? fallback.position,
        };
      }),
    [partners, seedMeetups],
  );

  const meetups = useMemo(() => [...baseMeetups, ...adminMeetups], [adminMeetups]);

  const filteredMeetups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let nextMeetups = meetups;

    if (filter === "now") nextMeetups = meetups.filter((meetup) => meetup.time.includes("오늘") || meetup.status === "soon");
    if (filter === "near") nextMeetups = [...meetups].sort((a, b) => a.distanceM - b.distanceM);
    if (filter === "easy") nextMeetups = meetups.filter((meetup) => meetup.level.includes("입문") || meetup.level.includes("초보"));
    if (filter === "free") nextMeetups = meetups.filter((meetup) => meetup.price === "무료");

    if (!query) return nextMeetups;

    return nextMeetups.filter((meetup) =>
      [meetup.title, meetup.place, meetup.activity, meetup.level, meetup.host, meetup.partner, meetup.time]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [filter, meetups, searchQuery]);

  const hasSearchQuery = searchQuery.trim().length > 0;
  const visibleMeetups = filteredMeetups.length > 0 ? filteredMeetups : hasSearchQuery ? [] : meetups;
  const selectedMeetup = visibleMeetups.find((meetup) => meetup.id === selectedId) ?? visibleMeetups[0];
  const fastestMeetup =
    visibleMeetups
      .filter((meetup) => meetup.capacityLeft > 0)
      .sort((a, b) => a.distanceM - b.distanceM)[0] ?? selectedMeetup;

  const handleMapPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input")) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({
      x: event.clientX,
      y: event.clientY,
      offsetX: mapOffset.x,
      offsetY: mapOffset.y,
    });
  };

  const handleMapPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!dragStart) return;

    setMapOffset({
      x: Math.max(-90, Math.min(90, dragStart.offsetX + event.clientX - dragStart.x)),
      y: Math.max(-120, Math.min(100, dragStart.offsetY + event.clientY - dragStart.y)),
    });
    setHasMovedMap(true);
  };

  const handleMapPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (dragStart) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragStart(null);
  };

  const handleReturnToMyLocation = () => {
    setMapOffset({ x: 0, y: 0 });
    setHasMovedMap(false);
    if (fastestMeetup) setSelectedId(fastestMeetup.id);
  };

  const handleSearchCurrentArea = () => {
    if (!selectedMeetup) return;
    setSelectedId((visibleMeetups.find((meetup) => meetup.id !== selectedMeetup.id) ?? selectedMeetup).id);
    setHasMovedMap(false);
  };

  const handleSheetPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    setSheetDragStartY(event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSheetPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (sheetDragStartY === null) return;

    const dragDistance = event.clientY - sheetDragStartY;
    if (dragDistance < -24) setSheetExpanded(true);
    if (dragDistance > 24) setSheetExpanded(false);
    if (Math.abs(dragDistance) <= 24) setSheetExpanded((value) => !value);

    setSheetDragStartY(null);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <main className="relative h-full min-h-[700px] overflow-hidden bg-[#111113] text-white">
      <MapBackdrop offset={mapOffset} />

      <section className="absolute inset-x-0 top-0 z-20 px-3 pt-3">
        <div className="flex items-center gap-2 rounded-[20px] border border-white/10 bg-black/82 p-2 shadow-2xl backdrop-blur-xl">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white/8 text-spark-lime">
            <Search size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-white/40">내 주변 모임 찾기</p>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="모임명, 장소, 종목 검색"
              className="mt-0.5 w-full bg-transparent text-[13px] font-black text-white outline-none placeholder:text-white/35"
              aria-label="모임 검색"
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="grid size-8 shrink-0 place-items-center rounded-full bg-white/8 text-white/70"
              aria-label="검색어 지우기"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="scrollbar-none mt-2.5 flex gap-1.5 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`h-8 shrink-0 rounded-full px-3 text-xs font-black shadow-lg backdrop-blur-xl ${
                filter === item.key ? "bg-spark-lime text-black" : "border border-white/10 bg-black/70 text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-xl"
            aria-label="상세 필터"
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </section>

      <section
        className={`absolute inset-0 touch-none select-none ${dragStart ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handleMapPointerDown}
        onPointerMove={handleMapPointerMove}
        onPointerUp={handleMapPointerUp}
        onPointerCancel={handleMapPointerUp}
      >
        <div className="absolute left-1/2 top-[49%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="grid size-7 place-items-center rounded-full bg-red-500/18">
            <span className="size-3 rounded-full border-2 border-white bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.7)]" />
          </div>
        </div>

        {visibleMeetups.map((meetup) => (
          <MapPicker
            key={meetup.id}
            meetup={meetup}
            active={meetup.id === selectedMeetup?.id}
            recommended={meetup.id === fastestMeetup?.id}
            offset={mapOffset}
            onSelect={() => setSelectedId(meetup.id)}
          />
        ))}

        {partnerLocations.slice(0, 3).map((location, index) => (
          <PartnerMarker
            key={location.id}
            label={index === 0 ? "협력 장소" : index === 1 ? "제휴 스튜디오" : "운동 시설"}
            className={index === 0 ? "left-[14%] top-[66%]" : index === 1 ? "right-[14%] top-[28%]" : "right-[18%] bottom-[31%]"}
            offset={mapOffset}
          />
        ))}
      </section>

      {hasMovedMap && (
        <button
          type="button"
          onClick={handleSearchCurrentArea}
          className="absolute left-1/2 top-[150px] z-30 h-9 -translate-x-1/2 rounded-full bg-spark-lime px-4 text-xs font-black text-black shadow-[0_0_22px_rgba(223,255,76,0.34)]"
        >
          이 지역에서 검색
        </button>
      )}

      <section className={`absolute inset-x-0 bottom-[80px] z-20 px-3 transition-all duration-300 ${sheetExpanded ? "top-[156px]" : "top-auto"}`}>
        <div className={`${sheetExpanded ? "hidden" : "mb-2.5 flex"} items-center justify-between`}>
          <button
            type="button"
            onClick={handleReturnToMyLocation}
            className="grid size-10 place-items-center rounded-full border border-white/10 bg-black/82 text-spark-lime shadow-xl backdrop-blur-xl"
            aria-label="내 위치로 돌아가기"
          >
            <LocateFixed size={18} />
          </button>
          <Link
            href="/groups/new"
            aria-label="모임 만들기"
            className="grid size-10 place-items-center rounded-full bg-spark-lime text-black shadow-[0_0_24px_rgba(223,255,76,0.28)]"
          >
            <Plus size={19} strokeWidth={3} />
          </Link>
        </div>

        <div className={`flex flex-col rounded-[24px] border border-white/10 bg-[#1C1C1E]/96 shadow-2xl backdrop-blur-xl ${sheetExpanded ? "h-full" : ""}`}>
          <button
            type="button"
            onPointerDown={handleSheetPointerDown}
            onPointerUp={handleSheetPointerUp}
            onPointerCancel={() => setSheetDragStartY(null)}
            className="flex shrink-0 flex-col items-center px-3 pb-2 pt-2.5"
            aria-label={sheetExpanded ? "모임 리스트 접기" : "모임 리스트 펼치기"}
          >
            <span className="h-1 w-10 rounded-full bg-white/24" />
            <span className="mt-1.5 text-[10px] font-black text-white/45">
              {sheetExpanded ? "아래로 내려 접기" : "위로 끌어올려 리스트 보기"}
            </span>
          </button>

          <div className="flex shrink-0 items-center justify-between px-3 pb-2.5">
            <span className="rounded-full bg-spark-lime px-2.5 py-1 text-[11px] font-black text-black">
              빠른 참여 추천
            </span>
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-bold text-white/65">
              {visibleMeetups.length}개 모임
            </span>
          </div>

          <div className={sheetExpanded ? "min-h-0 flex-1 overflow-y-auto px-3 pb-3" : "px-3 pb-3"}>
            {selectedMeetup ? (
              <QuickJoinCard
                meetup={selectedMeetup}
                recommended={selectedMeetup.id === fastestMeetup?.id}
                onJoin={() => setJoinedMeetup(selectedMeetup)}
              />
            ) : (
              <EmptySearchState query={searchQuery} />
            )}

            {sheetExpanded && (
              <div className="mt-2.5 space-y-2">
                {visibleMeetups.length > 0 ? (
                  visibleMeetups.map((meetup) => (
                    <MeetupListItem
                      key={meetup.id}
                      meetup={meetup}
                      active={meetup.id === selectedMeetup?.id}
                      onSelect={() => setSelectedId(meetup.id)}
                      onJoin={() => setJoinedMeetup(meetup)}
                    />
                  ))
                ) : (
                  <EmptySearchState query={searchQuery} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {joinedMeetup && <JoinSheet meetup={joinedMeetup} onClose={() => setJoinedMeetup(null)} />}
    </main>
  );
}

function MapBackdrop({ offset }: { offset: { x: number; y: number } }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#151516]">
      <div
        className="absolute inset-[-120px] transition-transform duration-75"
        style={{ transform: `translate(${offset.x * 0.45}px, ${offset.y * 0.45}px)` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(223,255,76,0.16),transparent_18%),radial-gradient(circle_at_28%_28%,rgba(142,108,239,0.22),transparent_24%),linear-gradient(145deg,#111113,#1C1C1E)]" />
        <div className="absolute left-[-18%] top-[24%] h-[1px] w-[145%] rotate-[24deg] bg-white/9" />
        <div className="absolute left-[-10%] top-[44%] h-[2px] w-[120%] rotate-[-18deg] bg-white/10" />
        <div className="absolute left-[18%] top-[-4%] h-[120%] w-[2px] rotate-[15deg] bg-white/8" />
        <div className="absolute left-[58%] top-[-8%] h-[130%] w-[2px] rotate-[-9deg] bg-white/8" />
        <div className="absolute left-[10%] top-[18%] h-[68%] w-[68%] rounded-full border border-white/6" />
        <div className="absolute right-[-20%] top-[36%] h-[58%] w-[72%] rounded-full border border-white/6" />
      </div>
      <div className="absolute bottom-[112px] left-4 right-4 h-20 rounded-[999px] bg-black/28 blur-2xl" />
    </div>
  );
}

function MapPicker({
  meetup,
  active,
  recommended,
  offset,
  onSelect,
}: {
  meetup: LightningMeetup;
  active: boolean;
  recommended: boolean;
  offset: { x: number; y: number };
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="absolute z-10 -translate-x-1/2 -translate-y-full text-left"
      style={{ left: meetup.position.left, top: meetup.position.top }}
    >
      <span className="block transition-transform duration-75" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        {recommended && (
          <span className="mb-1 block rounded-full bg-spark-purple px-2 py-0.5 text-center text-[9px] font-black text-white shadow-lg">
            빠른참여
          </span>
        )}
        <span
          className={`flex min-w-[82px] items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-black shadow-xl transition ${
            active ? "scale-105 bg-spark-lime text-black" : "bg-black/84 text-white backdrop-blur-xl"
          }`}
        >
          <MapPin size={12} fill={active ? "#111111" : "none"} />
          {meetup.activity} · {formatDistance(meetup.distanceM)}
        </span>
      </span>
    </button>
  );
}

function PartnerMarker({
  label,
  className,
  offset,
}: {
  label: string;
  className: string;
  offset: { x: number; y: number };
}) {
  return (
    <div
      className={`absolute z-0 rounded-full border border-white/10 bg-white/12 px-2.5 py-1 text-[9px] font-black text-white/70 transition-transform duration-75 ${className}`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      {label}
    </div>
  );
}

function EmptySearchState({ query }: { query: string }) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4 text-center">
      <div className="mx-auto grid size-10 place-items-center rounded-full bg-white/8 text-spark-lime">
        <Search size={17} />
      </div>
      <h2 className="mt-3 text-sm font-black">검색 결과가 없어요</h2>
      <p className="mt-1 text-[11px] font-bold text-white/48">
        {query ? `"${query}" 조건에 맞는 모임을 찾지 못했어요.` : "필터 조건을 조금 넓혀보세요."}
      </p>
    </div>
  );
}

function QuickJoinCard({
  meetup,
  recommended,
  onJoin,
}: {
  meetup: LightningMeetup;
  recommended: boolean;
  onJoin: () => void;
}) {
  return (
    <article className="rounded-[20px] bg-white/[0.05] p-3">
      <Link href={getMeetupDetailHref(meetup)} className="block">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-spark-lime px-2 py-0.5 text-[10px] font-black text-black">
              {recommended ? "추천" : meetup.activity}
            </span>
            <span className="text-[10px] font-black text-spark-lime">{meetup.time}</span>
          </div>
          <h2 className="mt-1.5 truncate text-[17px] font-black">{meetup.title}</h2>
          <p className="mt-1 text-[11px] font-bold text-white/45">
            {meetup.place} · 내 위치에서 {formatDistance(meetup.distanceM)}
          </p>
        </div>
        <div className="rounded-[14px] bg-white/[0.06] px-2.5 py-1.5 text-center">
          <p className="text-[10px] font-bold text-white/40">인원</p>
          <p className="text-xs font-black">{meetup.headcount}</p>
        </div>
      </div>

      <div className="mt-2.5 flex gap-1.5 overflow-hidden">
        {[meetup.level, meetup.age, meetup.gender, meetup.price].map((tag) => (
          <span key={tag} className="shrink-0 rounded-full bg-black px-2.5 py-1 text-[11px] font-bold text-white/65">
            {tag}
          </span>
        ))}
      </div>

      </Link>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          onClick={onJoin}
          disabled={meetup.capacityLeft === 0}
          className="h-10 rounded-[16px] bg-spark-lime text-[13px] font-black text-black disabled:bg-white/15 disabled:text-white/35"
        >
          {meetup.capacityLeft === 0 ? "대기 신청" : "바로 참여"}
        </button>
        <Link
          href={getMeetupDetailHref(meetup)}
          className="grid size-10 place-items-center rounded-[16px] bg-white/10 text-white"
          aria-label="상세 보기"
        >
          <MessageCircle size={16} />
        </Link>
      </div>
    </article>
  );
}

function MeetupListItem({
  meetup,
  active,
  onSelect,
  onJoin,
}: {
  meetup: LightningMeetup;
  active: boolean;
  onSelect: () => void;
  onJoin: () => void;
}) {
  return (
    <article className={`rounded-[18px] border p-2.5 transition ${active ? "border-spark-lime/50 bg-spark-lime/10" : "border-white/8 bg-white/[0.04]"}`}>
      <Link href={getMeetupDetailHref(meetup)} onClick={onSelect} className="block w-full text-left">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-black text-spark-lime">
                {meetup.activity}
              </span>
              <span className="text-[10px] font-black text-white/45">{formatDistance(meetup.distanceM)}</span>
            </div>
            <h3 className="mt-1.5 truncate text-sm font-black">{meetup.title}</h3>
            <p className="mt-1 truncate text-[11px] font-bold text-white/45">
              {meetup.place} · {meetup.time}
            </p>
          </div>
          <div className="rounded-[14px] bg-black/40 px-2.5 py-1.5 text-center">
            <p className="text-[9px] font-bold text-white/35">인원</p>
            <p className="text-[11px] font-black">{meetup.headcount}</p>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={onJoin}
        disabled={meetup.capacityLeft === 0}
        className="mt-2.5 h-9 w-full rounded-[15px] bg-spark-lime text-xs font-black text-black disabled:bg-white/12 disabled:text-white/35"
      >
        {meetup.capacityLeft === 0 ? "대기 신청" : "참여 신청"}
      </button>
    </article>
  );
}

function JoinSheet({ meetup, onClose }: { meetup: LightningMeetup; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-4">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="닫기" onClick={onClose} />
      <section className="relative w-full max-w-[360px] rounded-[24px] border border-white/10 bg-[#1C1C1E] p-4 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="grid size-11 place-items-center rounded-[16px] bg-spark-lime text-black">
            <CheckCircle2 size={23} />
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full bg-white/10 text-white/70">
            <X size={16} />
          </button>
        </div>
        <h3 className="mt-3 text-lg font-black">참여 신청 완료</h3>
        <p className="mt-2 text-[13px] leading-5 text-white/60">
          ‘{meetup.title}’ 번개 신청이 모임장에게 전달됐어요.
        </p>
        <div className="mt-3 rounded-[18px] bg-white/[0.06] p-2.5">
          <InfoRow icon={MapPin} label="장소" value={`${meetup.place} · ${formatDistance(meetup.distanceM)}`} />
          <InfoRow icon={Clock3} label="시간" value={meetup.time} />
          <InfoRow icon={ShieldCheck} label="호스트" value={`${meetup.host} · 신뢰도 ${meetup.hostTrust}`} />
          <InfoRow icon={Dumbbell} label="조건" value={`${meetup.level} · ${meetup.age}`} />
          <InfoRow icon={Users} label="인원" value={meetup.headcount} />
        </div>
        <button type="button" onClick={onClose} className="mt-3 h-10 w-full rounded-[16px] bg-spark-lime text-[13px] font-black text-black">
          확인
        </button>
      </section>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 py-1 text-[13px]">
      <Icon size={14} className="text-spark-lime" />
      <span className="w-11 shrink-0 text-[11px] font-black text-white/40">{label}</span>
      <span className="font-bold text-white/75">{value}</span>
    </div>
  );
}

function getMeetupDetailHref(meetup: LightningMeetup) {
  return `/groups/${meetup.sourceId ?? meetup.id}`;
}

function formatDistance(distanceM: number) {
  if (distanceM >= 1000) {
    return `${(distanceM / 1000).toFixed(1)}km`;
  }

  return `${distanceM}m`;
}
