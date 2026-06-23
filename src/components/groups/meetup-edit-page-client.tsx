"use client";

import { useEffect, useMemo, useState } from "react";
import { getClientMeetups } from "@/shared/data-access/client-meetup-store";
import type { Meetup } from "@/shared/types";
import { MeetupForm } from "./meetup-form";

export function MeetupEditPageClient({
  groupId,
  seedMeetups,
}: {
  groupId: string;
  seedMeetups: Meetup[];
}) {
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
        <p className="text-sm font-semibold text-spark-lime">EDIT GROUP</p>
        <h1 className="mt-3 text-4xl font-black">모임을 불러오는 중</h1>
      </main>
    );
  }

  if (!meetup) {
    return (
      <main>
        <p className="text-sm font-semibold text-spark-lime">EDIT GROUP</p>
        <h1 className="mt-3 text-4xl font-black">수정할 모임을 찾을 수 없어요</h1>
      </main>
    );
  }

  return (
    <main>
      <p className="text-sm font-semibold text-spark-lime">EDIT GROUP</p>
      <h1 className="mt-3 text-4xl font-black">모임 수정</h1>
      <section className="mt-8 rounded-[28px] bg-card p-5">
        <MeetupForm initialMeetup={meetup} />
      </section>
    </main>
  );
}
