import { GroupDetailClient } from "@/components/groups/group-detail-client";
import { getGroupsData } from "@/shared/data-access/spark-data";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const { meetups, partners } = getGroupsData();

  return <GroupDetailClient groupId={groupId} seedMeetups={meetups} partners={partners} />;
}
