"use client";

import Image from "next/image";
import { useState, type TouchEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ONBOARDING_COMPLETE_KEY = "spark-onboarding-complete";

const slides = [
  {
    id: "discover",
    eyebrow: "DISCOVER",
    title: "내 주변의 운동을\n발견해요",
    description: "거리, 시간, 종목과 운동 레벨에 맞는 모임을 빠르게 찾아보세요.",
    image: "/characters/onboarding-map.png",
    imageAlt: "지도를 보며 주변 운동 모임을 찾는 꼬마 불씨",
    imageClassName: "h-[290px] w-[290px]",
  },
  {
    id: "start",
    eyebrow: "START",
    title: "혼자도, 함께도\n바로 시작해요",
    description: "러닝부터 라이딩까지 실시간 기록을 남기고 모임원과 함께 움직여요.",
    image: "/characters/level-1-running.png",
    imageAlt: "운동을 시작하며 달리는 꼬마 불씨",
    imageClassName: "h-[270px] w-[270px]",
  },
  {
    id: "grow",
    eyebrow: "GROW",
    title: "운동할수록\nSPARK가 성장해요",
    description: "꾸준한 운동, 챌린지와 모임 참여로 나만의 캐릭터를 성장시켜요.",
    image: "/characters/onboarding-together.png",
    imageAlt: "함께 운동하며 성장한 SPARK 캐릭터들",
    imageClassName: "h-[300px] w-[340px]",
  },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [slideIndex, setSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const slide = slides[slideIndex];
  const isLastSlide = slideIndex === slides.length - 1;

  const finishOnboarding = () => {
    window.localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
    router.replace("/home");
  };

  const showNextSlide = () => {
    if (isLastSlide) {
      finishOnboarding();
      return;
    }
    setSlideIndex((current) => current + 1);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;

    if (distance < -48 && !isLastSlide) setSlideIndex((current) => current + 1);
    if (distance > 48 && slideIndex > 0) setSlideIndex((current) => current - 1);
    setTouchStartX(null);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[393px] flex-col overflow-hidden bg-[#0A0A0B] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(18px,env(safe-area-inset-top))] text-white">
      <header className="flex h-10 items-center justify-between">
        <p className="text-sm font-black">SPARK</p>
        <button
          type="button"
          onClick={finishOnboarding}
          className="h-9 rounded-full px-3 text-[11px] font-black text-white/48 transition hover:bg-white/8 hover:text-white"
        >
          건너뛰기
        </button>
      </header>

      <section
        className="flex min-h-0 flex-1 flex-col"
        onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <div key={slide.id} className="spark-onboarding-in flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <div className="relative flex h-[330px] w-full items-center justify-center overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.03]">
            <div className="absolute inset-x-10 bottom-4 h-10 rounded-full bg-spark-lime/10 blur-2xl" />
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              width={420}
              height={420}
              priority
              className={`relative z-10 object-contain ${slide.imageClassName}`}
            />
          </div>

          <div className="mt-7 px-2">
            <p className="text-[11px] font-black text-spark-lime">{slide.eyebrow}</p>
            <h1 className="mt-2 whitespace-pre-line text-[29px] font-black leading-[1.12]">{slide.title}</h1>
            <p className="mx-auto mt-3 max-w-[310px] text-[13px] font-bold leading-5 text-white/52">{slide.description}</p>
          </div>
        </div>
      </section>

      <footer className="shrink-0 pt-5">
        <div className="mb-5 flex items-center justify-center gap-1.5" aria-label={`${slideIndex + 1}/${slides.length} 단계`}>
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSlideIndex(index)}
              aria-label={`${index + 1}번째 온보딩 보기`}
              aria-current={slideIndex === index ? "step" : undefined}
              className={`h-1.5 rounded-full transition-all ${slideIndex === index ? "w-7 bg-spark-lime" : "w-1.5 bg-white/20"}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {slideIndex > 0 && (
            <button
              type="button"
              onClick={() => setSlideIndex((current) => current - 1)}
              className="grid size-13 shrink-0 place-items-center rounded-[18px] bg-white/8 text-white"
              aria-label="이전 온보딩"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <button
            type="button"
            onClick={showNextSlide}
            className="flex h-13 flex-1 items-center justify-center gap-1 rounded-[18px] bg-spark-lime text-sm font-black text-black shadow-[0_0_28px_rgba(223,255,76,0.18)]"
          >
            {isLastSlide ? "SPARK 시작하기" : "다음"}
            {!isLastSlide && <ChevronRight size={17} />}
          </button>
        </div>
      </footer>
    </main>
  );
}
