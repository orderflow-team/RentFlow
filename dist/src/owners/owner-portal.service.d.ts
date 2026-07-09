import { PrismaService } from '../prisma/prisma.service';
export declare class OwnerPortalService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyProperties(companyId: string, ownerId: string): Promise<({
        buildings: ({
            units: {
                id: string;
                name: string;
                status: import("@prisma/client").$Enums.UnitStatus;
                rentAmount: number | null;
            }[];
        } & {
            id: string;
            name: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyId: string;
            description: string | null;
            totalUnits: number;
            yearBuilt: number | null;
            amenities: import("@prisma/client/runtime/client").JsonValue | null;
            propertyId: string;
            code: string | null;
            totalFloors: number | null;
        })[];
    } & {
        id: string;
        name: string;
        address: string;
        status: import("@prisma/client").$Enums.PropertyStatus;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import("@prisma/client").$Enums.PropertyType;
        companyId: string;
        description: string | null;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        totalUnits: number;
        yearBuilt: number | null;
        amenities: import("@prisma/client/runtime/client").JsonValue | null;
        images: import("@prisma/client/runtime/client").JsonValue | null;
        createdById: string | null;
        updatedById: string | null;
        notes: string | null;
        latitude: number | null;
        longitude: number | null;
        ownerId: string | null;
        managerId: string | null;
        expectedAvailability: Date | null;
        prefFamily: boolean;
        prefMarried: boolean;
        prefLiveIn: boolean;
        prefStudents: boolean;
        prefProfessionals: boolean;
        prefPetFriendly: boolean;
        prefVegetarian: boolean;
        prefSmokingAllowed: boolean;
        furnishedStatus: string | null;
        occupancyType: string | null;
    })[]>;
    getMyFinancialSummary(companyId: string, ownerId: string): Promise<{
        properties: string[];
        totalProperties: number;
        units: {
            total: number;
            occupied: number;
            vacant: number;
        };
        finances: {
            totalRent: number;
            totalCollected: number;
            totalOutstanding: number;
            totalExpenses: number;
            netIncome: number;
        };
    }>;
}
