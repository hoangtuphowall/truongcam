export interface Person {
  id: number;
  name: string;
  handle: string;
  emoji: string;
  school: string;
  bio: string;
  avatarGradient: string;
  avatarUrl?: string;
  online: boolean;
  mutualCount: number;
}

export interface Comment {
  id: string;
  personId: number;
  text: string;
  time: string;
  likes: number;
  liked?: boolean;
}

export type AestheticFont = 'display' | 'editorial' | 'grotesk' | 'hand' | 'code' | 'clean';

export interface Post {
  id: number;
  personId: number;
  type: 'text' | 'image' | 'quote';
  text: string;
  time: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  grad?: string;
  imgData?: string;
  fontChoice?: AestheticFont;
  comments: Comment[];
  commentsOpen?: boolean;
  sharesCount?: number;
}

export interface StorySlide {
  type: 'photo' | 'quote';
  grad?: string;
  imgData?: string;
  text: string;
}

export interface Story {
  id: number;
  personId: number;
  seen: boolean;
  slides: StorySlide[];
}

export interface Reel {
  id: number;
  personId: number;
  grad: string;
  imgData?: string;
  text: string;
  likes: number;
  liked: boolean;
  saved?: boolean;
  soundTrack: string;
  commentsCount: number;
}

export interface ChatMessage {
  id: string;
  me: boolean;
  personId?: number;
  text?: string;
  img?: string;
  time: string;
}

export interface Chat {
  id: number | string;
  personId?: number;
  isGroup?: boolean;
  groupName?: string;
  online?: boolean;
  unread: number;
  msgs: ChatMessage[];
}

export interface Group {
  id: number;
  name: string;
  grad: string;
  members: number;
  joined: boolean;
  desc: string;
  category: 'School' | 'College' | 'Work' | 'Interest';
  about?: string;
}

export interface FriendRequest {
  id: number;
  mutual: number;
  time: string;
}

export interface UserProfile {
  id: number;
  name: string;
  handle: string;
  emoji: string;
  school: string;
  bio: string;
  avatarGradient: string;
  avatarUrl?: string;
  friendsCount: number;
  postsCount: number;
  groupsCount: number;
  savedPostIds: number[];
  photos: string[];
}

export interface NotificationItem {
  id: string;
  personId: number;
  action: string;
  time: string;
  read: boolean;
  type: 'like' | 'comment' | 'friend' | 'group';
}

export type ScreenType = 'home' | 'explore' | 'reels' | 'chats' | 'groups' | 'friends' | 'profile' | 'apps';

export type MiniAppCategory = 'social' | 'study_ai' | 'utilities' | 'finance' | 'entertainment' | 'creative';

export interface MiniAppInfo {
  id: string;
  name: string;
  vietnameseName: string;
  category: MiniAppCategory;
  description: string;
  iconBg: string;
  iconEmoji: string;
  badge?: string;
  inspiredBy: string;
}

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverGradient: string;
  lyrics: string[];
}

export interface CanteenItem {
  id: string;
  name: string;
  price: number;
  category: 'Ăn sáng' | 'Đồ uống' | 'Ăn vặt' | 'Dụng cụ học tập';
  emoji: string;
  rating: number;
  sold: number;
  popular?: boolean;
  imageUrl?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  desc: string;
  icon: string;
  coords: string;
  status: string;
  imageUrl?: string;
}

export interface GpaGrade {
  subject: string;
  midterm: number;
  final: number;
  weight: number;
}

export interface StudentIDInfo {
  fullName: string;
  studentCode: string;
  className: string;
  academicYear: string;
  birthday: string;
  unionMember: boolean;
  status: 'Đang theo học' | 'Nghỉ hè';
  conductScore: number;
  gpa: number;
}
