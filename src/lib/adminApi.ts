// Client helper for the admin-api edge function.
// Stores admin password in localStorage after successful login and sends it with every call.
import { supabase } from '@/integrations/supabase/client';

const PASSWORD_KEY = 'admin_password';
const AUTH_KEY = 'admin_auth';

export const getAdminPassword = () => localStorage.getItem(PASSWORD_KEY) ?? '';
export const isAdminAuthed = () => !!localStorage.getItem(AUTH_KEY) && !!getAdminPassword();
export const setAdminPassword = (pwd: string) => {
  localStorage.setItem(PASSWORD_KEY, pwd);
  localStorage.setItem(AUTH_KEY, 'true');
};
export const clearAdminAuth = () => {
  localStorage.removeItem(PASSWORD_KEY);
  localStorage.removeItem(AUTH_KEY);
};

export async function adminApi<T = any>(op: string, args: Record<string, unknown> = {}): Promise<T> {
  const pwd = getAdminPassword();
  const { data, error } = await supabase.functions.invoke('admin-api', {
    body: { op, ...args },
    headers: { 'x-admin-password': pwd },
  });
  if (error) {
    // 401 → wipe auth and force re-login
    if ((error as any).context?.status === 401) {
      clearAdminAuth();
      window.location.reload();
    }
    throw error;
  }
  return data as T;
}
