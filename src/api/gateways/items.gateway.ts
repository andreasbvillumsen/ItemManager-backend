import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ItemsService } from '../../core/services/items.service';
import { CreateItemDto } from '../dtos/items/create-item.dto';
import { UpdateItemDto } from '../dtos/items/update-item.dto';
import { Inject } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  IItemsService,
  IItemsServiceProvider,
} from '../../core/primary-ports/item.service.interface';

@WebSocketGateway()
export class ItemsGateway {
  constructor(
    @Inject(IItemsServiceProvider) private itemsService: IItemsService,
  ) {}
  @WebSocketServer() server;

  @SubscribeMessage('createItem')
  async create(
    @MessageBody() createItemDto: CreateItemDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const newItem = await this.itemsService.create(createItemDto);
      if (newItem) {
        const items = await this.itemsService.findAll();
        this.server.emit('allItems', items);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findAllItems')
  async findAll(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      const items = await this.itemsService.findAll();
      client.emit('allItems', items);
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findOneItem')
  async findOne(
    @MessageBody() id: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const item = await this.itemsService.findOneByID(id);
      client.emit('oneItem', item);
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('updateItem')
  async update(
    @MessageBody() updateItemDto: UpdateItemDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const updatedItem = await this.itemsService.update(
        updateItemDto.id,
        updateItemDto,
      );
      if (updatedItem) {
        client.emit('itemUpdated', updatedItem);
        const users = await this.itemsService.findAll();
        this.server.emit('allItems', users);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('removeItem')
  async remove(
    @MessageBody() id: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      await this.itemsService.remove(id);
      const items = await this.itemsService.findAll();
      this.server.emit('allItems', items);
    } catch (e) {
      client.error(e.message);
    }
  }
}
