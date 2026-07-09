import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor() {
    const configured = Boolean(
      process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER,
    );
    if (!configured) {
      this.logger.warn('Twilio not configured — OTP codes will be logged instead of sent');
    }
  }

  // Swap this for a real provider (e.g. Twilio) once
  // TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER are set.
  async sendOtp(phone: string, code: string) {
    this.logger.log(`[DEV] OTP for ${phone}: ${code}`);
  }
}
