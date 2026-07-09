import { Module } from '@nestjs/common';
import { LeasesController } from './leases.controller';
import { LeasesService } from './leases.service';
import { LifecycleService } from './lifecycle.service';
import { PropertiesModule } from '../properties/properties.module';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [PropertiesModule, TenantsModule],
  controllers: [LeasesController],
  providers: [LeasesService, LifecycleService],
  exports: [LeasesService, LifecycleService],
})
export class LeasesModule {}
