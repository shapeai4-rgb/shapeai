// Абстрактный интерфейс для платежных систем
export interface PaymentProvider {
  createCheckoutSession(params: CheckoutParams): Promise<CheckoutResult>;
  handleWebhook(payload: string, signature: string): Promise<WebhookResult>;
}

export interface CheckoutParams {
  userId: string;
  amount: number;
  currency: 'eur' | 'gbp' | 'usd';
  planId?: string;
  customAmount?: number;
}

export interface CheckoutResult {
  url: string;
  sessionId: string;
}

export interface WebhookResult {
  success: boolean;
  userId?: string;
  tokensToAdd?: number;
}

// Конфигурация платежной системы
export const PAYMENT_CONFIG = {
  provider: process.env.PAYMENT_PROVIDER || 'free',
  freeMode: {
    enabled: true,
    maxTokensPerDay: 1000, // Лимит для предотвращения злоупотреблений
  }
};

// Функция для получения текущего провайдера платежей
export function getPaymentProvider(): PaymentProvider {
  switch (PAYMENT_CONFIG.provider) {
    case 'free':
      return new FreePaymentProvider();
    case 'stripe':
      // Для будущего использования
      throw new Error('Stripe provider not implemented yet');
    default:
      return new FreePaymentProvider();
  }
}

// Бесплатная реализация платежной системы
class FreePaymentProvider implements PaymentProvider {
  async createCheckoutSession(params: CheckoutParams): Promise<CheckoutResult> {
    const sessionId = `free_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Возвращаем URL для обработки на клиенте
    // Используем правильный базовый URL в зависимости от окружения
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://shapeai.co.uk' 
      : 'http://localhost:3000';
    const url = new URL('/api/top-up/free', baseUrl);
    url.searchParams.set('userId', params.userId);
    url.searchParams.set('amount', params.amount.toString());
    url.searchParams.set('currency', params.currency);
    url.searchParams.set('sessionId', sessionId);
    
    if (params.planId) {
      url.searchParams.set('planId', params.planId);
    }
    if (params.customAmount) {
      url.searchParams.set('customAmount', params.customAmount.toString());
    }
    
    return {
      url: url.toString(),
      sessionId
    };
  }
  
  async handleWebhook(): Promise<WebhookResult> {
    // В бесплатном режиме webhook не используется
    return { success: true };
  }
}
