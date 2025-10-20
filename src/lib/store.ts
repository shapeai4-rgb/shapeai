// Содержимое для src/lib/store.ts

import { create } from 'zustand';

// Определяем типы для нашего хранилища
type Currency = 'EUR' | 'GBP' | 'USD';

type AppState = {
  // Состояние для валюты
  currency: Currency;
  setCurrency: (currency: Currency) => void;

  // Сюда мы в будущем добавим состояние пользователя,
  // чтобы не вызывать useSession() в каждом компоненте.
  // user: User | null;
  // setUser: (user: User | null) => void;
};

// Создаем хук, который будет нашим хранилищем
export const useAppStore = create<AppState>((set) => ({
  // Начальное состояние
  currency: 'EUR',
  
  // Функция для обновления состояния
  setCurrency: (newCurrency) => set({ currency: newCurrency }),

  // user: null,
  // setUser: (newUser) => set({ user: newUser }),
}));