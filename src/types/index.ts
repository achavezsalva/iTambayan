export interface User {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  photoURL?: string;
  coverPhoto?: string;
  bio?: string;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  author: Partial<User>;
  content: string;
  mediaUrls?: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  hasLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  userPhoto?: string;
  userName: string;
  imageUrl: string;
  createdAt: string;
}
