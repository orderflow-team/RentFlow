import { ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RoleType } from '../enums/role.enum';

interface FindOrCreatePhoneUserParams {
  companyId: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  roleType: RoleType;
}

/**
 * Finds the User identified by a (globally unique) phone number, or creates a new
 * OTP-only account (unusable password, ACTIVE status) with the given role.
 * Throws if the phone already belongs to a User in a different company.
 */
export async function findOrCreatePhoneUser(
  prisma: any,
  { companyId, phone, firstName, lastName, roleType }: FindOrCreatePhoneUserParams,
) {
  const existing = await prisma.user.findUnique({ where: { phone } });

  if (existing) {
    if (existing.companyId !== companyId) {
      throw new ConflictException(
        'This phone number is already registered under a different company',
      );
    }

    const hasRole = await prisma.userRole.findFirst({
      where: { userId: existing.id, companyId, role: { type: roleType } },
    });
    if (!hasRole) {
      const role = await prisma.role.findUnique({ where: { type: roleType } });
      if (role) {
        await prisma.userRole.create({
          data: { userId: existing.id, roleId: role.id, companyId },
        });
      }
    }

    return existing;
  }

  if (!firstName || !lastName) {
    throw new BadRequestException(
      'firstName and lastName are required to create a new account for this phone number',
    );
  }

  const role = await prisma.role.findUnique({ where: { type: roleType } });
  if (!role) {
    throw new BadRequestException(`Role ${roleType} not found. Run seed first.`);
  }

  const unusablePasswordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);

  const user = await prisma.user.create({
    data: {
      email: `phone-${crypto.randomBytes(8).toString('hex')}@no-email.rentflow.local`,
      passwordHash: unusablePasswordHash,
      firstName,
      lastName,
      phone,
      status: 'ACTIVE',
      companyId,
      roles: { create: [{ role: { connect: { type: roleType } }, companyId }] },
    },
  });

  return user;
}
