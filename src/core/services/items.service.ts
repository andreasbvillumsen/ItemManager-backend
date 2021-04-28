import { Injectable } from '@nestjs/common';
import { CreateItemDto } from '../../api/dtos/items/create-item.dto';
import { UpdateItemDto } from '../../api/dtos/items/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from '../../infrastructure/data-source/entities/item.entity';
import { ItemModel } from '../models/item.model';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const itemEntity = await this.itemRepository.create(createItemDto);

    const itemEntityDb = await this.itemRepository.save(itemEntity);

    const itemModel: ItemModel = JSON.parse(JSON.stringify(itemEntityDb));

    return itemModel;
  }

  async findAll() {
    return await this.itemRepository.find();
  }

  async findOne(id: number) {
    return await this.itemRepository.findOne(id);
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    return await this.itemRepository.update(id, updateItemDto);
  }

  async remove(id: number) {
    return await this.itemRepository.delete(id)
  }
}
