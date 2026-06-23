export type ActivityType =
  | "running"
  | "riding"
  | "walking"
  | "gym"
  | "hiking"
  | "free"
  | "custom";

export type ActivityMode = "cardio" | "strength" | "versus";
export type MeetupLevel = "beginner" | "easy" | "medium" | "hard";
export type PriceType = "free" | "paid";
export type LocationType = "user_place" | "partner_location";
export type GenderPolicy = "all" | "women_only" | "men_only";

export interface Partner {
  id: string;
  name: string;
  category: string;
  status: "pending" | "active" | "inactive" | "suspended";
  description: string;
  rating: number;
  reviewCount: number;
  contact: string;
  imageUrl?: string;
}

export interface PartnerService {
  id: string;
  partnerId: string;
  name: string;
  category: string;
  price: number;
  description: string;
  promotion?: {
    discount: number;
    endDate: string;
  };
}

export interface PartnerLocation {
  id: string;
  partnerId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  operatingHours: string;
  meetupExposure: boolean;
  exposureRadiusKm: number;
}

export interface Meetup {
  id: string;
  title: string;
  activityType: ActivityType;
  level: MeetupLevel;
  startAt: string;
  capacity: number;
  participantCount: number;
  priceType: PriceType;
  price?: number;
  locationType: LocationType;
  address: string;
  lat: number;
  lng: number;
  genderPolicy: GenderPolicy;
  ageRange?: string;
  hostId: string;
  hostName: string;
  hostTrustScore: number;
  supplies: string[];
  partnerId?: string;
  locationId?: string;
  status: "draft" | "open" | "full" | "cancelled" | "completed";
}

export interface UserHealthSummary {
  steps: number;
  calories: number;
  activeMinutes: number;
  streakDays: number;
  routineTitle: string;
  routineProgress: number;
}

export interface ActivityLog {
  id: string;
  activityType: ActivityType;
  mode: ActivityMode;
  title: string;
  startedAt: string;
  durationMinutes: number;
  distanceKm?: number;
  calories: number;
  averageHeartRate?: number;
  elevationGainM?: number;
  meetupId?: string;
}

export interface Challenge {
  id: string;
  title: string;
  type: "personal" | "friend_rank" | "local_rank" | "event";
  description: string;
  progress: number;
  target: number;
  unit: string;
  status: "available" | "joined" | "completed";
}

export interface AdPlacement {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  placement: "home" | "groups" | "partner_detail";
  startsAt: string;
  endsAt: string;
  status: "draft" | "active" | "ended";
}
