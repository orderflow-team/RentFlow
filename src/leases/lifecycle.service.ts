import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PassportService } from '../properties/passport/passport.service';

@Injectable()
export class LifecycleService {
  constructor(
    private prisma: PrismaService,
    private passportService: PassportService,
  ) {}

  async getLifecycle(companyId: string, leaseId: string) {
    const lease = await this.prisma.lease.findFirst({
      where: { id: leaseId, companyId, deletedAt: null },
      include: { leaseLifecycle: true },
    });
    if (!lease) throw new NotFoundException('Lease not found');

    if (!lease.leaseLifecycle) {
      // Create if it doesn't exist
      const lifecycle = await this.prisma.leaseLifecycle.create({
        data: { leaseId },
      });
      return lifecycle;
    }

    return lease.leaseLifecycle;
  }

  async updateLifecycle(
    companyId: string,
    leaseId: string,
    dto: {
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
    },
  ) {
    const lease = await this.prisma.lease.findFirst({
      where: { id: leaseId, companyId, deletedAt: null },
      include: {
        leaseLifecycle: true,
        unit: {
          select: {
            building: {
              select: { propertyId: true },
            },
          },
        },
      },
    });
    if (!lease) throw new NotFoundException('Lease not found');

    const currentLifecycle =
      lease.leaseLifecycle ||
      (await this.prisma.leaseLifecycle.create({ data: { leaseId } }));

    const updated = await this.prisma.leaseLifecycle.update({
      where: { id: currentLifecycle.id },
      data: dto,
    });

    // Check if Move-In was completed just now
    const wasMoveInCompleted =
      !currentLifecycle.moveInKeyHandover &&
      dto.moveInKeyHandover &&
      (dto.moveInAgreementSigned ?? currentLifecycle.moveInAgreementSigned) &&
      (dto.moveInDepositReceived ?? currentLifecycle.moveInDepositReceived) &&
      (dto.moveInKycCompleted ?? currentLifecycle.moveInKycCompleted) &&
      (dto.moveInPhotosUploaded ?? currentLifecycle.moveInPhotosUploaded);

    if (wasMoveInCompleted && lease.unit?.building?.propertyId) {
      await this.passportService.logEvent(
        companyId,
        lease.unit.building.propertyId,
        'MOVE_IN',
        `Tenant check-in completed. Agreement signed, deposit received, and key handover finalized.`,
        { leaseId, tenantId: lease.tenantId },
      );
    }

    // Check if Move-Out was completed just now
    const wasMoveOutCompleted =
      !currentLifecycle.moveOutExitDoc &&
      dto.moveOutExitDoc &&
      (dto.moveOutInspection ?? currentLifecycle.moveOutInspection) &&
      (dto.moveOutKeyReturn ?? currentLifecycle.moveOutKeyReturn) &&
      (dto.moveOutDepositSettlement ?? currentLifecycle.moveOutDepositSettlement);

    if (wasMoveOutCompleted && lease.unit?.building?.propertyId) {
      await this.passportService.logEvent(
        companyId,
        lease.unit.building.propertyId,
        'MOVE_OUT',
        `Tenant check-out completed. Final inspection and deposit settlement finalized.`,
        { leaseId, tenantId: lease.tenantId },
      );
    }

    return updated;
  }
}
