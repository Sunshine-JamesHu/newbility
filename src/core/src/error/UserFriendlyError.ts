import { NewbilityError } from './NewbilityError';

export interface UserFriendlyErrorData {
  code?: string;

  detail?: any;
}

export class UserFriendlyError extends NewbilityError {
  constructor(msg: string, data?: UserFriendlyErrorData, public status?: number) {
    super(msg, data);
  }
}
