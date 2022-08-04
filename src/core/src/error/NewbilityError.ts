export class NewbilityError extends Error {
  data?: any;
  constructor(msg: string, data?: any) {
    super(msg);
    this.data = data;
  }
}
