import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tokenBalance?: number; // ★★★ Добавляем баланс токенов
    } & DefaultSession["user"];
  }
}

// ★★★ Добавляем расширение для объекта User из базы данных
declare module "@auth/prisma-adapter" {
    interface AdapterUser extends User {
        tokenBalance: number;
    }
}