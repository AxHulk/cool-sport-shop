import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export const DOLYAMI_MIN = 5000;
export const DOLYAMI_MAX = 200000;
export const DOLYAMI_PARTS = 4;

export const isDolyamiEligible = (price: number) =>
  price >= DOLYAMI_MIN && price <= DOLYAMI_MAX;

export const dolyamiPart = (price: number) => Math.ceil(price / DOLYAMI_PARTS);

const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';

const formatDate = (d: Date) =>
  d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

const DolyamiLogo = ({ className }: { className?: string }) => (
  // Compact wordmark — neutral, monochrome to fit the site
  <span
    className={cn(
      'inline-flex items-center font-semibold tracking-tight lowercase',
      className,
    )}
  >
    долями
  </span>
);

interface DolyamiBadgeProps {
  price: number;
  /** 'inline' — compact text line; 'block' — bordered block (product page / checkout) */
  variant?: 'inline' | 'block';
  className?: string;
}

const DolyamiBadge = ({ price, variant = 'inline', className }: DolyamiBadgeProps) => {
  const [open, setOpen] = useState(false);

  if (!isDolyamiEligible(price)) return null;

  const part = dolyamiPart(price);
  const today = new Date();
  const schedule = Array.from({ length: DOLYAMI_PARTS }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i * 14);
    return {
      date: d,
      amount: i === DOLYAMI_PARTS - 1 ? price - part * (DOLYAMI_PARTS - 1) : part,
      label: i === 0 ? 'Сегодня' : formatDate(d),
    };
  });

  const trigger =
    variant === 'block' ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3 border border-border bg-card hover:bg-secondary/40 transition-colors text-left',
          className,
        )}
        aria-label="Подробнее об оплате Долями"
      >
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            или 4 платежа по
          </span>
          <span className="text-base md:text-lg font-semibold mt-0.5">
            {formatPrice(part)}{' '}
            <span className="text-xs text-muted-foreground font-normal">
              без переплат
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <DolyamiLogo className="text-sm" />
          <span className="text-muted-foreground text-xs">i</span>
        </div>
      </button>
    ) : (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={cn(
          'inline-flex items-center gap-1.5 text-[11px] md:text-xs text-muted-foreground hover:text-foreground transition-colors',
          className,
        )}
        aria-label="Подробнее об оплате Долями"
      >
        <span>
          или <span className="font-semibold text-foreground">{formatPrice(part)}</span> × 4
        </span>
        <DolyamiLogo className="text-[11px] md:text-xs" />
      </button>
    );

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl flex items-center gap-2">
              Оплата <DolyamiLogo />
            </DialogTitle>
            <DialogDescription>
              Разделите покупку на 4 равных платежа без процентов и переплат.
              Первый — сегодня, остальные — каждые две недели.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <div className="grid grid-cols-4 gap-2">
              {schedule.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex flex-col items-center text-center px-1 py-3 border',
                    i === 0
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border',
                  )}
                >
                  <span className="text-[10px] uppercase tracking-[0.14em] opacity-80">
                    {s.label}
                  </span>
                  <span className="text-sm font-semibold mt-1.5">
                    {formatPrice(s.amount)}
                  </span>
                  <span className="text-[10px] opacity-60 mt-0.5">25%</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p className="flex justify-between">
                <span>Сумма покупки</span>
                <span className="text-foreground font-medium">{formatPrice(price)}</span>
              </p>
              <p className="flex justify-between">
                <span>Переплата</span>
                <span className="text-foreground font-medium">0 ₽</span>
              </p>
            </div>

            <ul className="mt-5 space-y-1.5 text-xs text-muted-foreground">
              <li>· Без процентов, комиссий и скрытых платежей</li>
              <li>· Оформление за 2 минуты по паспорту</li>
              <li>· Доступно для сумм от {formatPrice(DOLYAMI_MIN)} до {formatPrice(DOLYAMI_MAX)}</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DolyamiBadge;
