export declare class SmsService {
    private readonly logger;
    constructor();
    sendOtp(phone: string, code: string): Promise<void>;
}
