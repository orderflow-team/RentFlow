import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PassportService } from './passport/passport.service';
import { DiscoveryController } from './discovery/discovery.controller';
import { DiscoveryService } from './discovery/discovery.service';
import { ApplicationsController } from './applications/applications.controller';
import { ApplicationsService } from './applications/applications.service';

@Module({
  controllers: [PropertiesController, DiscoveryController, ApplicationsController],
  providers: [PropertiesService, PassportService, DiscoveryService, ApplicationsService],
  exports: [PropertiesService, PassportService, DiscoveryService, ApplicationsService],
})
export class PropertiesModule {}
