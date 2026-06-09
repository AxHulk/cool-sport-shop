import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, MapPin, Package, Home } from 'lucide-react';

interface CdekCity {
  code: number;
  city: string;
  region: string;
  full: string;
}

interface CdekPoint {
  code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  work_time: string;
  phones: string[];
  is_dressing_room: boolean;
  type: string; // PVZ | POSTAMAT
  nearest_metro_station?: string;
}

export interface CdekSelection {
  city_code: number;
  city_name: string;
  mode: 'pickup' | 'courier_fitting';
  price: number;
  period_min?: number;
  period_max?: number;
  pvz_code?: string;
  pvz_address?: string;
  courier_address?: string;
}

interface Props {
  quantity: number;
  value: CdekSelection | null;
  onChange: (v: CdekSelection | null) => void;
}

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const fnUrl = (action: string) =>
  `https://${PROJECT_ID}.supabase.co/functions/v1/cdek?action=${action}`;

async function cdekCall(action: string, body: Record<string, unknown> = {}) {
  const res = await fetch(fnUrl(action), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `СДЭК: ошибка ${res.status}`);
  return data;
}

const CdekDelivery = ({ quantity, value, onChange }: Props) => {
  // City autocomplete
  const [query, setQuery] = useState(value?.city_name || '');
  const [suggestions, setSuggestions] = useState<CdekCity[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const [city, setCity] = useState<CdekCity | null>(
    value ? { code: value.city_code, city: value.city_name, region: '', full: value.city_name } : null,
  );

  const [mode, setMode] = useState<'pickup' | 'courier_fitting' | null>(value?.mode || null);
  const [points, setPoints] = useState<CdekPoint[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<CdekPoint | null>(null);

  const [courierAddress, setCourierAddress] = useState(value?.courier_address || '');

  const [price, setPrice] = useState<{ price: number; period_min?: number; period_max?: number } | null>(
    value ? { price: value.price, period_min: value.period_min, period_max: value.period_max } : null,
  );
  const [requiresManager, setRequiresManager] = useState(false);
  const [calcError, setCalcError] = useState('');
  const [calculating, setCalculating] = useState(false);

  // City search debounce
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (query.trim().length < 2 || (city && query === city.city)) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setLoadingCities(true);
      try {
        const data = await cdekCall('cities', { q: query.trim() });
        setSuggestions(data.cities || []);
        setShowSuggestions(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCities(false);
      }
    }, 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, city]);

  const pickCity = (c: CdekCity) => {
    setCity(c);
    setQuery(c.city);
    setShowSuggestions(false);
    setMode(null);
    setPoints([]);
    setSelectedPoint(null);
    setCourierAddress('');
    setPrice(null);
    onChange(null);
  };

  // Load PVZ when mode = pickup
  useEffect(() => {
    if (!city || mode !== 'pickup') return;
    setLoadingPoints(true);
    cdekCall('pickup-points', { city_code: city.code })
      .then((d) => setPoints(d.points || []))
      .catch((e) => console.error(e))
      .finally(() => setLoadingPoints(false));
  }, [city, mode]);

  // Recalculate price when mode/city changes (one estimate per mode)
  useEffect(() => {
    if (!city || !mode) return;
    setCalculating(true);
    setCalcError('');
    cdekCall('calculate', { city_code: city.code, mode, quantity })
      .then((d) => setPrice({ price: d.price, period_min: d.period_min, period_max: d.period_max }))
      .catch((e) => {
        setCalcError(e.message);
        setPrice(null);
      })
      .finally(() => setCalculating(false));
  }, [city, mode, quantity]);

  // Bubble final selection up when complete
  useEffect(() => {
    if (!city || !mode || !price) {
      onChange(null);
      return;
    }
    if (mode === 'pickup' && !selectedPoint) {
      onChange(null);
      return;
    }
    if (mode === 'courier_fitting' && !courierAddress.trim()) {
      onChange(null);
      return;
    }
    onChange({
      city_code: city.code,
      city_name: city.city,
      mode,
      price: price.price,
      period_min: price.period_min,
      period_max: price.period_max,
      pvz_code: selectedPoint?.code,
      pvz_address: selectedPoint?.address,
      courier_address: mode === 'courier_fitting' ? courierAddress.trim() : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, mode, price, selectedPoint, courierAddress]);

  return (
    <div className="space-y-5">
      {/* Город */}
      <div className="relative">
        <Label>Город *</Label>
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (city && e.target.value !== city.city) setCity(null);
          }}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Начните вводить город…"
          autoComplete="off"
        />
        {loadingCities && (
          <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-md border bg-popover shadow-lg">
            {suggestions.map((s) => (
              <button
                key={s.code}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickCity(s)}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <div className="font-medium">{s.city}</div>
                <div className="text-xs text-muted-foreground">{s.region}</div>
              </button>
            ))}
          </div>
        )}
        {city && (
          <p className="text-xs text-muted-foreground mt-1">
            Выбрано: {city.full || city.city}
          </p>
        )}
      </div>

      {/* Способ доставки */}
      {city && (
        <div>
          <Label className="mb-2 block">Способ доставки СДЭК *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('pickup')}
              className={cn(
                'border rounded-md p-4 text-left transition-colors',
                mode === 'pickup' ? 'border-foreground bg-foreground text-background' : 'hover:bg-secondary/40',
              )}
            >
              <Package className="h-5 w-5 mb-2" />
              <div className="font-medium">Пункт выдачи</div>
              <div className={cn('text-xs mt-1', mode === 'pickup' ? 'opacity-80' : 'text-muted-foreground')}>
                Получение в ПВЗ или постамате СДЭК
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode('courier_fitting')}
              className={cn(
                'border rounded-md p-4 text-left transition-colors',
                mode === 'courier_fitting' ? 'border-foreground bg-foreground text-background' : 'hover:bg-secondary/40',
              )}
            >
              <Home className="h-5 w-5 mb-2" />
              <div className="font-medium">Курьером с примеркой</div>
              <div className={cn('text-xs mt-1', mode === 'courier_fitting' ? 'opacity-80' : 'text-muted-foreground')}>
                Доставка до двери, можно примерить
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ПВЗ */}
      {city && mode === 'pickup' && (
        <div>
          <Label className="mb-2 block">Выберите пункт выдачи *</Label>
          {loadingPoints ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Загружаем пункты выдачи…
            </div>
          ) : points.length === 0 ? (
            <p className="text-sm text-muted-foreground">В этом городе пункты выдачи не найдены.</p>
          ) : (
            <div className="max-h-72 overflow-auto border rounded-md divide-y">
              {points.map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setSelectedPoint(p)}
                  className={cn(
                    'w-full text-left p-3 text-sm transition-colors',
                    selectedPoint?.code === p.code ? 'bg-foreground text-background' : 'hover:bg-secondary/40',
                  )}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{p.name}</div>
                      <div className={cn('text-xs mt-0.5', selectedPoint?.code === p.code ? 'opacity-80' : 'text-muted-foreground')}>
                        {p.address}
                      </div>
                      {p.work_time && (
                        <div className={cn('text-xs mt-0.5', selectedPoint?.code === p.code ? 'opacity-80' : 'text-muted-foreground')}>
                          🕘 {p.work_time}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-1 text-[10px] uppercase tracking-wider">
                        <span className={cn('px-1.5 py-0.5 rounded', selectedPoint?.code === p.code ? 'bg-background/20' : 'bg-secondary')}>
                          {p.type === 'POSTAMAT' ? 'Постамат' : 'ПВЗ'}
                        </span>
                        {p.is_dressing_room && (
                          <span className={cn('px-1.5 py-0.5 rounded', selectedPoint?.code === p.code ? 'bg-background/20' : 'bg-secondary')}>
                            примерочная
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Курьер */}
      {city && mode === 'courier_fitting' && (
        <div>
          <Label>Адрес доставки *</Label>
          <Input
            value={courierAddress}
            onChange={(e) => setCourierAddress(e.target.value)}
            placeholder="ул. Примерная, д. 1, кв. 10"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Курьер привезёт и подождёт примерки до 15 минут.
          </p>
        </div>
      )}

      {/* Стоимость */}
      {city && mode && (
        <div className="border rounded-md p-3 bg-secondary/30 text-sm">
          {calculating ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Рассчитываем стоимость…
            </div>
          ) : calcError ? (
            <p className="text-destructive">Не удалось рассчитать: {calcError}</p>
          ) : price ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Стоимость доставки СДЭК</div>
                {price.period_min !== undefined && (
                  <div className="text-xs text-muted-foreground">
                    Срок: {price.period_min}–{price.period_max} раб. дн.
                  </div>
                )}
              </div>
              <div className="text-lg font-semibold">{price.price.toLocaleString('ru-RU')} ₽</div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CdekDelivery;
