import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { CreateItemDto } from '../dtos/items/create-item.dto';
import { UpdateItemDto } from '../dtos/items/update-item.dto';
import { Inject } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  IItemsService,
  IItemsServiceProvider,
} from '../../core/primary-ports/item.service.interface';
import { frontEndItemDto } from '../dtos/items/frontEnd-item.dto';

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
        const frontEndItemDtos: frontEndItemDto[] = items.map((item) => ({
          id: item.id,
          name: item.name,
          desc: item.desc,
        }));
        this.server.emit('allItems', frontEndItemDtos);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findAllItems')
  async findAll(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      const items = await this.itemsService.findAll();
      const frontEndItemDtos: frontEndItemDto[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        desc: item.desc,
      }));
      client.emit('allItems', frontEndItemDtos);
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
      const frontEndItemDto: frontEndItemDto = {
        id: item.id,
        name: item.name,
        desc: item.desc,
      };

      client.emit('oneItem', frontEndItemDto);
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
        const frontEndItemDto: frontEndItemDto = {
          id: updatedItem.id,
          name: updatedItem.name,
          desc: updatedItem.desc,
        };
        client.emit('itemUpdated', frontEndItemDto);

        const items = await this.itemsService.findAll();
        const frontEndItemDtos: frontEndItemDto[] = items.map((item) => ({
          id: item.id,
          name: item.name,
          desc: item.desc,
        }));

        this.server.emit('allItems', frontEndItemDtos);
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
      const frontEndItemDtos: frontEndItemDto[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        desc: item.desc,
      }));

      this.server.emit('allItems', frontEndItemDtos);
    } catch (e) {
      client.error(e.message);
    }
  }
}
