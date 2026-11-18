import { supabase, isSupabaseConfigured } from './supabase';

export type ActivityType = 'login' | 'download' | 'message' | 'project_view';

export const logActivity = async (action: ActivityType, details: string) => {
  try {
    if (!isSupabaseConfigured) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('activity_logs').insert({
      user_id: user.id,
      user_email: user.email,
      action,
      details,
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'activité:", error);
  }
};
