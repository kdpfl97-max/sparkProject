import type { Meetup } from "@/shared/types";

const CUSTOM_MEETUPS_KEY = "spark.customMeetups";
const DELETED_MEETUPS_KEY = "spark.deletedMeetupIds";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadCustomMeetups() {
  return readJson<Meetup[]>(CUSTOM_MEETUPS_KEY, []);
}

export function loadDeletedMeetupIds() {
  return readJson<string[]>(DELETED_MEETUPS_KEY, []);
}

export function getClientMeetups(seedMeetups: Meetup[]) {
  const deletedIds = new Set(loadDeletedMeetupIds());
  const customMeetups = loadCustomMeetups();
  const customIds = new Set(customMeetups.map((meetup) => meetup.id));

  return [
    ...seedMeetups.filter((meetup) => !deletedIds.has(meetup.id) && !customIds.has(meetup.id)),
    ...customMeetups,
  ];
}

export function saveMeetup(meetup: Meetup) {
  const customMeetups = loadCustomMeetups();
  const existingIndex = customMeetups.findIndex((item) => item.id === meetup.id);

  if (existingIndex >= 0) {
    customMeetups[existingIndex] = meetup;
  } else {
    customMeetups.unshift(meetup);
  }

  writeJson(CUSTOM_MEETUPS_KEY, customMeetups);
  return meetup;
}

export function deleteMeetup(meetupId: string) {
  const customMeetups = loadCustomMeetups();
  const nextCustomMeetups = customMeetups.filter((meetup) => meetup.id !== meetupId);
  writeJson(CUSTOM_MEETUPS_KEY, nextCustomMeetups);

  const deletedIds = loadDeletedMeetupIds();
  if (!deletedIds.includes(meetupId)) {
    writeJson(DELETED_MEETUPS_KEY, [...deletedIds, meetupId]);
  }
}
