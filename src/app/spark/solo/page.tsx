import { SoloWorkoutFlow } from "@/components/workout/solo-workout-flow";

export default async function SparkSoloPage({
  searchParams,
}: {
  searchParams: Promise<{ activity?: string }>;
}) {
  const { activity } = await searchParams;
  return <SoloWorkoutFlow initialActivity={activity} />;
}
