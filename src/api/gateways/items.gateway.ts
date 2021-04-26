import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ItemsService } from '../../core/services/items.service';
import { CreateItemDto } from '../dtos/items/create-item.dto';
import { UpdateItemDto } from '../dtos/items/update-item.dto';

@WebSocketGateway()
export class ItemsGateway {
  constructor(private readonly itemsService: ItemsService) {}

  @SubscribeMessage('createItem')
  create(@MessageBody() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @SubscribeMessage('findAllItems')
  findAll() {
    return this.itemsService.findAll();
  }

  @SubscribeMessage('findOneItem')
  findOne(@MessageBody() id: number) {
    return this.itemsService.findOne(id);
  }

  @SubscribeMessage('updateItem')
  update(@MessageBody() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(updateItemDto.id, updateItemDto);
  }

  @SubscribeMessage('removeItem')
  remove(@MessageBody() id: number) {
    return this.itemsService.remove(id);
  }
}
