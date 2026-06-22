import { MeetupForm } from "@/components/groups/meetup-form";

export default function NewGroupPage() {
  return (
    <main>
      <p className="text-sm font-semibold text-spark-lime">CREATE GROUP</p>
      <h1 className="mt-3 text-4xl font-black">모임 만들기</h1>
      <section className="mt-8 rounded-[28px] bg-card p-5">
        <MeetupForm />
      </section>
    </main>
  );
}
