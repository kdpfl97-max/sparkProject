import {
  activityLogs,
  adPlacements,
  challenges,
  meetups,
  partnerLocations,
  partners,
  partnerServices,
  userHealthSummary,
} from "@/shared/data/mock-data";

export function getHomeDashboardData() {
  const activeAd = adPlacements.find((ad) => ad.placement === "home" && ad.status === "active");

  return {
    health: userHealthSummary,
    recommendedMeetups: meetups.filter((meetup) => meetup.status === "open").slice(0, 2),
    recentLogs: activityLogs.slice(0, 2),
    challenges: challenges.filter((challenge) => challenge.status === "joined"),
    ad: activeAd,
    adPartner: activeAd ? partners.find((partner) => partner.id === activeAd.partnerId) : undefined,
  };
}

export function getGroupsData() {
  return {
    meetups,
    partnerLocations: partnerLocations.filter((location) => location.meetupExposure),
    partners,
  };
}

export function getPartnerById(partnerId: string) {
  return partners.find((partner) => partner.id === partnerId);
}

export function getPartnerLocationById(locationId: string) {
  return partnerLocations.find((location) => location.id === locationId);
}

export function getPartnerServices(partnerId: string) {
  return partnerServices.filter((service) => service.partnerId === partnerId);
}
