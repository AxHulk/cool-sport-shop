/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "ASANA"

interface OrderItem {
  name: string
  size: string
  color: string
  quantity: number
  price: number
}

interface AdminOrderNotificationProps {
  orderNumber?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  items?: OrderItem[]
  totalPrice?: number
  deliveryPrice?: number
  deliveryMethod?: string
  city?: string
  address?: string
  paymentMethod?: string
  paymentStatus?: 'pending' | 'paid' | 'cancelled' | string
  discountAmount?: number
  promoCode?: string | null
}

const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽'

const paymentStatusMeta = (s?: string) => {
  switch (s) {
    case 'paid':
      return { label: '✅ Оплачен', bg: '#e8f5ec', color: '#1b6b34', border: '#bfe3c9' }
    case 'cancelled':
      return { label: '❌ Не оплачен / отменён', bg: '#fdecec', color: '#9a2b2b', border: '#f3c2c2' }
    case 'pending':
    default:
      return { label: '⏳ Ожидает оплаты', bg: '#fff4e0', color: '#8a5a00', border: '#f5d99a' }
  }
}

const AdminOrderNotificationEmail = ({
  orderNumber = '00000',
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  items = [],
  totalPrice = 0,
  deliveryPrice = 0,
  deliveryMethod = '',
  city = '',
  address = '',
  paymentMethod = '',
  paymentStatus = 'pending',
  discountAmount = 0,
  promoCode = null,
}: AdminOrderNotificationProps) => {
  const finalPrice = totalPrice + deliveryPrice
  const deliveryLabel = deliveryMethod === 'courier' ? 'Курьер' : 'Пункт выдачи'
  const paymentLabel = paymentMethod === 'card' ? 'Карта' : paymentMethod === 'sbp' ? 'СБП' : paymentMethod === 'dolyami' ? 'Долями' : paymentMethod
  const statusMeta = paymentStatusMeta(paymentStatus)

  return (
    <Html lang="ru" dir="ltr">
      <Head />
      <Preview>Новый заказ №{orderNumber} — {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🛒 Новый заказ №{orderNumber}</Heading>

          <Section style={{ marginBottom: '8px' }}>
            <Text
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: statusMeta.bg,
                color: statusMeta.color,
                border: `1px solid ${statusMeta.border}`,
                margin: '0 0 8px',
              }}
            >
              {statusMeta.label}
            </Text>
          </Section>

          <Section>
            <Text style={sectionTitle}>Клиент</Text>
            <Text style={text}><strong>Имя:</strong> {customerName}</Text>
            <Text style={text}><strong>Телефон:</strong> {customerPhone}</Text>
            <Text style={text}><strong>Email:</strong> {customerEmail}</Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={sectionTitle}>Доставка</Text>
            <Text style={text}>{deliveryLabel}</Text>
            <Text style={text}>{city}{address ? `, ${address}` : ''}</Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={sectionTitle}>Оплата</Text>
            <Text style={text}>{paymentLabel} — {statusMeta.label}</Text>
          </Section>

          <Hr style={hr} />

          {items.length > 0 && (
            <Section>
              <Text style={sectionTitle}>Состав заказа</Text>
              {items.map((item, i) => (
                <Row key={i} style={itemRow}>
                  <Column>
                    <Text style={itemText}>
                      {i + 1}. {item.name} — {item.color}, {item.size} × {item.quantity}
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text style={itemPrice}>{formatPrice(item.price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          <Hr style={hr} />

          <Section>
            {discountAmount > 0 && (
              <Row>
                <Column><Text style={summaryText}>Скидка{promoCode ? ` (${promoCode})` : ''}</Text></Column>
                <Column align="right"><Text style={accentText}>-{formatPrice(discountAmount)}</Text></Column>
              </Row>
            )}
            <Row>
              <Column><Text style={summaryText}>Доставка</Text></Column>
              <Column align="right"><Text style={summaryText}>{deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice)}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={totalText}>Итого</Text></Column>
              <Column align="right"><Text style={totalText}>{formatPrice(finalPrice)}</Text></Column>
            </Row>
          </Section>

          <Text style={footer}>{SITE_NAME} · автоматическое уведомление</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: AdminOrderNotificationEmail,
  subject: (data: Record<string, any>) => `🛒 Новый заказ №${data.orderNumber || ''} — ${data.customerName || ''}`,
  displayName: 'Уведомление администратору о заказе',
  to: 'asana.wear@yandex.ru',
  previewData: {
    orderNumber: '12345',
    customerName: 'Анна Иванова',
    customerEmail: 'anna@example.com',
    customerPhone: '+7 (999) 123-45-67',
    items: [
      { name: 'Леггинсы Sport Pro', size: 'M', color: 'Чёрный', quantity: 1, price: 4990 },
      { name: 'Топ Active', size: 'S', color: 'Белый', quantity: 2, price: 5980 },
    ],
    totalPrice: 10970,
    deliveryPrice: 0,
    deliveryMethod: 'courier',
    city: 'Москва',
    address: 'ул. Примерная, д. 1',
    paymentMethod: 'card',
    discountAmount: 500,
    promoCode: null,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: 'hsl(0, 0%, 12%)', margin: '0 0 16px' }
const text = { fontSize: '14px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '0 0 6px' }
const sectionTitle = { fontSize: '13px', fontWeight: '600' as const, color: 'hsl(0, 0%, 12%)', margin: '12px 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const hr = { borderColor: 'hsl(30, 15%, 90%)', margin: '20px 0' }
const itemRow = { marginBottom: '4px' }
const itemText = { fontSize: '14px', color: 'hsl(0, 0%, 25%)', margin: '2px 0' }
const itemPrice = { fontSize: '14px', fontWeight: '600' as const, color: 'hsl(0, 0%, 12%)', margin: '2px 0' }
const summaryText = { fontSize: '14px', color: 'hsl(0, 0%, 45%)', margin: '4px 0' }
const accentText = { fontSize: '14px', color: 'hsl(350, 60%, 72%)', fontWeight: '600' as const, margin: '4px 0' }
const totalText = { fontSize: '16px', fontWeight: '700' as const, color: 'hsl(0, 0%, 12%)', margin: '8px 0' }
const footer = { fontSize: '12px', color: 'hsl(0, 0%, 65%)', margin: '24px 0 0' }
