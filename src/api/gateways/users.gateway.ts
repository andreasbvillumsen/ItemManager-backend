import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { UpdateUserDto } from '../dtos/users/update-user.dto';
import { Inject } from '@nestjs/common';
import {
  IUsersService,
  IUsersServiceProvider,
} from '../../core/primary-ports/user.service.interface';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class UsersGateway {
  constructor(
    @Inject(IUsersServiceProvider) private usersService: IUsersService,
  ) {}
  @WebSocketServer() server;

  @SubscribeMessage('createUser')
  async create(
    @MessageBody() createUserDto: CreateUserDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const newUser = await this.usersService.create(createUserDto);
      if (newUser) {
        const users = await this.usersService.findAll();
        this.server.emit('allUsers', users);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findAllUsers')
  async findAll(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      const users = await this.usersService.findAll();
      client.emit('allUsers', users);
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findOneUserById')
  async findOneById(
    @MessageBody() id: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const user = await this.usersService.findOneByID(id);
      client.emit('oneUser', user);
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findOneUserByEmail')
  async findOneByEmail(
    @MessageBody() email: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      client.emit('oneUser', user);
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('updateUser')
  async update(
    @MessageBody() updateUserDto: UpdateUserDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const updatedUser = await this.usersService.update(
        updateUserDto.id,
        updateUserDto,
      );
      if (updatedUser) {
        client.emit('userUpdated', updatedUser);
        const users = await this.usersService.findAll();
        this.server.emit('allUsers', users);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('removeUser')
  async remove(
    @MessageBody() id: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      await this.usersService.remove(id);
      const users = await this.usersService.findAll();
      this.server.emit('allUsers', users);
    } catch (e) {
      client.error(e.message);
    }
  }
}
