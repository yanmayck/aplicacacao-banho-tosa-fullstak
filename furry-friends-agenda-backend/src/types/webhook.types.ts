// Interfaces específicas para webhooks
export interface TwilioSMSWebhookPayload {
  MessageSid: string;
  MessageStatus: string;
  From: string;
  To: string;
  Body: string;
  ErrorCode?: string;
  ErrorMessage?: string;
  [key: string]: any;
}

export interface TwilioWhatsAppWebhookPayload {
  MessageSid: string;
  MessageStatus: string;
  From: string;
  To: string;
  Body: string;
  ErrorCode?: string;
  ErrorMessage?: string;
  [key: string]: any;
}

export interface SendGridEmailWebhookPayload {
  event: string;
  sg_message_id: string;
  email: string;
  timestamp: string;
  reason?: string;
  status?: string;
  [key: string]: any;
}

export interface WhatsAppBusinessWebhookPayload {
  entry: Array<{
    changes: Array<{
      value: {
        message?: {
          from: string;
          text?: { body: string };
          [key: string]: any;
        };
        status?: string;
        error?: any;
        id?: string;
        [key: string]: any;
      };
      [key: string]: any;
    }>;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface WebhookLogData {
  providerResponse?: any;
  errorCode?: string;
  errorMessage?: string;
  email?: string;
  timestamp?: string;
  reason?: string;
}

export interface TestWebhookData {
  [key: string]: any;
}
