// Содержимое для src/middleware.ts

// Экспортируем дефолтный middleware из next-auth
// Он автоматически будет защищать все страницы, указанные в 'matcher'
export { default } from "next-auth/middleware";

// 'config' определяет, к каким именно страницам применять этот middleware
export const config = {
  matcher: [
    "/plan", // Защищаем страницу с планом питания
    // Сюда можно добавлять и другие страницы в будущем, например:
    // "/settings",
    // "/api/protected-route",
  ],
};