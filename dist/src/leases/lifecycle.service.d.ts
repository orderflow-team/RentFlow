import { PrismaService } from '../prisma/prisma.service';
import { PassportService } from '../properties/passport/passport.service';
export declare class LifecycleService {
    private prisma;
    private passportService;
    constructor(prisma: PrismaService, passportService: PassportService);
    getLifecycle(companyId: string, leaseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        leaseId: string;
        moveInAgreementSigned: boolean;
        moveInDepositReceived: boolean;
        moveInKycCompleted: boolean;
        moveInPhotosUploaded: boolean;
        moveInKeyHandover: boolean;
        moveOutInspection: boolean;
        moveOutKeyReturn: boolean;
        moveOutDepositSettlement: boolean;
        moveOutExitDoc: boolean;
        communicationLog: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    updateLifecycle(companyId: string, leaseId: string, dto: {
        moveInAgreementSigned?: boolean;
        moveInDepositReceived?: boolean;
        moveInKycCompleted?: boolean;
        moveInPhotosUploaded?: boolean;
        moveInKeyHandover?: boolean;
        moveOutInspection?: boolean;
        moveOutKeyReturn?: boolean;
        moveOutDepositSettlement?: boolean;
        moveOutExitDoc?: boolean;
        communicationLog?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        leaseId: string;
        moveInAgreementSigned: boolean;
        moveInDepositReceived: boolean;
        moveInKycCompleted: boolean;
        moveInPhotosUploaded: boolean;
        moveInKeyHandover: boolean;
        moveOutInspection: boolean;
        moveOutKeyReturn: boolean;
        moveOutDepositSettlement: boolean;
        moveOutExitDoc: boolean;
        communicationLog: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
