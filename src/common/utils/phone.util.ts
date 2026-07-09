import { BadRequestException } from '@nestjs/common';

export function normalizePhone(raw: string): string {
  if (!raw) {
    throw new BadRequestException('Phone number is required');
  }
  const hasLeadingPlus = raw.trim().startsWith('+');
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) {
    throw new BadRequestException('Phone number is invalid');
  }
  return (hasLeadingPlus ? '+' : '') + digits;
}
