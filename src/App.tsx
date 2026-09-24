import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Storage } from './utils/storage';
import { useAuth } from './lib/auth/AuthProvider';
import { AuthScreen } from './components/auth/AuthScreen';
import * as postService from './lib/services/postService';
import { mapDbPostToAppPost } from './lib/mapSupabasePost';
import { postIdBridge } from './lib/idBridge';
import {
  Person,
  Post,
  Story,
  Reel,
  Chat,
  Group,
  FriendRequest,
  UserProfile,
  NotificationItem,
  ScreenType,
  AestheticFont,
  StorySlide,
  SongTrack
} from './types';
import { TopBar } from './components/TopBar';
import { Navigation } from './components/Navigation';
import { StoriesRow } from './components/StoriesRow';
import { StoryViewerModal } from './components/StoryViewerModal';
import { Feed } from './components/Feed';
import { ExploreView } from './components/ExploreView';
import { ReelsView } from './components/ReelsView';
import { ChatsView } from './components/ChatsView';
import { ChatConversation } from './components/ChatConversation';
import { GroupsView } from './components/GroupsView';
import { FriendsView } from './components/FriendsView';
import { ProfileView } from './components/ProfileView';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { CreateReelModal } from './components/CreateReelModal';
import { PersonProfileModal } from './components/PersonProfileModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';

// iOS Liquid Glass & THPT Cẩm Bình Super App Ecosystem Components
import { IOSControlCenter } from './components/IOSControlCenter';
import { CamHubView } from './components/CamHubView';
import { CamAIModal } from './components/CamAIModal';
import { CamMusicPlayer } from './components/CamMusicPlayer';
import { CamStudyRoomModal } from './components/CamStudyRoomModal';
import { CamPayModal } from './components/CamPayModal';
import { CamCanteenModal } from './components/CamCanteenModal';
import { CamCampusMapModal } from './components/CamCampusMapModal';
import { CamIDModal } from './components/CamIDModal';
import { CamOfficeModal } from './components/CamOfficeModal';
import { CamQuizModal } from './components/CamQuizModal';
import { CamMailModal } from './components/CamMailModal';
import { CamNewsFitnessModal } from './components/CamNewsFitnessModal';
import { CamStudioModal } from './components/CamStudioModal';
import { INITIAL_SONGS } from './data/initialData';

