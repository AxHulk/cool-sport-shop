import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { adminApi, setAdminPassword } from '@/lib/adminApi';

interface AdminAuthProps {
  onAuth: () => void;
}

const AdminAuth = ({ onAuth }: AdminAuthProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      // Set password first so the helper sends it
      setAdminPassword(password);
      await adminApi('login');
      onAuth();
    } catch (err: any) {
      // Wipe stored credential on failure
      localStorage.removeItem('admin_password');
      localStorage.removeItem('admin_auth');
      setError('Неверный пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 bg-card p-8 rounded-lg border shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">Админ-панель</h1>
        </div>
        <div className="space-y-2">
          <Label>Пароль</Label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Проверка…' : 'Войти'}
        </Button>
      </form>
    </div>
  );
};

export default AdminAuth;
