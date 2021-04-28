import { Module } from '@nestjs/common';
import { ItemsService } from '../../core/services/items.service';
import { ItemsGateway } from '../gateways/items.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '../../infrastructure/data-source/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  providers: [ItemsGateway, ItemsService],
})
export class ItemsModule {}
