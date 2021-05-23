import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from '../../api/dtos/collections/create-collection.dto';
import { UpdateCollectionDto } from '../../api/dtos/collections/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionEntity } from '../../infrastructure/data-source/entities/collection.entity';
import { CollectionModel } from '../models/collection.model';
import { ICollectionService } from '../primary-ports/collection.service.interface';
import { UserEntity } from '../../infrastructure/data-source/entities/user.entity';
import { ItemEntity } from '../../infrastructure/data-source/entities/item.entity';
import { ShareCollectionDto } from '../../api/dtos/collections/share-collection.dto';

@Injectable()
export class CollectionsService implements ICollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionRepository: Repository<CollectionEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
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
      where: { id: id },
      relations: ['items', 'users'],
    });

    if (collectionEntity) {
      return JSON.parse(JSON.stringify(collectionEntity));
    } else {
      throw new Error("Can't find a collection with this id");
    }
  }

  async findAllByUserID(id: number): Promise<CollectionModel[]> {
    const userEntity = await this.userRepository.findOne({
      where: { id: id },
      relations: ['collections'],
    });
    if (userEntity.collections) {
      return JSON.parse(JSON.stringify(userEntity.collections));
    } else {
      throw new Error('Could´t find any collections for this user');
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
      await this.collectionRepository
        .createQueryBuilder()
        .update()
        .set({ name: updateCollectionDto.name })
        .where('id = :id', { id: collectionToUpdate.id })
        .execute();

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
    const collectionEntity = await this.collectionRepository.findOne({
      where: { id: id },
      relations: ['items'],
    });
    if (collectionEntity) {
      if (collectionEntity.items.length > 0) {
        for (const item of collectionEntity.items) {
          await this.itemRepository.delete({ id: item.id });
        }
      }
      await this.collectionRepository.delete({ id: id });
      return {
        message: 'Collection was successfully removed!',
      };
    } else {
      throw new Error('Collection does not exist!');
    }
  }

  async share(collection: ShareCollectionDto): Promise<any> {
    const userEntity = await this.userRepository.findOne({
      email: collection.userEmail,
    });
    if (userEntity) {
      await this.collectionRepository
        .createQueryBuilder()
        .relation(CollectionEntity, 'users')
        .of(collection.id)
        .add(userEntity.id);
    } else {
      throw new Error('Could not find user');
    }
  }
}
