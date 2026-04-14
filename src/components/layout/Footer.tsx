import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Instagram, Send } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-20">
    <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <img src={logo} alt="āsana" className="h-6 mb-4 brightness-0 invert" />
        <p className="text-sm opacity-80">Премиальная спортивная одежда для женщин, которые выбирают стиль и комфорт.</p>
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
        </div>
      </div>
      <div>
        <h4 className="font-sans text-sm font-semibold mb-3 uppercase tracking-wider">Подписка</h4>
        <p className="text-sm opacity-80 mb-3">Скидка 10% на первый заказ</p>
        <div className="flex gap-2">
          <Input placeholder="Email" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" />
          <Button variant="secondary" size="icon"><Send className="h-4 w-4" /></Button>
        </div>
        <div className="flex gap-3 mt-4">
          <a href="#" className="opacity-80 hover:opacity-100"><Instagram className="h-5 w-5" /></a>
          <a href="#" className="opacity-80 hover:opacity-100"><Send className="h-5 w-5" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10 py-4">
      <div className="container text-center text-xs opacity-60">
        © 2026 āsana. Все права защищены.
      </div>
    </div>
  </footer>
);

export default Footer;
