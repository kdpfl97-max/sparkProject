import Link from "next/link";

export default function SparkPage() {
  return (
    <main>
      <p className="text-sm font-semibold text-spark-lime">START</p>
      <h1 className="mt-3 text-4xl font-black">spark</h1>
      <div className="mt-8 grid gap-4">
        <Link href="/spark/solo" className="rounded-[28px] bg-spark-lime p-6 text-left text-2xl font-black text-black">
          혼자운동
        </Link>
        <Link href="/spark/group" className="rounded-[28px] bg-spark-purple p-6 text-left text-2xl font-black text-white">
          모임운동
        </Link>
      </div>
      <section className="mt-5 rounded-[28px] bg-card p-5">
        <p className="text-sm font-bold text-white/55">추천 흐름</p>
        <h2 className="mt-2 text-xl font-black">성향과 레벨에 맞는 운동을 바로 시작해요.</h2>
      </section>
    </main>
  );
}
