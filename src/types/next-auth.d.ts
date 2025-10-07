import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Расширяем стандартный тип Session, добавляя наши кастомные поля
   */
  interface Session {
    user: {
      id: string;
      tokenBalance: number; // ★ Сделали обязательным
    } & DefaultSession['user'];
  }

  /**
   * Расширяем стандартный тип User, который используется в колбэках
   */
  interface User {
    tokenBalance?: number;
  }
}

// Расширяем тип JWT
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    tokenBalance: number;
  }
}