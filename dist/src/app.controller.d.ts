import type { Response } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getLanding(res: Response): Promise<void>;
    health(): Promise<{
        status: string;
        timestamp: string;
        database: string;
        uptime: number;
    }>;
    getLoginPage(res: Response): void;
    getSignupPage(res: Response): void;
    getAdminLoginPage(res: Response): void;
    getDashboardPage(res: Response): void;
}
