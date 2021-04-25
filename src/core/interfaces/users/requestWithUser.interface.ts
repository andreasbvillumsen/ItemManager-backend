import { Request } from 'express';
import User from '../../../infrastructure/data-source/entities/users.entity';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
