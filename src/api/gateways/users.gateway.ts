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
import { Socket } from 'socket.io';
import {
  IUsersService,
  IUsersServiceProvider,
} from '../../core/primary-ports/user.service.interface';
import { FrontEndUserDto } from '../dtos/users/frontEnd-user.dto';

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
        const frontEndUserDtos: FrontEndUserDto[] = users.map((user) => ({
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        }));

        this.server.emit('allUsers', frontEndUserDtos);
      }
    } catch (e) {
      client.error(e.message);
    }
  }

  @SubscribeMessage('findAllUsers')
  async findAll(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      const users = await this.usersService.findAll();
      const frontEndUserDtos: FrontEndUserDto[] = users.map((user) => ({
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      }));

      client.emit('allUsers', frontEndUserDtos);
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
      const frontEndUser: FrontEndUserDto = {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      client.emit('oneUser', frontEndUser);
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
      const frontEndUser: FrontEndUserDto = {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      client.emit('oneUser', frontEndUser);
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
        const frontEndUser: FrontEndUserDto = {
          id: updatedUser.id,
          email: updatedUser.email,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
        };
        client.emit('userUpdated', frontEndUser);
        const users = await this.usersService.findAll();
        const frontEndUserDtos: FrontEndUserDto[] = users.map((user) => ({
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        }));

        this.server.emit('allUsers', frontEndUserDtos);
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
      const frontEndUserDtos: FrontEndUserDto[] = users.map((user) => ({
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      }));

      this.server.emit('allUsers', frontEndUserDtos);
    } catch (e) {
      client.error(e.message);
    }
  }
}
