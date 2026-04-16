import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

type Status = 'loading' | 'valid' | 'already' | 'invalid' | 'success' | 'error';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }

    const validate = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`;
        const res = await fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } });
        if (!res.ok) { setStatus('invalid'); return; }
        const data = await res.json();
        if (data.valid === false && data.reason === 'already_unsubscribed') setStatus('already');
        else if (data.valid) setStatus('valid');
        else setStatus('invalid');
      } catch { setStatus('error'); }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data } = await supabase.functions.invoke('handle-email-unsubscribe', { body: { token } });
      if (data?.success) setStatus('success');
      else if (data?.reason === 'already_unsubscribed') setStatus('already');
      else setStatus('error');
    } catch { setStatus('error'); }
    setSubmitting(false);
  };

  return (
    <div className="container py-20 text-center max-w-md mx-auto">
      {status === 'loading' && <p className="text-muted-foreground">Загрузка...</p>}
      {status === 'valid' && (
        <>
          <h1 className="text-2xl font-serif mb-4">Отписка от рассылки</h1>
          <p className="text-muted-foreground mb-6">Вы уверены, что хотите отписаться от наших писем?</p>
          <Button onClick={handleUnsubscribe} disabled={submitting}>
            {submitting ? 'Обработка...' : 'Подтвердить отписку'}
          </Button>
        </>
      )}
      {status === 'success' && (
        <>
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
          <h1 className="text-2xl font-serif mb-4">Вы отписаны</h1>
          <p className="text-muted-foreground">Вы больше не будете получать наши письма.</p>
        </>
      )}
      {status === 'already' && (
        <>
          <h1 className="text-2xl font-serif mb-4">Уже отписаны</h1>
          <p className="text-muted-foreground">Вы уже были отписаны от нашей рассылки ранее.</p>
        </>
      )}
      {status === 'invalid' && (
        <>
          <h1 className="text-2xl font-serif mb-4">Ошибка</h1>
          <p className="text-muted-foreground">Недействительная или истёкшая ссылка для отписки.</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="text-2xl font-serif mb-4">Ошибка</h1>
          <p className="text-muted-foreground">Произошла ошибка. Попробуйте позже.</p>
        </>
      )}
    </div>
  );
};

export default Unsubscribe;
