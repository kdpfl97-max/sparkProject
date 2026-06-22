import Link from "next/link";
import { getHomeDashboardData } from "@/shared/data-access/spark-data";

export default function SparkGroupPage() {
  const { recommendedMeetups } = getHomeDashboardData();

  return (
    <main>
      <p className="text-sm font-semibold text-spark-lime">GROUP ACTIVITY</p>
      <h1 className="mt-3 text-4xl font-black">모임운동</h1>
      <section className="mt-8 space-y-3">
        {recommendedMeetups.map((meetup) => (
          <Link
            href={`/groups/${meetup.id}`}
            key={meetup.id}
            className="block rounded-[26px] bg-card p-5"
          >
            <p className="text-xs font-black text-spark-lime">내 성향에 맞는 추천</p>
            <h2 className="mt-2 text-xl font-black">{meetup.title}</h2>
            <p className="mt-2 text-sm text-white/55">
              {meetup.address} · {meetup.participantCount}/{meetup.capacity}명
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
