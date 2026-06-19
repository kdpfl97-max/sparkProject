import { activityLogs, meetups } from "@/shared/data/mock-data";

export default function ProfilePage() {
  return (
    <main>
      <p className="text-sm font-semibold text-spark-lime">MY SPARK</p>
      <h1 className="mt-3 text-4xl font-black">마이페이지</h1>
      <section className="mt-8 rounded-[28px] bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-[22px] bg-gradient-to-br from-spark-lime to-spark-purple text-xl font-black text-black">
            SP
          </div>
          <div>
            <p className="text-sm font-bold text-white/50">라이더</p>
            <h2 className="text-2xl font-black">ezen님의 기록</h2>
          </div>
        </div>
      </section>
      <section className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="운동 기록" value={`${activityLogs.length}개`} />
        <Metric label="참여 가능 모임" value={`${meetups.length}개`} />
      </section>
      <section className="mt-4 rounded-[28px] bg-card p-5">
        <h2 className="text-xl font-black">관리 메뉴</h2>
        <div className="mt-4 grid gap-2 text-sm font-bold text-white/70">
          <p>운동 기록 피드</p>
          <p>참여 모임 관리</p>
          <p>배지와 친구</p>
          <p>프로필/알림 설정</p>
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
