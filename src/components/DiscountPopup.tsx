import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Раз в сессию: sessionStorage очищается при закрытии вкладки/браузера.
// Если пользователь оставил контакты — больше не показываем (постоянный флаг).
const SESSION_KEY = 'asana_discount_popup_shown_session';
const SUBMITTED_KEY = 'asana_discount_popup_submitted';
const DELAY_MS = 15000;

const DiscountPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(SUBMITTED_KEY)) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) sessionStorage.setItem(SESSION_KEY, '1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) return;
    setLoading(true);
    const { error } = await supabase.from('leads').insert({
      email: email || null,
      phone: phone || null,
      source: 'popup_discount_10',
    });
    setLoading(false);
    if (error) {
      toast.error('Не удалось отправить. Попробуйте ещё раз');
      return;
    }
    localStorage.setItem(SUBMITTED_KEY, '1');
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-8">
        {done ? (
          <div className="text-center py-4">
            <h3 className="text-2xl font-semibold uppercase tracking-[0.18em] mb-3">Спасибо!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Промокод на скидку 10% отправим на указанные контакты.
            </p>
            <Button onClick={() => handleClose(false)} className="rounded-none h-11 px-8 text-xs uppercase tracking-[0.22em]">
              Продолжить покупки
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">āsana</p>
              <h3 className="text-3xl font-semibold uppercase tracking-[0.06em] mb-2">−10%</h3>
              <p className="text-sm text-muted-foreground">
                Скидка на первый заказ — оставьте email или телефон, отправим промокод.
              </p>
            </div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none h-11"
            />
            <Input
              type="tel"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-none h-11"
            />
            <Button
              type="submit"
              disabled={loading || (!email && !phone)}
              className="w-full rounded-none h-11 text-xs uppercase tracking-[0.22em]"
            >
              {loading ? 'Отправка…' : 'Получить скидку'}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
              Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DiscountPopup;
