import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  name: string;
  url: string;
}

interface Props {
  items: Crumb[];
  className?: string;
}

const Breadcrumbs = ({ items, className }: Props) => {
  if (!items.length) return null;
  return (
    <nav aria-label="Хлебные крошки" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-foreground font-medium">
                  {item.name}
                </span>
              ) : (
                <Link to={item.url} className="hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
