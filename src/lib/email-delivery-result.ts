export type EmailDeliveryResult = {
  sent: boolean;
  messageId?: string;
  error?: string;
};

export function deliverySkipped(error: string): EmailDeliveryResult {
  return {
    sent: false,
    error,
  };
}
