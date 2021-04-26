import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from '../../api/dtos/collections/create-collection.dto';
import { UpdateCollectionDto } from '../../api/dtos/collections/update-collection.dto';

@Injectable()
export class CollectionsService {
  create(createCollectionDto: CreateCollectionDto) {
    return 'This action adds a new collection';
  }

  findAll() {
    return `This action returns all collections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collection`;
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return `This action updates a #${id} collection`;
  }

  remove(id: number) {
    return `This action removes a #${id} collection`;
  }
}
