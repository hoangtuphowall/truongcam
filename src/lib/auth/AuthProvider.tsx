import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

export interface AppProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  coverUrl: string | null;
}

interface AuthContextValue {
  session: Session | null;
  authUser: User | null;
  profile: AppProfile | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<AppProfile, 'displayName' | 'bio' | 'avatarUrl' | 'coverUrl'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapProfileRow(row: {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  cover_url: string | null;
}): AppProfile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    coverUrl: row.cover_url
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, cover_url')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) {
      // The row-creation trigger (handle_new_user) can lag by a beat right
      // after sign-up; don't treat a transient miss as a hard error.
      console.warn('Failed to load profile', fetchError);
      return;
    }
    if (data) setProfile(mapProfileRow(data));
  }, []);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = useCallback(async (email: string, password: string, username: string, displayName: string) => {
    setError(null);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName }
      }
    });
    if (signUpError) {
      setError(signUpError.message);
      throw signUpError;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      throw signInError;
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id);
  }, [session, loadProfile]);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<AppProfile, 'displayName' | 'bio' | 'avatarUrl' | 'coverUrl'>>) => {
      if (!session?.user) return;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: patch.displayName,
          bio: patch.bio,
          avatar_url: patch.avatarUrl,
          cover_url: patch.coverUrl
        })
        .eq('id', session.user.id);
      if (updateError) {
        setError(updateError.message);
        throw updateError;
      }
      await loadProfile(session.user.id);
    },
    [session, loadProfile]
  );

  const value: AuthContextValue = {
    session,
    authUser: session?.user ?? null,
    profile,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
