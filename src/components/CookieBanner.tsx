import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const COOKIE_KEY = 'cookie_consent_accepted';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="container max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          Уважаемый посетитель, наш сайт использует файлы cookie и схожие технологии (метрические системы) для персонализации контента, анализа трафика и обеспечения технической работоспособности интерфейса. Продолжая использовать сайт, вы даёте своё согласие на обработку данных файлов в строгом соответствии с нашей{' '}
          <Link to="/privacy" className="underline text-foreground hover:text-accent">
            Политикой конфиденциальности
          </Link>
          . Вы имеете право отключить использование cookie в настройках вашего веб-браузера.
        </p>
        <Button onClick={accept} className="shrink-0">
          Принимаю
        </Button>
      </div>
    </div>
  );
};

export default CookieBanner;
