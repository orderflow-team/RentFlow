import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateUserDto) {
    return this.usersService.create(user.companyId, dto);
  }

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.usersService.findAll(user.companyId);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT)
  async findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.usersService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN)
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(user.companyId, id, dto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.usersService.remove(user.companyId, id);
  }
}
