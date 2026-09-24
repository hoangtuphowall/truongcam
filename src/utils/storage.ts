import {
  INITIAL_PEOPLE,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_CHATS,
  INITIAL_GROUPS,
  INITIAL_FRIEND_REQUESTS,
  INITIAL_FRIEND_SUGGESTIONS,
  INITIAL_FRIENDS_ALL,
  INITIAL_USER,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import { Person, Post, Story, Reel, Chat, Group, FriendRequest, UserProfile, NotificationItem } from '../types';

const STORAGE_PREFIX = 'hive_app_v2_';

function load<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to read from localStorage: ${key}`, e);
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save to localStorage: ${key}`, e);
  }
}

export const Storage = {
  getPeople: (): Person[] => load<Person[]>('people', INITIAL_PEOPLE),
  savePeople: (p: Person[]) => save('people', p),

  getUser: (): UserProfile => load<UserProfile>('user', INITIAL_USER),
  saveUser: (u: UserProfile) => save('user', u),

  getPosts: (): Post[] => load<Post[]>('posts', INITIAL_POSTS),
  savePosts: (posts: Post[]) => save('posts', posts),

  getStories: (): Story[] => load<Story[]>('stories', INITIAL_STORIES),
  saveStories: (s: Story[]) => save('stories', s),

  getReels: (): Reel[] => load<Reel[]>('reels', INITIAL_REELS),
  saveReels: (r: Reel[]) => save('reels', r),

  getChats: (): Chat[] => load<Chat[]>('chats', INITIAL_CHATS),
  saveChats: (c: Chat[]) => save('chats', c),

  getGroups: (): Group[] => load<Group[]>('groups', INITIAL_GROUPS),
  saveGroups: (g: Group[]) => save('groups', g),

  getFriendRequests: (): FriendRequest[] => load<FriendRequest[]>('friend_requests', INITIAL_FRIEND_REQUESTS),
  saveFriendRequests: (fr: FriendRequest[]) => save('friend_requests', fr),

  getFriendSuggestions: (): Array<{ id: number; mutual: number }> =>
    load<Array<{ id: number; mutual: number }>>('friend_suggestions', INITIAL_FRIEND_SUGGESTIONS),
  saveFriendSuggestions: (fs: Array<{ id: number; mutual: number }>) => save('friend_suggestions', fs),

  getFriendsAll: (): number[] => load<number[]>('friends_all', INITIAL_FRIENDS_ALL),
  saveFriendsAll: (fa: number[]) => save('friends_all', fa),

  getNotifications: (): NotificationItem[] => load<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS),
  saveNotifications: (n: NotificationItem[]) => save('notifications', n),

  resetAll: () => {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k);
      });
    } catch (e) {
      console.warn(e);
    }
  }
};