export default function App() {
  // Real Supabase auth/session — replaces the old hardcoded INITIAL_USER.
  const { authUser, profile, isLoading: isAuthLoading, signOut } = useAuth();

  // Core persisted state
  const [people, setPeople] = useState<Person[]>(() => Storage.getPeople());
  const [user, setUser] = useState<UserProfile>(() => Storage.getUser());
  const [posts, setPosts] = useState<Post[]>(() => Storage.getPosts());
  const [stories, setStories] = useState<Story[]>(() => Storage.getStories());
  const [reels, setReels] = useState<Reel[]>(() => Storage.getReels());
  const [chats, setChats] = useState<Chat[]>(() => Storage.getChats());
  const [groups, setGroups] = useState<Group[]>(() => Storage.getGroups());
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => Storage.getFriendRequests());
  const [friendSuggestions, setFriendSuggestions] = useState(() => Storage.getFriendSuggestions());
  const [friendsAll, setFriendsAll] = useState<number[]>(() => Storage.getFriendsAll());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => Storage.getNotifications());

  // UI state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [feedFilter, setFeedFilter] = useState<'all' | 'friends' | 'saved'>('all');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeStoryId, setActiveStoryId] = useState<number | null>(null);
  const [activeChatId, setActiveChatId] = useState<number | string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<'text' | 'image' | 'quote'>('text');
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isCreateReelOpen, setIsCreateReelOpen] = useState(false);
  const [selectedPersonModalId, setSelectedPersonModalId] = useState<number | null>(null);
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    imgUrl?: string;
    grad?: string;
    author: Person | UserProfile;
    caption?: string;
    post?: Post;
  } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // iOS Liquid Glass & Cẩm Super App States
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [activeMiniAppModal, setActiveMiniAppModal] = useState<string | null>(null);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongTrack>(INITIAL_SONGS[0]);
  const [volume, setVolume] = useState(0.7);
  const [focusMode, setFocusMode] = useState(false);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [activeOrderNotification, setActiveOrderNotification] = useState<string | null>(null);

  // Pomodoro countdown timer effect
  useEffect(() => {
    let timer: any;
    if (isPomodoroActive) {
      timer = setInterval(() => {
        setPomodoroSeconds((sec) => {
          if (sec > 0) return sec - 1;
          setPomodoroMinutes((min) => {
            if (min > 0) return min - 1;
            // Finished 25 min cycle!
            setIsPomodoroActive(false);
            showToast('⏰ Đã hoàn thành 25 phút Pomodoro ôn thi! Nghỉ ngơi 5 phút nhé.');
            return 25;
          });
          return 59;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPomodoroActive]);

  // Subtle web audio synth chord for music immersion
  useEffect(() => {
    if (!isPlayingMusic || volume === 0) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4 note
      gain.gain.setValueAtTime(volume * 0.03, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      return () => {
        try {
          osc.stop();
          ctx.close();
        } catch {}
      };
    } catch {}
  }, [isPlayingMusic, volume]);

  const handleOpenMiniApp = (appId: string) => {
    if (['chatgpt', 'gemini', 'claude'].includes(appId)) {
      setActiveMiniAppModal('ai');
    } else if (['spotify', 'apple_music'].includes(appId)) {
      setIsMusicOpen(true);
    } else if (['teams', 'zoom', 'meet', 'slack'].includes(appId)) {
      setActiveMiniAppModal('study_room');
    } else if (['momo', 'vietcombank', 'techcombank', 'mbbank', 'vnpay'].includes(appId)) {
      setActiveMiniAppModal('pay');
    } else if (['shopee', 'lazada', 'tiktok_shop', 'grab', 'be'].includes(appId)) {
      setActiveMiniAppModal('canteen');
    } else if (['google_maps'].includes(appId)) {
      setActiveMiniAppModal('maps');
    } else if (['vneid'].includes(appId)) {
      setActiveMiniAppModal('vneid');
    } else if (['google_drive', 'onedrive', 'word', 'excel', 'docs', 'sheets', 'notion'].includes(appId)) {
      setActiveMiniAppModal('office');
    } else if (['duolingo', 'quizlet', 'anki'].includes(appId)) {
      setActiveMiniAppModal('quiz');
    } else if (['gmail', 'outlook'].includes(appId)) {
      setActiveMiniAppModal('mail');
    } else if (['vnexpress', 'strava'].includes(appId)) {
      setActiveMiniAppModal('news_fitness');
    } else if (['capcut', 'canva'].includes(appId)) {
      setActiveMiniAppModal('studio');
    } else if (['facebook', 'threads', 'x_twitter'].includes(appId)) {
      setCurrentScreen('home');
      showToast('Đang ở Bảng Tin Trường Cẩm');
    } else if (['messenger', 'zalo', 'telegram', 'whatsapp'].includes(appId)) {
      setCurrentScreen('chats');
      showToast('Mở Tin Nhắn Học Sinh');
    } else if (['tiktok', 'youtube'].includes(appId)) {
      setCurrentScreen('reels');
      showToast('Mở Cẩm Short (Video học đường)');
    } else if (['google_search', 'chrome', 'safari'].includes(appId)) {
      setIsSearchOpen(true);
    } else {
      setActiveMiniAppModal('ai');
    }
  };

  // Clear any legacy theme data-attributes
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    try {
      localStorage.removeItem('hive_app_v2_theme');
    } catch {
      // ignore
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => Storage.savePeople(people), [people]);
  useEffect(() => Storage.saveUser(user), [user]);
  useEffect(() => Storage.savePosts(posts), [posts]);
  useEffect(() => Storage.saveStories(stories), [stories]);
  useEffect(() => Storage.saveReels(reels), [reels]);
  useEffect(() => Storage.saveChats(chats), [chats]);
  useEffect(() => Storage.saveGroups(groups), [groups]);
  useEffect(() => Storage.saveFriendRequests(friendRequests), [friendRequests]);
  useEffect(() => Storage.saveFriendSuggestions(friendSuggestions), [friendSuggestions]);
  useEffect(() => Storage.saveFriendsAll(friendsAll), [friendsAll]);
  useEffect(() => Storage.saveNotifications(notifications), [notifications]);

  // Overlay the real, authenticated Supabase profile (name/handle/bio/avatar)
  // onto the local "me" UserProfile record. Everything else on UserProfile
  // (friendsCount, postsCount, savedPostIds, photos, ...) is still driven by
  // the local mock/localStorage layer — that migrates in a later pass — but
  // identity itself is now real, not the hardcoded INITIAL_USER.
  useEffect(() => {
    if (!profile) return;
    setUser((prev) => ({
      ...prev,
      name: profile.displayName,
      handle: '@' + profile.username,
      bio: profile.bio || prev.bio,
      avatarUrl: profile.avatarUrl || prev.avatarUrl
    }));
  }, [profile]);

  // Fetch real posts from Supabase once per session and prepend them above
  // the local seed/demo posts. Real posts get bridged numeric ids (see
  // idBridge.ts) so they slot into the existing numeric-keyed UI untouched.
  useEffect(() => {
    if (!authUser) return;
    let cancelled = false;

    postService
      .getFeed(authUser.id)
      .then((dbPosts) => {
        if (cancelled) return;
        const mapped = dbPosts.map((dp) => mapDbPostToAppPost(dp, authUser.id));

        setPeople((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const toAdd = mapped.flatMap((m) => m.people).filter((p) => !existingIds.has(p.id));
          // De-dupe within the batch too (same author can post more than once).
          const seen = new Set<number>();
          const deduped = toAdd.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
          return deduped.length ? [...prev, ...deduped] : prev;
        });

        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = mapped.map((m) => m.post).filter((p) => !existingIds.has(p.id));
          return newOnes.length ? [...newOnes, ...prev] : prev;
        });
      })
      .catch((err) => {
        console.error('Failed to load feed from Supabase', err);
        showToast('Không tải được bảng tin từ máy chủ');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  // Post Actions
  const handleLikePost = (postId: number) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    const willLike = !target.liked;

    // Optimistic local update for both real and seed posts.
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, liked: willLike, likes: willLike ? p.likes + 1 : Math.max(0, p.likes - 1) };
      })
    );

    if (!postIdBridge.isBridged(postId) || !authUser) return; // seed/demo post — local only
    const uuid = postIdBridge.uuidFor(postId)!;
    postService.toggleLike(uuid, authUser.id, target.liked).catch((err) => {
      console.error('toggleLike failed', err);
      showToast('Không thể cập nhật lượt thích, thử lại sau');
      // Roll back the optimistic change.
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          return { ...p, liked: target.liked, likes: target.likes };
        })
      );
    });
  };

  const handleSavePost = (postId: number) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    const willSave = !target.saved;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, saved: willSave };
      })
    );
    showToast(willSave ? 'Saved to bookmarks' : 'Removed from bookmarks');

    if (!postIdBridge.isBridged(postId) || !authUser) return; // seed/demo post — local only
    const uuid = postIdBridge.uuidFor(postId)!;
    postService.toggleSave(uuid, authUser.id, target.saved).catch((err) => {
      console.error('toggleSave failed', err);
      showToast('Không thể lưu bài viết, thử lại sau');
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, saved: target.saved } : p)));
    });
  };

  const handleAddComment = (postId: number, commentText: string) => {
    const isReal = postIdBridge.isBridged(postId);

    if (isReal && authUser) {
      const uuid = postIdBridge.uuidFor(postId)!;
      postService
        .addComment(uuid, authUser.id, commentText)
        .then((dbComment) => {
          const newComment = {
            id: dbComment.id,
            personId: 0, // it's always "me" commenting from this client
            text: dbComment.content,
            time: 'Vừa xong',
            likes: 0
          };
          setPosts((prev) =>
            prev.map((p) => (p.id !== postId ? p : { ...p, comments: [...p.comments, newComment], commentsOpen: true }))
          );
          showToast('Comment published');
        })
        .catch((err) => {
          console.error('addComment failed', err);
          showToast('Không thể đăng bình luận, thử lại sau');
        });
      return;
    }

    // Seed/demo post — keep the old local-only behavior.
    const newComment = {
      id: 'c_' + Date.now(),
      personId: 0,
      text: commentText,
      time: 'Just now',
      likes: 0
    };
    setPosts((prev) =>
      prev.map((p) => (p.id !== postId ? p : { ...p, comments: [...p.comments, newComment], commentsOpen: true }))
    );
    showToast('Comment published');
  };

  const handleLikeComment = (postId: number, commentId: string) => {
    if (!commentId) {
      setPosts((p) => [...p]);
      return;
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: p.comments.map((c) => {
            if (c.id !== commentId) return c;
            const liked = !c.liked;
            return {
              ...c,
              liked,
              likes: liked ? c.likes + 1 : Math.max(0, c.likes - 1)
            };
          })
        };
      })
    );
  };

  const handleSharePost = (post: Post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    } else {
      showToast('Post shared with circle!');
    }
  };

  const handleDeletePost = (postId: number) => {
    const wasReal = postIdBridge.isBridged(postId);
    const uuid = wasReal ? postIdBridge.uuidFor(postId) : undefined;

    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Post deleted');

    if (wasReal && uuid) {
      postService.deletePost(uuid).catch((err) => {
        console.error('deletePost failed', err);
        showToast('Xoá trên máy chủ thất bại — thử tải lại trang');
      });
    }
  };

  const handleCreatePost = (postData: {
    type: 'text' | 'image' | 'quote';
    text: string;
    imgData?: string;
    grad?: string;
    fontChoice?: AestheticFont;
  }) => {
    if (!authUser) return;

    // Real posts go straight to Supabase now — no more fake local-only
    // posts once a user is actually authenticated. Note: `imgData` /
    // `grad` / `fontChoice` are presentation-only fields with no backend
    // column yet (post_media handles real images later); they're kept on
    // the local object so the current UI still renders correctly, but they
    // won't survive a page reload for real posts until that's wired up.
    postService
      .createPost({ authorId: authUser.id, content: postData.text, postType: postData.type })
      .then((dbPost) => {
        const { post } = mapDbPostToAppPost(dbPost, authUser.id);
        const enriched: Post = { ...post, grad: postData.grad, imgData: postData.imgData, fontChoice: postData.fontChoice || 'clean' };
        setPosts((prev) => [enriched, ...prev]);
        setUser((u) => ({ ...u, postsCount: u.postsCount + 1 }));
        showToast('Moment shared with your circles! 🚀');
      })
      .catch((err) => {
        console.error('createPost failed', err);
        showToast('Không thể đăng bài, vui lòng thử lại');
      });
  };

  // Reel Actions
  const handleLikeReel = (reelId: number) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== reelId) return r;
        const newLiked = !r.liked;
        return {
          ...r,
          liked: newLiked,
          likes: newLiked ? r.likes + 1 : Math.max(0, r.likes - 1)
        };
      })
    );
  };

  const handleShareReel = (reel: Reel) => {
    showToast(`Shared "${reel.text.slice(0, 25)}..."`);
  };

  const handleSendReelComment = (reelId: number, comment: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === reelId ? { ...r, commentsCount: r.commentsCount + 1 } : r))
    );
    showToast('Comment sent!');
  };

  const handleCreateStorySlide = (slide: StorySlide) => {
    setStories((prev) => {
      const existingUserStoryIndex = prev.findIndex((s) => s.personId === 0);
      if (existingUserStoryIndex !== -1) {
        const updated = [...prev];
        updated[existingUserStoryIndex] = {
          ...updated[existingUserStoryIndex],
          seen: false,
          slides: [...updated[existingUserStoryIndex].slides, slide]
        };
        return updated;
      } else {
        const newStory: Story = {
          id: Date.now(),
          personId: 0,
          seen: false,
          slides: [slide]
        };
        return [newStory, ...prev];
      }
    });
    showToast('Slide added to your story! 🌟');
  };

  const handleCreateReel = (reelData: { text: string; soundTrack: string; grad: string; imgData?: string }) => {
    const newReel: Reel = {
      id: Date.now(),
      personId: 0,
      grad: reelData.grad,
      imgData: reelData.imgData,
      text: reelData.text,
      likes: 1,
      liked: true,
      soundTrack: reelData.soundTrack,
      commentsCount: 0
    };
    setReels((prev) => [newReel, ...prev]);
    showToast('Reel published to Hive! 🎬');
  };

  const handleToggleFriend = (personId: number) => {
    setFriendsAll((prev) => {
      const isAlready = prev.includes(personId);
      if (isAlready) {
        showToast('Removed from circle friends');
        return prev.filter((id) => id !== personId);
      } else {
        showToast('Friend added to your circle! 🎉');
        return [...prev, personId];
      }
    });
  };

  const handleSelectHashtag = (tag: string) => {
    setActiveTagFilter(tag);
    setCurrentScreen('home');
    showToast(`Filtering by #${tag}`);
  };

  // Chat Actions
  const handleSendMessage = (chatId: number | string, text?: string, imgData?: string) => {
    const newMsg = {
      id: 'm_' + Date.now(),
      me: true,
      text,
      img: imgData,
      time: 'Just now'
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          msgs: [...c.msgs, newMsg],
          unread: 0
        };
      })
    );
  };

  const handleSimulateReply = (chatId: number | string) => {
    const replies = [
      'Haha totally agree 😄',
      'That sounds like a great plan!',
      'Are you going to the campus meetup tomorrow?',
      'Let me know when you get there!',
      'Omg really? Send me the link 🙌',
      'Count me in for sure!',
      'Working on my design critique right now, but talk soon!'
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const autoMsg = {
          id: 'auto_' + Date.now(),
          me: false,
          personId: c.isGroup ? 3 : c.personId,
          text: replyText,
          time: 'Just now'
        };
        return {
          ...c,
          msgs: [...c.msgs, autoMsg]
        };
      })
    );
  };

  const handleOpenDirectChat = (personId: number) => {
    let existingChat = chats.find((c) => !c.isGroup && c.personId === personId);
    if (!existingChat) {
      const newChat: Chat = {
        id: Date.now(),
        personId,
        unread: 0,
        msgs: [{ id: 'm_init', me: false, text: 'Hey there! Nice to connect.', time: 'Just now' }]
      };
      setChats((prev) => [newChat, ...prev]);
      existingChat = newChat;
    }
    setActiveChatId(existingChat.id);
  };

  // Group Actions
  const handleToggleJoinGroup = (groupId: number) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const joined = !g.joined;
        showToast(joined ? `Joined ${g.name}` : `Left ${g.name}`);
        return {
          ...g,
          joined,
          members: joined ? g.members + 1 : Math.max(1, g.members - 1)
        };
      })
    );
  };

  const handleCreateGroup = (groupData: Omit<Group, 'id' | 'joined'>) => {
    const newGroup: Group = {
      ...groupData,
      id: Date.now(),
      joined: true
    };
    setGroups((prev) => [newGroup, ...prev]);
    setUser((u) => ({ ...u, groupsCount: u.groupsCount + 1 }));
    showToast(`Circle "${newGroup.name}" created!`);
  };

  // Friend Actions
  const handleAcceptRequest = (personId: number) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== personId));
    setFriendsAll((prev) => [...prev, personId]);
    setUser((u) => ({ ...u, friendsCount: u.friendsCount + 1 }));
    const person = people.find((p) => p.id === personId);
    showToast(`You and ${person?.name.split(' ')[0] || 'friend'} are now connected!`);
  };

  const handleDeclineRequest = (personId: number) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== personId));
    showToast('Request declined');
  };

  const handleAddSuggestion = (personId: number) => {
    setFriendSuggestions((prev) => prev.filter((s) => s.id !== personId));
    const person = people.find((p) => p.id === personId);
    showToast(`Connection invitation sent to ${person?.name.split(' ')[0] || 'peer'}`);
  };

  // Story Actions
  const activeStory = activeStoryId ? stories.find((s) => s.id === activeStoryId) || null : null;

  const handleOpenStory = (storyId: number) => {
    setActiveStoryId(storyId);
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, seen: true } : s))
    );
  };

  const handleNextStory = () => {
    if (!activeStoryId) return;
    const currentIndex = stories.findIndex((s) => s.id === activeStoryId);
    if (currentIndex < stories.length - 1) {
      handleOpenStory(stories[currentIndex + 1].id);
    } else {
      setActiveStoryId(null);
    }
  };

  const handlePrevStory = () => {
    if (!activeStoryId) return;
    const currentIndex = stories.findIndex((s) => s.id === activeStoryId);
    if (currentIndex > 0) {
      handleOpenStory(stories[currentIndex - 1].id);
    }
  };

  const handleReplyToStory = (personId: number, message: string) => {
    handleOpenDirectChat(personId);
    // Find chat and send message
    setTimeout(() => {
      const chat = chats.find((c) => !c.isGroup && c.personId === personId);
      if (chat) {
        handleSendMessage(chat.id, message);
        handleSimulateReply(chat.id);
      }
    }, 200);
    showToast('Reply sent!');
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const handleResetData = () => {
    Storage.resetAll();
    window.location.reload();
  };

  const activeChat = activeChatId ? chats.find((c) => c.id === activeChatId) || null : null;
  const unreadChatsTotal = chats.reduce((acc, c) => acc + (c.unread || 0), 0);

  // Auth gate: no more pretending INITIAL_USER is "the logged-in user".
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-white">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!authUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white antialiased">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Bar Navigation */}
      <TopBar
        onOpenSearch={() => setIsSearchOpen(true)}
        notifications={notifications}
        people={people}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        onNavigateToScreen={(screen) => setCurrentScreen(screen)}
        onOpenControlCenter={() => setIsControlCenterOpen(true)}
        onOpenMusic={() => setIsMusicOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Responsive Desktop Sidebar Navigation */}
        <Navigation
          currentScreen={currentScreen}
          onSelectScreen={(s) => {
            setCurrentScreen(s);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          unreadChatsCount={unreadChatsTotal}
          friendRequestsCount={friendRequests.length}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 min-w-0 py-3 sm:py-5">
          {currentScreen === 'home' && (
            <div className="max-w-2xl mx-auto flex flex-col gap-3">
              {/* Stories Carousel */}
              <StoriesRow
                stories={stories}
                people={people}
                user={user}
                onOpenStory={handleOpenStory}
                onAddStory={() => setIsCreateStoryOpen(true)}
              />

              {/* Feed List */}
              <Feed
                posts={posts}
                people={people}
                user={user}
                onOpenComposer={(type) => {
                  setComposerType(type);
                  setIsComposerOpen(true);
                }}
                onLikePost={handleLikePost}
                onSavePost={handleSavePost}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onSharePost={handleSharePost}
                onDeletePost={handleDeletePost}
                onSelectPerson={(id) => setSelectedPersonModalId(id)}
                onOpenLightbox={(imgUrl, grad, author, caption, post) => {
                  setLightboxData({
                    isOpen: true,
                    imgUrl,
                    grad,
                    author,
                    caption,
                    post
                  });
                }}
                onSelectHashtag={handleSelectHashtag}
                currentFilter={feedFilter}
                onFilterChange={setFeedFilter}
                activeTagFilter={activeTagFilter}
                onClearTagFilter={() => setActiveTagFilter(null)}
              />
            </div>
          )}

          {currentScreen === 'explore' && (
            <ExploreView
              posts={posts}
              people={people}
              groups={groups}
              user={user}
              onSelectPerson={(id) => setSelectedPersonModalId(id)}
              onSelectHashtag={handleSelectHashtag}
              onOpenLightbox={(imgUrl, grad, author, caption, post) => {
                setLightboxData({
                  isOpen: true,
                  imgUrl,
                  grad,
                  author,
                  caption,
                  post
                });
              }}
              onToggleJoinGroup={handleToggleJoinGroup}
              onLikePost={handleLikePost}
              onOpenDirectChat={handleOpenDirectChat}
            />
          )}

          {currentScreen === 'reels' && (
            <ReelsView
              reels={reels}
              people={people}
              onLikeReel={handleLikeReel}
              onShareReel={handleShareReel}
              onSendReelComment={handleSendReelComment}
              onOpenCreateReel={() => setIsCreateReelOpen(true)}
              onSelectPerson={(id) => setSelectedPersonModalId(id)}
            />
          )}

          {currentScreen === 'chats' && (
            <ChatsView
              chats={chats}
              people={people}
              onSelectChat={(id) => setActiveChatId(id)}
            />
          )}

          {currentScreen === 'groups' && (
            <GroupsView
              groups={groups}
              onToggleJoin={handleToggleJoinGroup}
              onCreateGroup={handleCreateGroup}
            />
          )}

          {currentScreen === 'friends' && (
            <FriendsView
              friendsAllIds={friendsAll}
              friendRequests={friendRequests}
              friendSuggestions={friendSuggestions}
              people={people}
              onAcceptRequest={handleAcceptRequest}
              onDeclineRequest={handleDeclineRequest}
              onAddSuggestion={handleAddSuggestion}
              onOpenDirectChat={handleOpenDirectChat}
              onSelectPerson={(id) => setSelectedPersonModalId(id)}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileView
              user={user}
              posts={posts}
              onUpdateUser={(updated) => {
                setUser((prev) => ({ ...prev, ...updated }));
                showToast('Hồ sơ học sinh đã cập nhật!');
              }}
              onResetData={handleResetData}
              onViewSavedPosts={() => {
                setFeedFilter('saved');
                setActiveTagFilter(null);
                setCurrentScreen('home');
                showToast('Hiển thị bài viết đã lưu');
              }}
              onSignOut={signOut}
            />
          )}

          {/* Cẩm Hub - 35+ Apps Ecosystem */}
          {currentScreen === 'apps' && (
            <CamHubView onOpenMiniApp={handleOpenMiniApp} />
          )}
        </main>
      </div>

      {/* Active Chat Conversation View */}
      {activeChat && (
        <ChatConversation
          chat={activeChat}
          people={people}
          user={user}
          onBack={() => setActiveChatId(null)}
          onSendMessage={handleSendMessage}
          onSimulateReply={handleSimulateReply}
        />
      )}

      {/* Story Viewer Modal */}
      {activeStory && (
        <StoryViewerModal
          story={activeStory}
          people={people}
          user={user}
          onClose={() => setActiveStoryId(null)}
          onNextStory={handleNextStory}
          onPrevStory={handlePrevStory}
          onReplyToStory={handleReplyToStory}
        />
      )}

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        user={user}
        onClose={() => setIsCreateStoryOpen(false)}
        onSubmitStory={handleCreateStorySlide}
      />

      {/* Create Reel Modal */}
      <CreateReelModal
        isOpen={isCreateReelOpen}
        user={user}
        onClose={() => setIsCreateReelOpen(false)}
        onSubmitReel={handleCreateReel}
      />

      {/* Person Profile Modal */}
      <PersonProfileModal
        person={people.find((p) => p.id === selectedPersonModalId) || null}
        currentUser={user}
        posts={posts}
        isFriend={selectedPersonModalId ? friendsAll.includes(selectedPersonModalId) : false}
        onClose={() => setSelectedPersonModalId(null)}
        onToggleFriend={handleToggleFriend}
        onOpenChat={handleOpenDirectChat}
        onLikePost={handleLikePost}
        onSavePost={handleSavePost}
      />

      {/* Image Lightbox Modal */}
      {lightboxData && (
        <ImageLightboxModal
          isOpen={lightboxData.isOpen}
          imgUrl={lightboxData.imgUrl}
          gradient={lightboxData.grad}
          author={lightboxData.author}
          caption={lightboxData.caption}
          liked={lightboxData.post?.liked}
          onLike={() => lightboxData.post && handleLikePost(lightboxData.post.id)}
          onClose={() => setLightboxData(null)}
        />
      )}

      {/* Create Post / Moment Modal */}
      <CreatePostModal
        isOpen={isComposerOpen}
        initialType={composerType}
        user={user}
        onClose={() => setIsComposerOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Unified Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        people={people}
        groups={groups}
        posts={posts}
        onSelectPerson={(personId) => {
          setSelectedPersonModalId(personId);
          setIsSearchOpen(false);
        }}
        onSelectGroup={(groupId) => {
          setCurrentScreen('groups');
          setIsSearchOpen(false);
        }}
      />

      {/* iOS Control Center */}
      <IOSControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        volume={volume}
        onVolumeChange={setVolume}
        focusMode={focusMode}
        onToggleFocusMode={() => {
          const next = !focusMode;
          setFocusMode(next);
          showToast(next ? 'Đã bật Chế độ Ôn thi THPT' : 'Đã tắt Chế độ Ôn thi');
        }}
        onOpenApp={handleOpenMiniApp}
      />

      {/* CẩmMusic Player (Spotify / Apple Music) */}
      <CamMusicPlayer
        isOpen={isMusicOpen}
        onClose={() => setIsMusicOpen(false)}
        currentSong={currentSong}
        isPlaying={isPlayingMusic}
        onTogglePlay={() => setIsPlayingMusic(!isPlayingMusic)}
        onSelectSong={(song) => {
          setCurrentSong(song);
          setIsPlayingMusic(true);
        }}
        volume={volume}
        onVolumeChange={setVolume}
      />

      {/* Cẩm AI Assistant Modal (ChatGPT / Gemini / Claude) */}
      <CamAIModal
        isOpen={activeMiniAppModal === 'ai'}
        onClose={() => setActiveMiniAppModal(null)}
      />

      {/* Study Room Modal (Teams / Zoom / Meet / Slack) */}
      <CamStudyRoomModal
        isOpen={activeMiniAppModal === 'study_room'}
        onClose={() => setActiveMiniAppModal(null)}
        user={user}
        people={people}
        pomodoroMinutes={pomodoroMinutes}
        pomodoroSeconds={pomodoroSeconds}
        isPomodoroActive={isPomodoroActive}
        onTogglePomodoro={() => setIsPomodoroActive(!isPomodoroActive)}
        onResetPomodoro={() => {
          setIsPomodoroActive(false);
          setPomodoroMinutes(25);
          setPomodoroSeconds(0);
        }}
      />

      {/* CẩmPay Modal (MoMo / MB Bank / Vietcombank / VNPay) */}
      <CamPayModal
        isOpen={activeMiniAppModal === 'pay'}
        onClose={() => setActiveMiniAppModal(null)}
        user={user}
      />

      {/* Canteen & Ride Modal (Shopee / TikTok Shop / Grab / Be) */}
      <CamCanteenModal
        isOpen={activeMiniAppModal === 'canteen'}
        onClose={() => setActiveMiniAppModal(null)}
        onOrderSuccess={(txt) => {
          setActiveOrderNotification(txt);
          setTimeout(() => setActiveOrderNotification(null), 8000);
        }}
      />

      {/* Campus Map Modal (Google Maps) */}
      <CamCampusMapModal
        isOpen={activeMiniAppModal === 'maps'}
        onClose={() => setActiveMiniAppModal(null)}
      />

      {/* Digital Student ID Modal (VNeID) */}
      <CamIDModal
        isOpen={activeMiniAppModal === 'vneid'}
        onClose={() => setActiveMiniAppModal(null)}
        user={user}
      />

      {/* Office Modal (Excel GPA, Notion To-Do, Drive) */}
      <CamOfficeModal
        isOpen={activeMiniAppModal === 'office'}
        onClose={() => setActiveMiniAppModal(null)}
      />

      {/* Quiz & Flashcard Modal (Duolingo / Quizlet / Anki) */}
      <CamQuizModal
        isOpen={activeMiniAppModal === 'quiz'}
        onClose={() => setActiveMiniAppModal(null)}
      />

      {/* Mail Modal (Gmail / Outlook) */}
      <CamMailModal
        isOpen={activeMiniAppModal === 'mail'}
        onClose={() => setActiveMiniAppModal(null)}
        user={user}
      />

      {/* News & Fitness Modal (VnExpress / Strava) */}
      <CamNewsFitnessModal
        isOpen={activeMiniAppModal === 'news_fitness'}
        onClose={() => setActiveMiniAppModal(null)}
      />

      {/* Creative Studio Modal (CapCut / Canva) */}
      <CamStudioModal
        isOpen={activeMiniAppModal === 'studio'}
        onClose={() => setActiveMiniAppModal(null)}
      />
    </div>
  );
}
