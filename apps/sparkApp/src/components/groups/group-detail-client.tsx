"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMeetup, getClientMeetups } from "@/shared/data-access/client-meetup-store";
import type { Meetup, Partner } from "@/shared/types";
import { activityLabels, genderLabels, levelLabels } from "./meetup-labels";

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

  useEffect(() => {
    queueMicrotask(() => {
      setMeetups(getClientMeetups(seedMeetups));
      setReady(true);
    });
  }, [seedMeetups]);

  const meetup = useMemo(() => meetups.find((item) => item.id === groupId), [groupId, meetups]);

  if (!ready) {
    return (
      <main>
        <p className="text-sm font-semibold text-spark-lime">GROUP DETAIL</p>
        <h1 className="mt-3 text-4xl font-black">모임을 불러오는 중</h1>
      </main>
    );
  }

  if (!meetup) {
    return (
      <main>
        <p className="text-sm font-semibold text-spark-lime">GROUP DETAIL</p>
        <h1 className="mt-3 text-4xl font-black">모임을 찾을 수 없어요</h1>
      </main>
    );
  }

  const partner = meetup.partnerId
    ? partners.find((item) => item.id === meetup.partnerId)
    : undefined;

  function handleDelete() {
    if (!window.confirm("이 모임을 삭제할까요?")) return;
    deleteMeetup(groupId);
    router.push("/groups");
    router.refresh();
  }

  return (
    <main>
      <p className="text-sm font-semibold text-spark-lime">GROUP DETAIL</p>
      <h1 className="mt-3 text-4xl font-black">{meetup.title}</h1>
      <section className="mt-8 rounded-[28px] bg-card p-5">
        <p className="text-sm font-bold text-white/55">장소</p>
        <h2 className="mt-2 text-xl font-black">{meetup.address}</h2>
        {partner && <p className="mt-2 text-sm text-spark-lime">{partner.name} 연동 장소</p>}
      </section>
      <section className="mt-4 grid grid-cols-3 gap-3">
        <Info label="인원" value={`${meetup.participantCount}/${meetup.capacity}`} />
        <Info label="난이도" value={levelLabels[meetup.level]} />
        <Info label="신뢰도" value={`${meetup.hostTrustScore}`} />
      </section>
      <section className="mt-4 rounded-[28px] bg-card p-5">
        <div className="grid gap-3 text-sm font-bold text-white/70">
          <p>종목: {activityLabels[meetup.activityType]}</p>
          <p>성별 기준: {genderLabels[meetup.genderPolicy]}</p>
          <p>연령대: {meetup.ageRange ?? "전체"}</p>
          <p>비용: {meetup.priceType === "free" ? "무료" : `${meetup.price?.toLocaleString()}원`}</p>
          <p>준비물: {meetup.supplies.join(", ")}</p>
        </div>
      </section>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href={`/groups/${meetup.id}/edit`}
          className="rounded-full bg-white px-5 py-4 text-center text-sm font-black text-black"
        >
          수정
        </Link>
        <button
          onClick={handleDelete}
          className="rounded-full bg-spark-lime px-5 py-4 text-sm font-black text-black"
        >
          삭제
        </button>
      </div>
      <button className="mt-3 w-full rounded-full bg-spark-purple px-5 py-4 text-sm font-black text-white">
        참여 신청
      </button>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card p-4">
      <p className="text-xs font-bold text-white/45">{label}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}
