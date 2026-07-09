import { OmitType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';
import { CreateLeaseDto } from './create-lease.dto';

class LeaseTermsDto extends OmitType(CreateLeaseDto, ['unitId', 'tenantId'] as const) {}

export class AssignTenantByPhoneDto extends LeaseTermsDto {
  @IsString()
  @IsNotEmpty()
  unitId: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
