import { CreateItemDto } from '../../api/dtos/items/create-item.dto';
import { ItemModel } from '../models/item.model';
import { UpdateItemDto } from '../../api/dtos/items/update-item.dto';

export const IItemsServiceProvider = 'IItemsServiceProvider';
export interface IItemsService {
  create(createItemDto: CreateItemDto): Promise<ItemModel>;

  findAll(): Promise<ItemModel[]>;

  findOneByID(id: number): Promise<ItemModel>;

  update(id: number, updateItemDto: UpdateItemDto): Promise<ItemModel>;

  remove(id: number): Promise<any>;
}
