import { Module } from '@nestjs/common';
import { CollectionsService } from '../../core/services/collections.service';
import { CollectionsGateway } from '../gateways/collections.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../../infrastructure/data-source/entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  providers: [CollectionsGateway, CollectionsService],
})
export class CollectionsModule {}
