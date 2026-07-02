import Image from "next/image";

export type SparkLevel = 1 | 2 | 3 | 4 | 5;
export type CharacterState = "default" | "workout" | "paused" | "complete";

export const CURRENT_SPARK_LEVEL: SparkLevel = 3;

const levelNames: Record<SparkLevel, string> = {
  1: "꼬마 불씨",
  2: "스타터 타이거",
  3: "버닝 타이거",
  4: "스파크 마스터",
  5: "네오 타이거",
};

const characterSources: Record<SparkLevel, Record<CharacterState, string>> = {
  1: { default: "/characters/level-1-welcome.png", workout: "/characters/level-1-running.png", paused: "/characters/level-1-tired.png", complete: "/characters/level-1-complete.png" },
  2: { default: "/characters/level-2-default.png", workout: "/characters/level-2-workout.png", paused: "/characters/level-2-stretch.png", complete: "/characters/level-2-complete.png" },
  3: { default: "/characters/level-2-default.png", workout: "/characters/level-2-workout.png", paused: "/characters/level-2-stretch.png", complete: "/characters/level-3-complete.png" },
  4: { default: "/characters/level-5-coach.png", workout: "/characters/level-5-coach.png", paused: "/characters/level-5-coach.png", complete: "/characters/level-5-complete.png" },
  5: { default: "/characters/level-5-coach.png", workout: "/characters/level-5-coach.png", paused: "/characters/level-5-coach.png", complete: "/characters/level-5-complete.png" },
};

export function getSparkLevelName(level: SparkLevel) {
  return levelNames[level];
}

export function SparkCharacter({
  level,
  state = "default",
  size = 72,
  className = "",
  priority = false,
}: {
  level: SparkLevel;
  state?: CharacterState;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={characterSources[level][state]}
      alt={`${levelNames[level]} 캐릭터`}
      width={size}
      height={size}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
