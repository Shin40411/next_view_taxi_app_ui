// ----------------------------------------------------------------------

export type IChatSender = {
  id: string;
  full_name: string;
  avatar: string | null;
};

export type IChatMessage = {
  id: string;
  body: string;
  created_at: Date | string;
  sender: IChatSender;
  sender_id: string;
  type: 'text' | 'image' | 'audio';
};

export type IChatParticipant = {
  id: string;
  name: string;
  role: string;
  email: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  lastActivity: Date;
  status: 'online' | 'offline' | 'alway' | 'busy';
  isOnline?: boolean;
  last_read_at?: Date | string;
};

export type IChatConversation = {
  id: string;
  name: string;
  avatar: string | null;
  last_message: {
    body: string;
    senderId: string;
    senderName: string;
    createdAt: Date | string;
    isMe: boolean;
  } | null;
  unread_count: number;
  updated_at: Date | string;
  participants: IChatParticipant[];
};

export type IChatConversations = {
  byId: Record<string, IChatConversation>;
  allIds: string[];
};

