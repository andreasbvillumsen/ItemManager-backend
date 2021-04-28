import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from '../../api/dtos/collections/create-collection.dto';
import { UpdateCollectionDto } from '../../api/dtos/collections/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionEntity } from '../../infrastructure/data-source/entities/collection.entity';
import { CollectionModel } from '../models/collection.model';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionRepository: Repository<CollectionEntity>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const collectionEntity = await this.collectionRepository.create(
      createCollectionDto,
    );

    const collectionEntityDb = await this.collectionRepository.save(
      collectionEntity,
    );

    const collectionModel: CollectionModel = JSON.parse(
      JSON.stringify(collectionEntityDb),
    );

    return collectionModel;
  }

  async findAll() {
    return await this.collectionRepository.find();
  }

  async findOne(id: number) {
    return await this.collectionRepository.findOne(id);
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return await this.collectionRepository.update(id, updateCollectionDto);
  }

  async remove(id: number) {
    return await this.collectionRepository.delete(id);
  }
}
