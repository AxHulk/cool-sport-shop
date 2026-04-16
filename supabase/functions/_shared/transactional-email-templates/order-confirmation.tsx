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

interface OrderConfirmationProps {
  orderNumber?: string
  customerName?: string
  items?: OrderItem[]
  totalPrice?: number
  deliveryPrice?: number
  deliveryMethod?: string
  city?: string
  address?: string
  paymentMethod?: string
  discountAmount?: number
}

const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽'

const OrderConfirmationEmail = ({
  orderNumber = '00000',
  customerName = 'Клиент',
  items = [],
  totalPrice = 0,
  deliveryPrice = 0,
  deliveryMethod = '',
  city = '',
  address = '',
  paymentMethod = '',
  discountAmount = 0,
}: OrderConfirmationProps) => {
  const finalPrice = totalPrice + deliveryPrice
  const deliveryLabel = deliveryMethod === 'courier' ? 'Курьер' : 'Пункт выдачи'
  const paymentLabel = paymentMethod === 'card' ? 'Карта' : 'СБП'

  return (
    <Html lang="ru" dir="ltr">
      <Head />
      <Preview>Заказ №{orderNumber} оформлен — {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Спасибо за заказ, {customerName}!</Heading>
          <Text style={text}>
            Ваш заказ <strong>№{orderNumber}</strong> успешно оформлен. Мы свяжемся с вами для подтверждения.
          </Text>

          <Hr style={hr} />

          {items.length > 0 && (
            <Section>
              <Text style={sectionTitle}>Состав заказа</Text>
              {items.map((item, i) => (
                <Row key={i} style={itemRow}>
                  <Column>
                    <Text style={itemText}>
                      {item.name} — {item.color}, {item.size} × {item.quantity}
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
                <Column><Text style={summaryText}>Скидка</Text></Column>
                <Column align="right"><Text style={accentText}>-{formatPrice(discountAmount)}</Text></Column>
              </Row>
            )}
            <Row>
              <Column><Text style={summaryText}>Доставка ({deliveryLabel})</Text></Column>
              <Column align="right"><Text style={summaryText}>{deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice)}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={totalText}>Итого</Text></Column>
              <Column align="right"><Text style={totalText}>{formatPrice(finalPrice)}</Text></Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={sectionTitle}>Доставка</Text>
            <Text style={text}>{deliveryLabel}, {city}{address ? `, ${address}` : ''}</Text>
            <Text style={sectionTitle}>Оплата</Text>
            <Text style={text}>{paymentLabel}</Text>
          </Section>

          <Text style={footer}>С любовью, команда {SITE_NAME}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderConfirmationEmail,
  subject: (data: Record<string, any>) => `Заказ №${data.orderNumber || ''} оформлен — ${SITE_NAME}`,
  displayName: 'Подтверждение заказа',
  previewData: {
    orderNumber: '12345',
    customerName: 'Анна',
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
  },
} satisfies TemplateEntry

// Styles — brand: dark primary, accent rose, Plus Jakarta Sans
const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: 'hsl(0, 0%, 12%)', margin: '0 0 16px' }
const text = { fontSize: '14px', color: 'hsl(0, 0%, 45%)', lineHeight: '1.6', margin: '0 0 8px' }
const sectionTitle = { fontSize: '13px', fontWeight: '600' as const, color: 'hsl(0, 0%, 12%)', margin: '12px 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const hr = { borderColor: 'hsl(30, 15%, 90%)', margin: '20px 0' }
const itemRow = { marginBottom: '4px' }
const itemText = { fontSize: '14px', color: 'hsl(0, 0%, 25%)', margin: '2px 0' }
const itemPrice = { fontSize: '14px', fontWeight: '600' as const, color: 'hsl(0, 0%, 12%)', margin: '2px 0' }
const summaryText = { fontSize: '14px', color: 'hsl(0, 0%, 45%)', margin: '4px 0' }
const accentText = { fontSize: '14px', color: 'hsl(350, 60%, 72%)', fontWeight: '600' as const, margin: '4px 0' }
const totalText = { fontSize: '16px', fontWeight: '700' as const, color: 'hsl(0, 0%, 12%)', margin: '8px 0' }
const footer = { fontSize: '12px', color: 'hsl(0, 0%, 65%)', margin: '24px 0 0' }
