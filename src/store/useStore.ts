import { create } from 'zustand';
import { User, Post } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  setLoading: (loading: boolean) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  isLoading: false,
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  setLoading: (loading) => set({ isLoading: loading }),
  updatePost: (postId, updates) => set((state) => ({
    posts: state.posts.map((p) => p.id === postId ? { ...p, ...updates } : p)
  })),
}));
