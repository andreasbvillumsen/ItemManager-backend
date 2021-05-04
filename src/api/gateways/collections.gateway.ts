import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { CreateCollectionDto } from '../dtos/collections/create-collection.dto';
import { UpdateCollectionDto } from '../dtos/collections/update-collection.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { Inject } from '@nestjs/common';
import {
  ICollectionService,
  ICollectionServiceProvider,
} from '../../core/primary-ports/collection.service.interface';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { Socket } from 'socket.io';
import { UpdateUserDto } from "../dtos/users/update-user.dto";

@WebSocketGateway()
export class CollectionsGateway {
  constructor(
    @Inject(ICollectionServiceProvider)
    private collectionsService: ICollectionService,
  ) {}
  @WebSocketServer() server;

  @Roles(Role.Admin)
  @SubscribeMessage('createCollection')
  async create(
    @MessageBody() createCollectionDto: CreateCollectionDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const newCollection = await this.collectionsService.create(
        createCollectionDto,
      );
      if (newCollection) {
        const collections = await this.collectionsService.findAll();
        this.server.emit('allCollections', collections);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findAllCollections')
  async findAll(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      const collections = await this.collectionsService.findAll();
      client.emit('allCollections', collections);
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findOneCollection')
  async findOne(
    @MessageBody() id: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const collection = await this.collectionsService.findOneByID(id);
      client.emit('oneCollection', collection);
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('updateCollection')
  async update(
    @MessageBody() updateCollectionDto: UpdateCollectionDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const updatedCollection = await this.collectionsService.update(
        updateCollectionDto.id,
        updateCollectionDto,
      );
      if (updatedCollection) {
        client.emit('collectionUpdated', updatedCollection);
        const collections = await this.collectionsService.findAll();
        client.emit('allCollections', collections);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('removeCollection')
  async remove(
    @MessageBody() id: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      await this.collectionsService.remove(id);
      const collections = await this.collectionsService.findAll();
      client.emit('allCollections', collections);
    } catch (e) {
      client.error(e.message);
    }
  }
}
