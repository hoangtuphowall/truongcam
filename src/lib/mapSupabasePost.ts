import type { Comment, Person, Post } from '../types';
import type { DbAuthor, DbPost } from './services/postService';
import { personIdBridge, postIdBridge } from './idBridge';
import { formatRelativeTimeVi } from './time';

const REAL_AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #ff6bcb, #7c6bff)',
  'linear-gradient(135deg, #38e6c5, #7c6bff)',
  'linear-gradient(135deg, #ffb84d, #ff6bcb)',
  'linear-gradient(135deg, #7c6bff, #38e6c5)'
];

function gradientFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return REAL_AVATAR_GRADIENTS[hash % REAL_AVATAR_GRADIENTS.length];
}

/** Numeric personId for an author: the real "me" always stays id 0 (the
 * existing convention), anyone else gets a bridged numeric id and a Person
 * record the caller should merge into local state. */
function personIdFor(author: DbAuthor, currentUserId: string, newPeople: Person[]): number {
  if (author.id === currentUserId) return 0;

  const numericId = personIdBridge.numericFor(author.id);
  newPeople.push({
    id: numericId,
    name: author.displayName,
    handle: '@' + author.username,
    emoji: '🎓',
    school: 'THPT Cẩm Bình',
    bio: '',
    avatarGradient: gradientFor(author.id),
    avatarUrl: author.avatarUrl || undefined,
    online: false,
    mutualCount: 0
  });
  return numericId;
}

function mapComment(c: DbPost['comments'][number], currentUserId: string, newPeople: Person[]): Comment {
  return {
    id: c.id,
    personId: personIdFor(c.author, currentUserId, newPeople),
    text: c.content,
    time: formatRelativeTimeVi(c.createdAt),
    likes: 0
  };
}

/** Pure mapper: does not touch React state. Returns the app-shaped Post plus
 * any newly-seen authors (as Person[]) the caller should merge in, deduped
 * by the caller (or just always merge — personIdBridge already dedupes the
 * numeric id itself, so pushing the same Person twice is harmless-but-wasteful
 * rather than wrong). */
export function mapDbPostToAppPost(dbPost: DbPost, currentUserId: string): { post: Post; people: Person[] } {
  const newPeople: Person[] = [];
  const personId = personIdFor(dbPost.author, currentUserId, newPeople);

  const post: Post = {
    id: postIdBridge.numericFor(dbPost.id),
    personId,
    type: dbPost.postType,
    text: dbPost.content,
    time: formatRelativeTimeVi(dbPost.createdAt),
    likes: dbPost.likeCount,
    liked: dbPost.likedByMe,
    saved: dbPost.savedByMe,
    comments: dbPost.comments.map((c) => mapComment(c, currentUserId, newPeople)),
    commentsOpen: false,
    sharesCount: 0
  };

  return { post, people: newPeople };
}
