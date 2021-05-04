import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from '../../api/dtos/collections/create-collection.dto';
import { UpdateCollectionDto } from '../../api/dtos/collections/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionEntity } from '../../infrastructure/data-source/entities/collection.entity';
import { CollectionModel } from '../models/collection.model';
import { ICollectionService } from '../primary-ports/collection.service.interface';

@Injectable()
export class CollectionsService implements ICollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionRepository: Repository<CollectionEntity>,
  ) {}

  async create(
    createCollectionDto: CreateCollectionDto,
  ): Promise<CollectionModel> {
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

  async findAll(): Promise<CollectionModel[]> {
    const collectionEntities = await this.collectionRepository.find();
    if (collectionEntities) {
      return JSON.parse(JSON.stringify(collectionEntities));
    } else {
      throw new Error('Could´t find any collections');
    }
  }

  async findOneByID(id: number): Promise<CollectionModel> {
    const collectionEntity = await this.collectionRepository.findOne({
      id: id,
    });

    if (collectionEntity) {
      return JSON.parse(JSON.stringify(collectionEntity));
    } else {
      throw new Error("Can't find a collection with this id");
    }
  }

  async update(
    id: number,
    updateCollectionDto: UpdateCollectionDto,
  ): Promise<CollectionModel> {
    if (id !== updateCollectionDto.id) {
      throw new Error('Id does not match');
    }
    const collectionToUpdate = await this.collectionRepository.findOne({
      id: id,
    });
    if (collectionToUpdate) {
      await this.collectionRepository.update(id, updateCollectionDto);
      const updatedCollection = await this.collectionRepository.findOne({
        id: id,
      });

      if (updatedCollection) {
        return JSON.parse(JSON.stringify(updatedCollection));
      } else {
        throw new Error('Collection was not updated');
      }
    } else {
      throw new Error('This Collection does not exist');
    }
  }

  async remove(id: number): Promise<any> {
    if (await this.collectionRepository.findOne({ id: id })) {
      // await this.userRepository.softDelete(id);
      await this.collectionRepository.delete({ id: id });
      return {
        message: 'Collection was successfully removed!',
      };
    } else {
      throw new Error('Collection does not exist!');
    }
  }
}
