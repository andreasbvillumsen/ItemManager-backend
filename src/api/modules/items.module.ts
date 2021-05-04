import { Module } from '@nestjs/common';
import { ItemsService } from '../../core/services/items.service';
import { ItemsGateway } from '../gateways/items.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '../../infrastructure/data-source/entities/item.entity';
import { IItemsServiceProvider } from '../../core/primary-ports/item.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  providers: [
    ItemsGateway,
    {
      provide: IItemsServiceProvider,
      useClass: ItemsService,
    },
  ],
})
export class ItemsModule {}
