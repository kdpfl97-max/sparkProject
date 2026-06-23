import { GroupsClient } from "@/components/groups/groups-client";
import { getGroupsData } from "@/shared/data-access/spark-data";

export default function GroupsPage() {
  const { meetups, partnerLocations, partners } = getGroupsData();

  return (
    <GroupsClient seedMeetups={meetups} partnerLocations={partnerLocations} partners={partners} />
  );
}
