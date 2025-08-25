import Stripe from 'stripe';

// Проверяем, что секретный ключ Stripe установлен в переменных окружения.
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
}

// Создаем и экспортируем единый экземпляр клиента Stripe.
// Мы убрали 'apiVersion' и 'typescript', чтобы использовать безопасные
// и корректные значения по умолчанию для вашей версии библиотеки.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);