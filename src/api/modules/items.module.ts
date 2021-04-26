import { Module } from '@nestjs/common';
import { ItemsService } from '../../core/services/items.service';
import { ItemsGateway } from '../gateways/items.gateway';

@Module({
  providers: [ItemsGateway, ItemsService]
})
export class ItemsModule {}
