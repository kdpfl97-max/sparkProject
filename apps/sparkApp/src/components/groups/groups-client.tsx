"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getClientMeetups } from "@/shared/data-access/client-meetup-store";
import type { Meetup, Partner, PartnerLocation } from "@/shared/types";
import { activityLabels, levelLabels } from "./meetup-labels";

type FilterKey = "all" | "free" | "partner" | "easy";

export function GroupsClient({
  seedMeetups,
  partnerLocations,
  partners,
}: {
  seedMeetups: Meetup[];
  partnerLocations: PartnerLocation[];
  partners: Partner[];
}) {
  const [meetups, setMeetups] = useState(seedMeetups);
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    queueMicrotask(() => {
      setMeetups(getClientMeetups(seedMeetups));
    });
  }, [seedMeetups]);

  const filteredMeetups = useMemo(() => {
    if (filter === "free") return meetups.filter((meetup) => meetup.priceType === "free");
    if (filter === "partner") {
      return meetups.filter((meetup) => meetup.locationType === "partner_location");
    }
    if (filter === "easy") {
      return meetups.filter((meetup) => meetup.level === "beginner" || meetup.level === "easy");
    }
    return meetups;
  }, [filter, meetups]);

  return (
    <main>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-spark-lime">NEARBY GROUPS</p>
          <h1 className="mt-3 text-4xl font-black">모임 지도</h1>
        </div>
        <Link href="/groups/new" className="rounded-full bg-spark-lime px-4 py-3 text-sm font-black text-black">
          만들기
        </Link>
      </div>

      <section className="mt-8 rounded-[32px] border border-white/10 bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-white/60">협력사 장소 핀</p>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
            {partnerLocations.length}곳 노출
          </span>
        </div>
        <div className="relative mt-5 h-72 overflow-hidden rounded-[26px] bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_28%,rgba(223,255,76,0.28),transparent_18%),radial-gradient(circle_at_74%_55%,rgba(142,110,207,0.35),transparent_22%)]" />
          {partnerLocations.map((location, index) => (
            <div
              key={location.id}
              className="absolute max-w-[145px] truncate rounded-full bg-spark-lime px-3 py-2 text-xs font-black text-black shadow-[0_0_24px_rgba(223,255,76,0.45)]"
              style={{
                left: `${12 + index * 27}%`,
                top: `${24 + (index % 2) * 34}%`,
              }}
            >
              {location.name}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 grid grid-cols-4 gap-2">
        {[
          ["all", "전체"],
          ["free", "무료"],
          ["partner", "협력사"],
          ["easy", "초급"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key as FilterKey)}
            className={[
              "rounded-full px-3 py-3 text-xs font-bold",
              filter === key ? "bg-spark-lime text-black" : "bg-white/8 text-white/75",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </section>

      <section className="mt-7">
        <h2 className="text-xl font-black">모집 중인 모임</h2>
        <div className="mt-3 space-y-3">
          {filteredMeetups.map((meetup) => {
            const partner = meetup.partnerId
              ? partners.find((item) => item.id === meetup.partnerId)
              : undefined;

            return (
              <Link
                href={`/groups/${meetup.id}`}
                key={meetup.id}
                className="block rounded-[26px] border border-white/10 bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-spark-lime">
                      {activityLabels[meetup.activityType]} · {levelLabels[meetup.level]}
                    </p>
                    <h3 className="mt-2 text-lg font-black">{meetup.title}</h3>
                    <p className="mt-2 text-sm leading-5 text-white/55">
                      {meetup.address}
                      {partner ? ` · ${partner.name}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                    {meetup.participantCount}/{meetup.capacity}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white/70">
                    {meetup.priceType === "free" ? "무료" : `${meetup.price?.toLocaleString()}원`}
                  </span>
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white/70">
                    {meetup.ageRange}
                  </span>
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white/70">
                    호스트 신뢰도 {meetup.hostTrustScore}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
