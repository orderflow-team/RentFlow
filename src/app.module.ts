import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { PropertiesModule } from './properties/properties.module';
import { TenantsModule } from './tenants/tenants.module';
import { OwnersModule } from './owners/owners.module';
import { LeasesModule } from './leases/leases.module';
import { FinanceModule } from './finance/finance.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { ReportsModule } from './reports/reports.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TenantPortalModule } from './tenants/tenant-portal.module';
import { OwnerPortalModule } from './owners/owner-portal.module';
import { MailModule } from './mail/mail.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ReputationModule } from './common/reputation/reputation.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    PropertiesModule,
    TenantsModule,
    OwnersModule,
    LeasesModule,
    FinanceModule,
    MaintenanceModule,
    ReportsModule,
    TenantPortalModule,
    OwnerPortalModule,
    MailModule,
    ScheduleModule,
    ReputationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
