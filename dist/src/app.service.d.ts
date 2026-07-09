import { PrismaService } from './prisma/prisma.service';
export declare class AppService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        status: string;
        name: string;
        version: string;
        environment: string;
        uptime: number;
        uptimeStr: string;
        timestamp: string;
        now: Date;
        database: string;
        stats: {
            companies: number;
            users: number;
            properties: number;
            buildings: number;
            units: {
                total: number;
                occupied: number;
                vacant: number;
            };
            tenants: number;
            owners: number;
        };
        modules: {
            name: string;
            version: string;
            status: string;
            endpoints: number;
        }[];
    } | {
        status: string;
        name: string;
        version: string;
        environment: string;
        uptime: number;
        timestamp: string;
        now: Date;
        database: string;
        stats: null;
        modules: never[];
        uptimeStr?: undefined;
    }>;
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        database: string;
        uptime: number;
    }>;
    private esc;
    getLandingPage(dashboard: any): string;
    getAdminLoginPage(): string;
    getLoginPage(): string;
    getSignupPage(): string;
    getDashboardPage(): string;
}
