export default function SparkSoloPage() {
  return (
    <main>
      <p className="text-sm font-semibold text-spark-lime">SOLO ACTIVITY</p>
      <h1 className="mt-3 text-4xl font-black">혼자운동</h1>
      <section className="mt-8 grid gap-3">
        {["러닝", "라이딩", "걷기", "헬스", "등산", "자유 운동", "직접입력"].map((item) => (
          <button key={item} className="rounded-[24px] bg-card px-5 py-4 text-left font-black">
            {item}
          </button>
        ))}
      </section>
    </main>
  );
}
