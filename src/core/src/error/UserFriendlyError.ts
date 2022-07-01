import { SimpleKoaError } from './SimpleKoaError';

interface UserFriendlyErrorData {
  code?: string;

  detail?: any;
}

export class UserFriendlyError extends SimpleKoaError {
  constructor(msg: string, data?: UserFriendlyErrorData, public status?: number) {
    super(msg, data);
  }
}
