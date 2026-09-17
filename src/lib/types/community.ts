export type CommunityComment = {
  id: string;
  author: string;
  region: string;
  message: string;
  postedAt: string; // ISO
};

export type CommunityThread = {
  id: string;
  author: string;
  region: string;
  message: string;
  postedAt: string; // ISO
  viewCount: number;
  comments: CommunityComment[];
  isOwn?: boolean;
};
