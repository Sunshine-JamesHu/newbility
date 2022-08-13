import 'reflect-metadata';
import { CoreModule } from './CoreModule';
import {
  Abstract,
  AllowMultiple,
  Container,
  GetInjectInfo,
  GetInjectToken,
  Inject,
  Injectable,
  IsAbstract,
  IsMultipleRegister,
  ReplaceService,
  Singleton,
  Transient,
} from './di/Dependency';

import { SC_INJECT_TOKEN, IServiceCollection, ServiceCollection } from './di/ServiceCollection';
import { NewbilityError } from './error/NewbilityError';
import { UserFriendlyError, UserFriendlyErrorData } from './error/UserFriendlyError';
import { EventBus, EVENT_BUS_INJECT_TOKEN, IEventBus, IEventData } from './event/EventBus';
import { EVENT_HANDLER_METADATA, IEventHandler, EventKey, GetEventKey, IsEventHandler, EventHandler } from './event/EventHandler';
import { LOGGER_INJECT_TOKEN, ILogger, Logger } from './logger/Logger';
import { DefineMetadata, GetMetadata, GetMetadataKey, Metadata } from './metadata/Metadata';
import { IAppModule, AppModule, StartModule, StopModule, RegisterModuleByPath } from './modularity/AppModule';
import { IProgram } from './program/Program';
import { SETTING_INJECT_TOKEN, ISettingManager, SettingManager } from './setting/SettingManager';
import { IAsyncDisposable, IDisposable, UsingAsync } from './sys/Disposable';
import { ArrayHelper } from './util/ArrayHelper';
import { Guid } from './util/Guid';
import { StreamHelper } from './util/StreamHelper';

export {
  Container,
  Singleton,
  Transient,
  Injectable,
  Inject,
  GetInjectInfo,
  ReplaceService,
  AllowMultiple,
  IsMultipleRegister,
  Abstract,
  IsAbstract,
  GetInjectToken,
  LOGGER_INJECT_TOKEN,
  ILogger,
  Logger,
  SC_INJECT_TOKEN,
  IServiceCollection,
  ServiceCollection,
  NewbilityError,
  UserFriendlyError,
  UserFriendlyErrorData,
  EVENT_BUS_INJECT_TOKEN,
  IEventData,
  IEventBus,
  EventBus,
  EVENT_HANDLER_METADATA,
  IEventHandler,
  EventKey,
  GetEventKey,
  IsEventHandler,
  EventHandler,
  GetMetadataKey,
  Metadata,
  DefineMetadata,
  GetMetadata,
  IAppModule,
  AppModule,
  StartModule,
  StopModule,
  RegisterModuleByPath,
  IProgram,
  SETTING_INJECT_TOKEN,
  ISettingManager,
  SettingManager,
  IDisposable,
  IAsyncDisposable,
  UsingAsync,
  ArrayHelper,
  Guid,
  StreamHelper,
  CoreModule,
};
