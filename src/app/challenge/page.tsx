import { challenges } from "@/shared/data/mock-data";

export default function ChallengePage() {
  return (
    <main>
      <p className="text-sm font-semibold text-spark-lime">CHALLENGE</p>
      <h1 className="mt-3 text-4xl font-black">챌린지</h1>
      <section className="mt-8 space-y-3">
        {challenges.map((challenge) => (
          <article key={challenge.id} className="rounded-[28px] bg-card p-5">
            <p className="text-xs font-black text-spark-lime">{challenge.type}</p>
            <h2 className="mt-2 text-xl font-black">{challenge.title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">{challenge.description}</p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-spark-lime"
                style={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}
              />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
