export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type LocationStatus = "unknown" | "granted" | "denied";

export type StoredLocationPreference =
  | {
      status: "granted";
      latitude: number;
      longitude: number;
      updatedAt: string;
    }
  | {
      status: "denied";
      updatedAt: string;
    };
