export const paymentInfo = (s?: string | null) => {
  if (s === 'CONFIRMED') return { label: 'Оплачен', cls: 'bg-green-100 text-green-800' };
  if (s === 'AUTHORIZED') return { label: 'Авторизован — ждёт списания', cls: 'bg-yellow-100 text-yellow-800' };
  if (['AUTH_FAIL', 'REJECTED', 'CANCELED', 'DEADLINE_EXPIRED', 'REVERSED', 'REFUNDED'].includes(s || ''))
    return { label: 'Не прошла', cls: 'bg-red-100 text-red-800' };
  return { label: 'Ожидает', cls: 'bg-yellow-100 text-yellow-800' };
};
