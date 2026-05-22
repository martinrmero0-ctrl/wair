export type SocialPostType = "bought" | "rated" | "selling";

export type SocialComment = {
  id: string;
  username: string;
  text: string;
  timestamp: string;
};

export type SocialPost = {
  id: string;
  username: string;
  type: SocialPostType;
  /** Item name or store name shown in the post headline */
  subject: string;
  caption: string;
  timestamp: string;
  likes: number;
  comments: SocialComment[];
  /** Selling posts only */
  price?: string;
};

export type SocialMapTab =
  | "rated"
  | "been"
  | "want-to-try"
  | "friends-recs"
  | "trending";
