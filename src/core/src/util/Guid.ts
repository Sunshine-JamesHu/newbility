import { v4 as uuidv4, validate } from 'uuid';

export class Guid {
  private static readonly _empty: string = '00000000-0000-0000-0000-000000000000';
  private constructor() {}

  static Create() {
    return uuidv4();
  }

  static Empty() {
    return this._empty;
  }

  static IsEmpty(id: string) {
    return id === this.Empty();
  }

  static IsGuid(id: string) {
    return validate(id);
  }
}
