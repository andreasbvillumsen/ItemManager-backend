import { Module } from '@nestjs/common';
import { CollectionsService } from '../../core/services/collections.service';
import { CollectionsGateway } from '../gateways/collections.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from '../../infrastructure/data-source/entities/collection.entity';
import { ICollectionServiceProvider } from '../../core/primary-ports/collection.service.interface';
import { UserEntity } from '../../infrastructure/data-source/entities/user.entity';
import { ItemEntity } from '../../infrastructure/data-source/entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionEntity, UserEntity, ItemEntity]),
  ],
  providers: [
    CollectionsGateway,
    {
      provide: ICollectionServiceProvider,
      useClass: CollectionsService,
    },
  ],
})
export class CollectionsModule {}
