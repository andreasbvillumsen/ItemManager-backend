import { Injectable } from '@nestjs/common';
import { CreateItemDto } from '../../api/dtos/items/create-item.dto';
import { UpdateItemDto } from '../../api/dtos/items/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from '../../infrastructure/data-source/entities/item.entity';
import { ItemModel } from '../models/item.model';
import { IItemsService } from '../primary-ports/item.service.interface';
import { CollectionEntity } from '../../infrastructure/data-source/entities/collection.entity';

@Injectable()
export class ItemsService implements IItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    @InjectRepository(CollectionEntity)
    private collectionRepository: Repository<CollectionEntity>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<ItemModel> {
    const itemEntity = await this.itemRepository.create(createItemDto);

    const itemEntityDb = await this.itemRepository.save(itemEntity);

    const itemModel: ItemModel = JSON.parse(JSON.stringify(itemEntityDb));

    return itemModel;
  }

  async findAll(): Promise<ItemModel[]> {
    const itemEntities = await this.itemRepository.find();
    if (itemEntities) {
      return JSON.parse(JSON.stringify(itemEntities));
    } else {
      throw new Error('Could´t find any items');
    }
  }

  async findOneByID(id: number): Promise<ItemModel> {
    const itemEntity = await this.itemRepository.findOne({ id: id });

    if (itemEntity) {
      return JSON.parse(JSON.stringify(itemEntity));
    } else {
      throw new Error("Can't find a item with this id");
    }
  }

  /*async findAllByCollectionID(id: number): Promise<ItemModel[]> {
    const userEntity = await this.userRepository.findOne({
      where: { id: id },
      relations: ['collections'],
    });
    console.log('why');
    console.log(userEntity);
    if (userEntity.collections) {
      return JSON.parse(JSON.stringify(userEntity.collections));
    } else {
      throw new Error('Could´t find any collections for this user');
    }
  }*/

  async update(id: number, updateItemDto: UpdateItemDto): Promise<ItemModel> {
    if (id !== updateItemDto.id) {
      throw new Error('Id does not match');
    }

    const itemToUpdate = await this.itemRepository.findOne({ id: id });
    if (itemToUpdate) {
      await this.itemRepository.update(id, updateItemDto);
      const updatedItem = await this.itemRepository.findOne({ where: { id: id },
        relations: ['collection'] });

      if (updatedItem) {
        return JSON.parse(JSON.stringify(updatedItem));
      } else {
        throw new Error('Item was not updated');
      }
    } else {
      throw new Error('This item does not exist');
    }
  }

  async remove(id: number): Promise<any> {
    if (await this.itemRepository.findOne({ id: id })) {
      await this.itemRepository.delete({ id: id });
      return {
        message: 'Item was successfully removed!',
      };
    } else {
      throw new Error('Item does not exist!');
    }
  }

  async findAllByCollectionId(id: number): Promise<ItemModel[]> {
    const collectionEntity = await this.collectionRepository.findOne({
      where: { id: id },
      relations: ['items'],
    });
    console.log('findAllByCollectionId');
    console.log(collectionEntity);
    if (collectionEntity.items) {
      return JSON.parse(JSON.stringify(collectionEntity.items));
    } else {
      throw new Error('Could´t find any items for this collection');
    }
  }
}
