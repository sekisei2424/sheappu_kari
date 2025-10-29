export type User = {
  id: string;
  name: string; // 表示名
  username: string; // @ユーザー名
  avatarUrl: string;
};

export type Post = {
  id: string;
  author: User;
  content: string;
  createdAt: string;
};

export type UserProfile = {
  id: string;
  auth_id: string;
  name: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  following?: number;
  followers?: number;
};