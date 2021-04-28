import { Module } from '@nestjs/common';
import { CollectionsService } from '../../core/services/collections.service';
import { CollectionsGateway } from '../gateways/collections.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from '../../infrastructure/data-source/entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionEntity])],
  providers: [CollectionsGateway, CollectionsService],
})
export class CollectionsModule {}
