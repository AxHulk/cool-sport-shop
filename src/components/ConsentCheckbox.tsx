import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
}

const ConsentCheckbox = ({ id, checked, onCheckedChange, error }: ConsentCheckboxProps) => (
  <div>
    <div className="flex items-start gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(!!v)}
        className={`mt-0.5 ${error ? 'border-destructive' : ''}`}
      />
      <label htmlFor={id} className="text-xs text-muted-foreground leading-tight cursor-pointer">
        Я свободно, своей волей и в своём интересе даю конкретное, информированное и сознательное согласие на обработку моих персональных данных и полностью принимаю условия{' '}
        <Link to="/privacy" className="underline text-foreground hover:text-accent" target="_blank">
          Политики конфиденциальности
        </Link>
      </label>
    </div>
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export default ConsentCheckbox;
