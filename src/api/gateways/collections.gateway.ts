import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { CreateCollectionDto } from '../dtos/collections/create-collection.dto';
import { UpdateCollectionDto } from '../dtos/collections/update-collection.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { Inject } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  ICollectionService,
  ICollectionServiceProvider,
} from '../../core/primary-ports/collection.service.interface';
import { ReadUserDto } from '../dtos/users/read-user.dto';
import { ReadCollectionDto } from '../dtos/collections/read-collection.dto';

@WebSocketGateway()
export class CollectionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(ICollectionServiceProvider)
    private collectionsService: ICollectionService,
  ) {}
  @WebSocketServer() server;

  @SubscribeMessage('createCollection')
  async create(
    @MessageBody() createCollectionDto: CreateCollectionDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      console.log(createCollectionDto);
      const newCollection = await this.collectionsService.create(
        createCollectionDto,
      );
      if (newCollection) {
        const collections = await this.collectionsService.findAllByUserID(
          newCollection.users[0].id,
        );
        const frontEndCollectionDtos: ReadCollectionDto[] = collections.map(
          (collection) => ({
            id: collection.id,
            name: collection.name,
          }),
        );
        client.emit('allCollectionsForUser', frontEndCollectionDtos);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findAllCollections')
  async findAll(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      console.log('find all');
      const collections = await this.collectionsService.findAll();
      const frontEndCollectionDtos: ReadCollectionDto[] = collections.map(
        (collection) => ({
          id: collection.id,
          name: collection.name,
        }),
      );
      client.emit('allCollections', frontEndCollectionDtos);
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findAllCollectionsByUserID')
  async findAllByUserID(
    @MessageBody() userid: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('findAllByUserID');
    try {
      const collections = await this.collectionsService.findAllByUserID(userid);
      const frontEndCollectionDtos: ReadCollectionDto[] = collections.map(
        (collection) => ({
          id: collection.id,
          name: collection.name,
        }),
      );
      client.emit('allCollectionsForUser', frontEndCollectionDtos);
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
        const frontEndCollectionDto: ReadCollectionDto = {
          id: updatedCollection.id,
          name: updatedCollection.name,
        };
        client.emit('collectionUpdated', frontEndCollectionDto);
        const collections = await this.collectionsService.findAllByUserID(
          updateCollectionDto.userid,
        );
        const frontEndCollectionDtos: ReadCollectionDto[] = collections.map(
          (collection) => ({
            id: collection.id,
            name: collection.name,
          }),
        );
        client.emit('allCollectionsForUser', frontEndCollectionDtos);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('deleteCollection')
  async remove(
    @MessageBody() collectionId: number,
    @MessageBody() userid: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      await this.collectionsService.remove(collectionId);
      const collections = await this.collectionsService.findAllByUserID(userid);
      const frontEndCollectionDtos: ReadCollectionDto[] = collections.map(
        (collection) => ({
          id: collection.id,
          name: collection.name,
        }),
      );
      client.emit('allCollectionsForUser', frontEndCollectionDtos);
    } catch (e) {
      client.error(e.message);
    }
  }
  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    try {
      console.log('Client Connect', client.id);
    } catch (e) {
      client.error(e.message);
    }
  }

  async handleDisconnect(client: Socket): Promise<any> {
    console.log('Client Disconnect', client.id);
  }
}
