import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { CollectionsService } from '../../core/services/collections.service';
import { CreateCollectionDto } from '../dtos/collections/create-collection.dto';
import { UpdateCollectionDto } from '../dtos/collections/update-collection.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@WebSocketGateway()
export class CollectionsGateway {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Roles(Role.Admin)
  @SubscribeMessage('createCollection')
  create(@MessageBody() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @SubscribeMessage('findAllCollections')
  findAll() {
    return this.collectionsService.findAll();
  }

  @SubscribeMessage('findOneCollection')
  findOne(@MessageBody() id: number) {
    return this.collectionsService.findOne(id);
  }

  @SubscribeMessage('updateCollection')
  update(@MessageBody() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionsService.update(
      updateCollectionDto.id,
      updateCollectionDto,
    );
  }

  @SubscribeMessage('removeCollection')
  remove(@MessageBody() id: number) {
    return this.collectionsService.remove(id);
  }
}
