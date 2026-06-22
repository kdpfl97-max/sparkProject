import { MeetupEditPageClient } from "@/components/groups/meetup-edit-page-client";
import { getGroupsData } from "@/shared/data-access/spark-data";

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const { meetups } = getGroupsData();

  return <MeetupEditPageClient groupId={groupId} seedMeetups={meetups} />;
}
