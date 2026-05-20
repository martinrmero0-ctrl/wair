export type ProfileSizes = {
  top: string;
  waist: string;
  shoe: string;
};

export type ConnectedAccounts = {
  tiktok: boolean;
  instagram: boolean;
};

export type NotificationSettings = {
  dailyDeck: boolean;
  restockAlerts: boolean;
  nearbySpots: boolean;
};

export type UserProfile = {
  sizes: ProfileSizes;
  /** Active aesthetic tags */
  aesthetics: string[];
  /** User-added tags (stay visible when toggled off) */
  customTags: string[];
  budgetMax: number;
  connected: ConnectedAccounts;
  notifications: NotificationSettings;
};
