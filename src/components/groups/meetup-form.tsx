"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveMeetup } from "@/shared/data-access/client-meetup-store";
import type { ActivityType, GenderPolicy, Meetup, MeetupLevel, PriceType } from "@/shared/types";

const activityOptions: { label: string; value: ActivityType }[] = [
  { label: "러닝", value: "running" },
  { label: "라이딩", value: "riding" },
  { label: "걷기", value: "walking" },
  { label: "헬스", value: "gym" },
  { label: "등산", value: "hiking" },
  { label: "자유 운동", value: "free" },
];

const levelOptions: { label: string; value: MeetupLevel }[] = [
  { label: "입문", value: "beginner" },
  { label: "초급", value: "easy" },
  { label: "중급", value: "medium" },
  { label: "고급", value: "hard" },
];

const genderOptions: { label: string; value: GenderPolicy }[] = [
  { label: "전체", value: "all" },
  { label: "여성 전용", value: "women_only" },
  { label: "남성 전용", value: "men_only" },
];

type MeetupFormState = {
  title: string;
  activityType: ActivityType;
  level: MeetupLevel;
  startAt: string;
  capacity: string;
  priceType: PriceType;
  price: string;
  address: string;
  genderPolicy: GenderPolicy;
  ageRange: string;
  supplies: string;
};

function toLocalDatetimeValue(value: string) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function getInitialState(meetup?: Meetup): MeetupFormState {
  return {
    title: meetup?.title ?? "",
    activityType: meetup?.activityType ?? "running",
    level: meetup?.level ?? "easy",
    startAt: meetup ? toLocalDatetimeValue(meetup.startAt) : "",
    capacity: String(meetup?.capacity ?? 8),
    priceType: meetup?.priceType ?? "free",
    price: String(meetup?.price ?? ""),
    address: meetup?.address ?? "",
    genderPolicy: meetup?.genderPolicy ?? "all",
    ageRange: meetup?.ageRange ?? "전체",
    supplies: meetup?.supplies.join(", ") ?? "물, 운동복",
  };
}

export function MeetupForm({ initialMeetup }: { initialMeetup?: Meetup }) {
  const router = useRouter();
  const [form, setForm] = useState(() => getInitialState(initialMeetup));
  const [error, setError] = useState("");

  const isEditing = Boolean(initialMeetup);

  const canSubmit = useMemo(() => {
    return form.title.trim() && form.startAt && form.address.trim() && Number(form.capacity) > 0;
  }, [form.address, form.capacity, form.startAt, form.title]);

  function update<K extends keyof MeetupFormState>(key: K, value: MeetupFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setError("모임 제목, 일정, 장소, 모집 인원을 확인해주세요.");
      return;
    }

    const meetup: Meetup = {
      id: initialMeetup?.id ?? `meetup-local-${Date.now()}`,
      title: form.title.trim(),
      activityType: form.activityType,
      level: form.level,
      startAt: new Date(form.startAt).toISOString(),
      capacity: Number(form.capacity),
      participantCount: initialMeetup?.participantCount ?? 1,
      priceType: form.priceType,
      price: form.priceType === "paid" ? Number(form.price || 0) : undefined,
      locationType: "user_place",
      address: form.address.trim(),
      lat: initialMeetup?.lat ?? 37.5446,
      lng: initialMeetup?.lng ?? 127.0374,
      genderPolicy: form.genderPolicy,
      ageRange: form.ageRange.trim() || "전체",
      hostId: initialMeetup?.hostId ?? "user-me",
      hostName: initialMeetup?.hostName ?? "나",
      hostTrustScore: initialMeetup?.hostTrustScore ?? 90,
      supplies: form.supplies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      status: "open",
    };

    saveMeetup(meetup);
    router.push(`/groups/${meetup.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="모임 제목">
        <input
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="예: 성수 라이트 라이드"
          className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none focus:border-spark-lime"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="운동 종목">
          <select
            value={form.activityType}
            onChange={(event) => update("activityType", event.target.value as ActivityType)}
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none"
          >
            {activityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="난이도">
          <select
            value={form.level}
            onChange={(event) => update("level", event.target.value as MeetupLevel)}
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none"
          >
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="일정">
        <input
          type="datetime-local"
          value={form.startAt}
          onChange={(event) => update("startAt", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none focus:border-spark-lime"
        />
      </Field>

      <Field label="장소">
        <input
          value={form.address}
          onChange={(event) => update("address", event.target.value)}
          placeholder="예: 서울숲 4번 출구"
          className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none focus:border-spark-lime"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="모집 인원">
          <input
            type="number"
            min="1"
            value={form.capacity}
            onChange={(event) => update("capacity", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none"
          />
        </Field>
        <Field label="비용">
          <select
            value={form.priceType}
            onChange={(event) => update("priceType", event.target.value as PriceType)}
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none"
          >
            <option value="free">무료</option>
            <option value="paid">유료</option>
          </select>
        </Field>
      </div>

      {form.priceType === "paid" && (
        <Field label="참가비">
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => update("price", event.target.value)}
            placeholder="예: 10000"
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none"
          />
        </Field>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="성별 기준">
          <select
            value={form.genderPolicy}
            onChange={(event) => update("genderPolicy", event.target.value as GenderPolicy)}
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none"
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="연령대">
          <input
            value={form.ageRange}
            onChange={(event) => update("ageRange", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none"
          />
        </Field>
      </div>

      <Field label="준비물">
        <input
          value={form.supplies}
          onChange={(event) => update("supplies", event.target.value)}
          placeholder="쉼표로 구분"
          className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold outline-none"
        />
      </Field>

      {error && <p className="rounded-2xl bg-red-500/15 p-3 text-sm font-bold text-red-200">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-full bg-spark-lime px-5 py-4 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-45"
      >
        {isEditing ? "모임 수정하기" : "모임 만들기"}
      </button>
    </form>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-white/70">{label}</span>
      {children}
    </label>
  );
}
