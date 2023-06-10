import * as tsyringe from 'tsyringe';

// Overwrite wrong declaration from tryringe, support typescript 5.x
// Remove this when library will update
declare module 'tsyringe' {
  declare function inject(
    token: tsyringe.InjectionToken<any>
  ): (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => any;
}
