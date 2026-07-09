import { MailService } from './mail.service';
export declare class MailController {
    private mailService;
    constructor(mailService: MailService);
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
}
