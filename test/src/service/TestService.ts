import { IService, Singleton,ReplaceService } from '@newbility/core';

export interface ITestService extends IService {
  Test(): string;
}

@Singleton('TestService')
export class TestService implements ITestService {
  Test(): string {
    return 'TestService:Test';
  }
}

@Singleton('TestService')
@ReplaceService()
export class Test2Service implements ITestService {
  Test(): string {
    return 'Test2Service:Test';
  }
}
