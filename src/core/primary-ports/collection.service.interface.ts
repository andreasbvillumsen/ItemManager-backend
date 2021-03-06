import { CreateCollectionDto } from '../../api/dtos/collections/create-collection.dto';
import { CollectionModel } from '../models/collection.model';
import { UpdateCollectionDto } from '../../api/dtos/collections/update-collection.dto';
import { ShareCollectionDto } from "../../api/dtos/collections/share-collection.dto";

export const ICollectionServiceProvider = 'ICollectionServiceProvider';
export interface ICollectionService {
  create(createCollectionDto: CreateCollectionDto): Promise<CollectionModel>;

  findAll(): Promise<CollectionModel[]>;

  findOneByID(id: number): Promise<CollectionModel>;

  findAllByUserID(id: number): Promise<CollectionModel[]>;

  update(
    id: number,
    updateCollectionDto: UpdateCollectionDto,
  ): Promise<CollectionModel>;

  remove(id: number): Promise<any>;

  share(collection: ShareCollectionDto): Promise<any>;
}
