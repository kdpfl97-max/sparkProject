import Link from "next/link";
import { getHomeDashboardData } from "@/shared/data-access/spark-data";

export default function HomePage() {
  const { ad, adPartner, challenges, health, recentLogs, recommendedMeetups } =
    getHomeDashboardData();

  return (
    <main className="pb-2">
      <p className="text-sm font-semibold text-spark-lime">오늘의 SPARK</p>
      <h1 className="mt-3 text-4xl font-black">홈 대시보드</h1>

      <section className="mt-8 rounded-[28px] bg-spark-lime p-5 text-black">
        <p className="text-sm font-bold">바로 시작</p>
        <h2 className="mt-2 text-3xl font-black">오늘 운동 시작하기</h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href="/spark/solo"
            className="rounded-full bg-black px-4 py-3 text-center text-sm font-black text-white"
          >
            혼자운동
          </Link>
          <Link
            href="/spark/group"
            className="rounded-full bg-white px-4 py-3 text-center text-sm font-black text-black"
          >
            모임운동
          </Link>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-3">
        <Metric label="연속" value={`${health.streakDays}일째`} />
        <Metric label="걸음수" value={health.steps.toLocaleString()} />
        <Metric label="칼로리" value={`${health.calories}kcal`} />
      </section>

      <section className="mt-4 rounded-[28px] bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-white/50">오늘 루틴</p>
            <h2 className="mt-2 text-xl font-black">{health.routineTitle}</h2>
          </div>
          <span className="rounded-full bg-spark-purple px-3 py-1 text-xs font-black">
            {health.routineProgress}%
          </span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-spark-lime" style={{ width: `${health.routineProgress}%` }} />
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-black">추천 모임</h2>
          <Link href="/groups" className="text-sm font-bold text-spark-lime">
            모두 보기
          </Link>
        </div>
        <div className="mt-3 space-y-3">
          {recommendedMeetups.map((meetup) => (
            <Link
              href={`/groups/${meetup.id}`}
              key={meetup.id}
              className="block rounded-[24px] border border-white/10 bg-card p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-black">{meetup.title}</h3>
                  <p className="mt-1 text-sm text-white/55">
                    {meetup.address} · {meetup.participantCount}/{meetup.capacity}명
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                  {meetup.level}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {ad && (
        <section className="mt-4 rounded-[28px] bg-gradient-to-br from-spark-lavender to-spark-purple p-5 text-black">
          <p className="text-xs font-black">{adPartner?.name ?? "SPARK 파트너"}</p>
          <h2 className="mt-2 text-xl font-black">{ad.title}</h2>
          <p className="mt-2 text-sm font-semibold text-black/65">{ad.description}</p>
        </section>
      )}

      <section className="mt-7">
        <h2 className="text-xl font-black">이전 운동 로그</h2>
        <div className="mt-3 space-y-3">
          {recentLogs.map((log) => (
            <article key={log.id} className="rounded-[24px] border border-white/10 bg-card p-4">
              <p className="text-xs font-bold text-spark-lime">{log.activityType}</p>
              <h3 className="mt-1 font-black">{log.title}</h3>
              <p className="mt-2 text-sm text-white/55">
                {log.durationMinutes}분 · {log.distanceKm ?? 0}km · {log.calories}kcal
              </p>
            </article>
          ))}
        </div>
        <div className="mt-4 rounded-[24px] bg-white/5 p-4">
          <p className="text-sm font-bold text-white/70">
            진행 중인 챌린지 {challenges.length}개가 오늘 운동 기록을 기다리고 있어요.
          </p>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card p-4">
      <p className="text-xs font-bold text-white/45">{label}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}
