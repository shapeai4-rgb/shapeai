export function isWithoutPaymentEnabled() {
  const value = process.env.WITHOUT_PAYMENT?.trim().toLowerCase();
  return value === "true";
}
