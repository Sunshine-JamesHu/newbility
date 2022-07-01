export class SimpleKoaError extends Error {
  data?: any;
  constructor(msg: string, data?: any) {
    super(msg);
    this.data = data;
  }
}
