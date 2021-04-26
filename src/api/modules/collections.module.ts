import { Module } from '@nestjs/common';
import { CollectionsService } from '../../core/services/collections.service';
import { CollectionsGateway } from '../gateways/collections.gateway';

@Module({
  providers: [CollectionsGateway, CollectionsService]
})
export class CollectionsModule {}
