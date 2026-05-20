import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import logo from '@/assets/logo.webp';
import payVisa from '@/assets/pay-visa.webp';
import payMastercard from '@/assets/pay-mastercard.webp';
import payMir from '@/assets/pay-mir.webp';
import paySbp from '@/assets/pay-sbp.webp';
import pay3ds from '@/assets/pay-3dsecure.webp';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = () => {
    if (!consent) {
      setError('Необходимо согласие на обработку персональных данных');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Введите корректный email');
      return;
    }
    setError('');
    setEmail('');
    setConsent(false);
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src={logo} alt="āsana" className="h-6 mb-4 brightness-0 invert" />
          <p className="text-sm opacity-80 mb-3">for those who value balance &amp; well-being</p>
          <div className="text-xs opacity-70 space-y-1 mt-4">
            <p>ИП Стрельникова Анастасия Сергеевна</p>
            <p>ИНН 910224027786 · ОГРНИП 324911200048002</p>
            <p>295001, г. Симферополь</p>
            <p>Тел.: +7 (978) 097-57-99</p>
            <p>Email: asana.wear@yandex.ru</p>
          </div>
        </div>
        <div>
          <h4 className="font-sans text-sm font-semibold mb-3 uppercase tracking-wider">Каталог</h4>
          <div className="space-y-2 text-sm opacity-80">
            <Link to="/catalog?category=leggings" className="block hover:opacity-100">Леггинсы</Link>
            <Link to="/catalog?category=tops" className="block hover:opacity-100">Топы</Link>
            <Link to="/catalog?category=rashguards" className="block hover:opacity-100">Рашгарды</Link>
            <Link to="/catalog?category=bags" className="block hover:opacity-100">Сумки</Link>
          </div>
        </div>
        <div>
          <h4 className="font-sans text-sm font-semibold mb-3 uppercase tracking-wider">Информация</h4>
          <div className="space-y-2 text-sm opacity-80">
            <Link to="/about" className="block hover:opacity-100">О бренде</Link>
            <Link to="/delivery" className="block hover:opacity-100">Доставка и оплата</Link>
            <Link to="/contacts" className="block hover:opacity-100">Контакты</Link>
            <Link to="/offer" className="block hover:opacity-100">Публичная оферта</Link>
            <Link to="/privacy" className="block hover:opacity-100">Политика конфиденциальности</Link>
            <Link to="/terms" className="block hover:opacity-100">Пользовательское соглашение</Link>
            <Link to="/payment-security" className="block hover:opacity-100">Безопасность платежей</Link>
          </div>
        </div>
        <div>
          <h4 className="font-sans text-sm font-semibold mb-3 uppercase tracking-wider">Подписка</h4>
          <p className="text-sm opacity-80 mb-3">Скидка 10% на первый заказ*</p>
          <div className="flex gap-2">
            <Input
              placeholder="Email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <Button variant="secondary" size="icon" onClick={handleSubscribe}><Send className="h-4 w-4" /></Button>
          </div>
          <div className="flex items-start gap-2 mt-3">
            <Checkbox
              id="footer-consent"
              checked={consent}
              onCheckedChange={(v) => { setConsent(!!v); setError(''); }}
              className="mt-0.5 border-primary-foreground/40 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
            />
            <label htmlFor="footer-consent" className="text-xs opacity-70 leading-tight cursor-pointer">
              Я даю согласие на обработку моих персональных данных и принимаю условия{' '}
              <Link to="/privacy" className="underline hover:opacity-100">Политики конфиденциальности</Link>
            </label>
          </div>
          {error && <p className="text-xs text-red-300 mt-1">{error}</p>}
          <p className="text-xs opacity-50 mt-3">*неприменимо к комбо наборам и акционным товарам</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs opacity-60">© 2026 āsana. Все права защищены.</p>
          <div className="flex items-center gap-3 opacity-60">
            <img src={payVisa} alt="Visa" className="h-5 object-contain brightness-0 invert" />
            <img src={payMastercard} alt="MasterCard" className="h-5 object-contain" />
            <img src={payMir} alt="МИР" className="h-5 object-contain brightness-0 invert" />
            <img src={paySbp} alt="СБП" className="h-5 object-contain brightness-0 invert" />
            <img src={pay3ds} alt="3D Secure" className="h-5 object-contain brightness-0 invert" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
