import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum, IsArray } from 'class-validator';
import { RoleType } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsArray()
  @IsEnum(RoleType, { each: true })
  roles: RoleType[];
}
