// Hand-written subset of the generated Supabase types, covering only the
// tables the service layer touches so far (profiles + P1 social core).
// Once the project is live, replace this file with the real output of:
//
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
//
// and re-check the service layer against the generated shapes.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          bio: string;
          avatar_url: string | null;
          cover_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          bio?: string;
          avatar_url?: string | null;
          cover_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          school_id: string | null;
          content: string;
          post_type: 'text' | 'image' | 'quote';
          visibility: 'school' | 'class' | 'friends' | 'public' | 'private';
          status: 'published' | 'hidden' | 'removed' | 'under_review';
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          author_id: string;
          school_id?: string | null;
          content: string;
          post_type?: 'text' | 'image' | 'quote';
          visibility?: 'school' | 'class' | 'friends' | 'public' | 'private';
        };
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      post_likes: {
        Row: { post_id: string; user_id: string; created_at: string };
        Insert: { post_id: string; user_id: string };
        Update: Partial<Database['public']['Tables']['post_likes']['Insert']>;
      };
      post_saves: {
        Row: { post_id: string; user_id: string; created_at: string };
        Insert: { post_id: string; user_id: string };
        Update: Partial<Database['public']['Tables']['post_saves']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_id: string | null;
          content: string;
          status: 'published' | 'hidden' | 'removed';
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          post_id: string;
          author_id: string;
          parent_id?: string | null;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
      friend_requests: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
          created_at: string;
          responded_at: string | null;
        };
        Insert: { sender_id: string; receiver_id: string };
        Update: Partial<Database['public']['Tables']['friend_requests']['Insert']>;
      };
      friendships: {
        Row: { user_a: string; user_b: string; created_at: string };
        Insert: { user_a: string; user_b: string };
        Update: never;
      };
      conversations: {
        Row: {
          id: string;
          type: 'direct' | 'group' | 'class';
          title: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: { type: 'direct' | 'group' | 'class'; title?: string | null; created_by: string };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      conversation_members: {
        Row: {
          conversation_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          joined_at: string;
          left_at: string | null;
          last_read_message_id: string | null;
        };
        Insert: { conversation_id: string; user_id: string; role?: 'owner' | 'admin' | 'member' };
        Update: Partial<Database['public']['Tables']['conversation_members']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string | null;
          message_type: 'text' | 'image' | 'system';
          created_at: string;
          edited_at: string | null;
          deleted_at: string | null;
        };
        Insert: { conversation_id: string; sender_id: string; content?: string | null; message_type?: 'text' | 'image' | 'system' };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          actor_id: string | null;
          type: 'like' | 'comment' | 'friend_request' | 'friend_accept' | 'group_invite' | 'message' | 'system';
          entity_type: string | null;
          entity_id: string | null;
          payload: Record<string, unknown>;
          read_at: string | null;
          created_at: string;
        };
        Insert: never; // written only by server-side triggers, see 009_notification_triggers.sql
        Update: { read_at?: string | null };
      };
      groups: {
        Row: {
          id: string;
          school_id: string | null;
          name: string;
          description: string;
          category: 'School' | 'College' | 'Work' | 'Interest';
          avatar_url: string | null;
          cover_url: string | null;
          visibility: 'public' | 'private';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          created_by: string;
          name: string;
          description?: string;
          category?: 'School' | 'College' | 'Work' | 'Interest';
          school_id?: string | null;
          visibility?: 'public' | 'private';
        };
        Update: Partial<Database['public']['Tables']['groups']['Insert']>;
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          status: 'active' | 'pending' | 'left';
          joined_at: string;
        };
        Insert: { group_id: string; user_id: string; role?: 'owner' | 'admin' | 'member' };
        Update: Partial<Database['public']['Tables']['group_members']['Insert']>;
      };
      stories: {
        Row: { id: string; author_id: string; status: 'active' | 'expired' | 'removed'; created_at: string; expires_at: string };
        Insert: { author_id: string };
        Update: Partial<Database['public']['Tables']['stories']['Insert']>;
      };
      story_media: {
        Row: {
          id: string;
          story_id: string;
          media_type: 'photo' | 'quote';
          storage_path: string | null;
          text_content: string | null;
          background: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          story_id: string;
          media_type: 'photo' | 'quote';
          storage_path?: string | null;
          text_content?: string | null;
          background?: string | null;
          sort_order?: number;
        };
        Update: never;
      };
      reels: {
        Row: {
          id: string;
          author_id: string;
          caption: string;
          sound_track: string | null;
          status: 'published' | 'hidden' | 'removed';
          created_at: string;
          updated_at: string;
        };
        Insert: { author_id: string; caption: string; sound_track?: string | null };
        Update: Partial<Database['public']['Tables']['reels']['Insert']>;
      };
      reel_media: {
        Row: { id: string; reel_id: string; storage_path: string; mime_type: string | null; duration: number | null; created_at: string };
        Insert: { reel_id: string; storage_path: string; mime_type?: string | null; duration?: number | null };
        Update: never;
      };
      reel_likes: {
        Row: { reel_id: string; user_id: string; created_at: string };
        Insert: { reel_id: string; user_id: string };
        Update: never;
      };
      reel_saves: {
        Row: { reel_id: string; user_id: string; created_at: string };
        Insert: { reel_id: string; user_id: string };
        Update: never;
      };
      schools: {
        Row: { id: string; name: string; slug: string; address: string | null; logo_url: string | null; status: string; created_at: string; updated_at: string };
        Insert: never;
        Update: never;
      };
      classes: {
        Row: { id: string; school_id: string; name: string; grade: string | null; academic_year: string | null; homeroom_teacher_id: string | null; created_at: string; updated_at: string };
        Insert: never;
        Update: never;
      };
      school_members: {
        Row: {
          id: string;
          school_id: string;
          user_id: string;
          member_type: 'student' | 'teacher' | 'staff' | 'admin';
          student_code: string | null;
          status: string;
          joined_at: string;
          left_at: string | null;
          created_at: string;
        };
        Insert: { school_id: string; user_id: string; member_type: 'student' | 'teacher' | 'staff' | 'admin'; student_code?: string | null; status?: string };
        Update: never;
      };
      class_members: {
        Row: { id: string; class_id: string; user_id: string; role: 'student' | 'monitor' | 'vice_monitor' | 'teacher'; joined_at: string; left_at: string | null };
        Insert: { class_id: string; user_id: string; role?: 'student' | 'monitor' | 'vice_monitor' | 'teacher' };
        Update: never;
      };
      canteens: {
        Row: { id: string; school_id: string | null; name: string; created_at: string };
        Insert: never;
        Update: never;
      };
      canteen_items: {
        Row: {
          id: string;
          canteen_id: string;
          name: string;
          price: number;
          category: 'Ăn sáng' | 'Đồ uống' | 'Ăn vặt' | 'Dụng cụ học tập';
          emoji: string | null;
          image_url: string | null;
          is_available: boolean;
          created_at: string;
        };
        Insert: never;
        Update: never;
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          canteen_id: string;
          status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: { buyer_id: string; canteen_id: string; total_amount: number };
        Update: { status?: string };
      };
      order_items: {
        Row: { id: string; order_id: string; canteen_item_id: string; quantity: number; unit_price: number };
        Insert: { order_id: string; canteen_item_id: string; quantity: number; unit_price: number };
        Update: never;
      };
      wallet_accounts: {
        Row: { user_id: string; balance: number; created_at: string; updated_at: string };
        Insert: never;
        Update: never;
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          kind: 'demo_topup' | 'canteen_order' | 'transfer_out' | 'transfer_in';
          related_order_id: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: never; // written only by wallet_apply_transaction()
        Update: never;
      };
      group_conversations: {
        Row: { group_id: string; conversation_id: string };
        Insert: never;
        Update: never;
      };
      reel_comments: {
        Row: { id: string; reel_id: string; author_id: string; content: string; created_at: string };
        Insert: { reel_id: string; author_id: string; content: string };
        Update: never;
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          entity_type: 'post' | 'comment' | 'reel' | 'message' | 'profile' | 'group';
          entity_id: string;
          reason: string;
          details: string | null;
          status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
          created_at: string;
          resolved_at: string | null;
        };
        Insert: { reporter_id: string; entity_type: 'post' | 'comment' | 'reel' | 'message' | 'profile' | 'group'; entity_id: string; reason: string; details?: string | null };
        Update: never;
      };
    };
    Functions: {
      accept_friend_request: {
        Args: { request_id: string };
        Returns: void;
      };
      wallet_apply_transaction: {
        Args: {
          p_amount: number;
          p_kind: 'demo_topup' | 'canteen_order' | 'transfer_out' | 'transfer_in';
          p_note?: string | null;
          p_order_id?: string | null;
        };
        Returns: number;
      };
      ensure_wallet_account: {
        Args: Record<string, never>;
        Returns: void;
      };
      mark_all_notifications_read: {
        Args: Record<string, never>;
        Returns: void;
      };
      get_or_create_group_conversation: {
        Args: { p_group_id: string };
        Returns: string;
      };
      place_canteen_order: {
        Args: { p_canteen_id: string; p_items: { canteen_item_id: string; quantity: number }[] };
        Returns: string;
      };
      am_i_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      resolve_report: {
        Args: { p_report_id: string; p_action: 'resolved' | 'dismissed'; p_content_action?: 'hide' | 'remove' | null };
        Returns: void;
      };
    };
  };
}
