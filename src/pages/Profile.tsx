import { User, Package, Heart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const Profile = () => (
  <div className="container py-12 max-w-2xl mx-auto">
    <SEO title="Личный кабинет" description="Личный кабинет покупателя āsana." noindex />
    <h1 className="text-3xl font-serif mb-8">Личный кабинет</h1>

    <div className="bg-secondary rounded-lg p-6 mb-6 flex items-center gap-4">
      <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center">
        <User className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">Гостевой доступ</p>
        <p className="text-sm text-muted-foreground">Войдите, чтобы отслеживать заказы</p>
      </div>
    </div>

    <div className="space-y-3">
      {[
        { icon: Package, label: 'Мои заказы', to: '#' },
        { icon: Heart, label: 'Избранное', to: '/favorites' },
      ].map(item => (
        <Link key={item.label} to={item.to} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-secondary transition-colors">
          <item.icon className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
    </div>

    <Button variant="ghost" className="mt-6 text-muted-foreground">
      <LogOut className="h-4 w-4 mr-2" /> Выйти
    </Button>
  </div>
);

export default Profile;
