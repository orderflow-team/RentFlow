import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OwnerPortalController } from './owner-portal.controller';
import { OwnerPortalService } from './owner-portal.service';

@Module({
  imports: [PrismaModule],
  controllers: [OwnerPortalController],
  providers: [OwnerPortalService],
})
export class OwnerPortalModule {}
