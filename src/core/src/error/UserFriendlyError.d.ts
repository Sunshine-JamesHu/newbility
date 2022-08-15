import { NewbilityError } from './NewbilityError';
export interface UserFriendlyErrorData {
    code?: string;
    detail?: any;
}
export declare class UserFriendlyError extends NewbilityError {
    status?: number | undefined;
    constructor(msg: string, data?: UserFriendlyErrorData, status?: number | undefined);
}
