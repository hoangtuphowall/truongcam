import type { NotificationItem } from '../types';
import type { DbNotification } from './services/notificationService';
import { personIdBridge } from './idBridge';
import { formatRelativeTimeVi } from './time';

const ACTION_TEXT: Record<DbNotification['type'], string> = {
  like: 'đã thích bài viết của bạn',
  comment: 'đã bình luận về bài viết của bạn',
  friend_request: 'đã gửi cho bạn lời mời kết bạn',
  friend_accept: 'đã chấp nhận lời mời kết bạn của bạn',
  group_invite: 'đã mời bạn vào một nhóm',
  message: 'đã nhắn tin cho bạn',
  system: 'có thông báo mới'
};

const LOCAL_TYPE: Record<DbNotification['type'], NotificationItem['type']> = {
  like: 'like',
  comment: 'comment',
  friend_request: 'friend',
  friend_accept: 'friend',
  group_invite: 'group',
  message: 'comment',
  system: 'comment'
};

export function mapDbNotification(n: DbNotification, currentUserId: string): NotificationItem {
  const personId = n.actorId && n.actorId !== currentUserId ? personIdBridge.numericFor(n.actorId) : 0;
  return {
    id: n.id,
    personId,
    action: ACTION_TEXT[n.type],
    time: formatRelativeTimeVi(n.createdAt),
    read: n.readAt !== null,
    type: LOCAL_TYPE[n.type]
  };
}
