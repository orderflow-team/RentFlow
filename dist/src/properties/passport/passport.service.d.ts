import { PrismaService } from '../../prisma/prisma.service';
export declare class PassportService {
    private prisma;
    constructor(prisma: PrismaService);
    logEvent(companyId: string, propertyId: string, eventType: string, description: string, metadata?: any): Promise<{
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        description: string;
        propertyId: string;
        eventType: string;
        eventDate: Date;
    }>;
    getPassport(companyId: string, propertyId: string): Promise<{
        property: {
            id: string;
            name: string;
            address: string;
            totalUnits: number;
        };
        history: {
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            description: string;
            propertyId: string;
            eventType: string;
            eventDate: Date;
        }[];
    }>;
}
