import type { ActivityType, GenderPolicy, MeetupLevel, PriceType } from "@/shared/types";

export const activityLabels: Record<ActivityType, string> = {
  running: "러닝",
  riding: "라이딩",
  walking: "걷기",
  gym: "헬스",
  hiking: "등산",
  free: "자유 운동",
  custom: "직접입력",
};

export const levelLabels: Record<MeetupLevel, string> = {
  beginner: "입문",
  easy: "초급",
  medium: "중급",
  hard: "고급",
};

export const genderLabels: Record<GenderPolicy, string> = {
  all: "전체",
  women_only: "여성 전용",
  men_only: "남성 전용",
};

export const priceLabels: Record<PriceType, string> = {
  free: "무료",
  paid: "유료",
};
