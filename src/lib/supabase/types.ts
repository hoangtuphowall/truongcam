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
    };
  };
}
