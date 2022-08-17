import 'reflect-metadata';
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
} from './src/di/Dependency';
import { SC_INJECT_TOKEN, IServiceCollection, ServiceCollection, InitServiceCollection } from './src/di/ServiceCollection';
import { NewbilityError } from './src/error/NewbilityError';
import { UserFriendlyError, UserFriendlyErrorData } from './src/error/UserFriendlyError';
import { EventBus, EVENT_BUS_INJECT_TOKEN, IEventBus, IEventData } from './src/event/EventBus';
import { EVENT_HANDLER_METADATA, IEventHandler, EventKey, GetEventKey, IsEventHandler, EventHandler } from './src/event/EventHandler';
import { LOGGER_INJECT_TOKEN, ILogger, Logger, InitLogger } from './src/logger/Logger';
import { DefineMetadata, GetMetadata, GetMetadataKey, Metadata } from './src/metadata/Metadata';
import {
  IAppModule,
  AppModule,
  StartModule,
  StopModule,
  RegisterModuleByPath,
  ModulePath,
  GetModulePath,
  GetModuleDepends,
  RegisterModule,
  MODULE_INJECT_TOKEN,
  MODULE_PATH_METADATA_TOKEN,
} from './src/modularity/AppModule';
import { IProgram } from './src/program/Program';
import { SETTING_INJECT_TOKEN, ISettingManager, SettingManager, InitSettingManager } from './src/setting/SettingManager';
import { IAsyncDisposable, IDisposable, UsingAsync } from './src/sys/Disposable';
import { ArrayHelper } from './src/util/ArrayHelper';
import { Guid } from './src/util/Guid';
import { StreamHelper } from './src/util/StreamHelper';
import { DependsOn } from './src/modularity/DependsOn';
import { InitServiceLoader } from './src/di/ServiceLoader';
import { CoreModule } from './src/CoreModule';
import { OsHelper } from './src/util/OsHelper';
import { IRunnable } from './src/sys/Runnable';

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
  InitLogger,
  SC_INJECT_TOKEN,
  IServiceCollection,
  ServiceCollection,
  InitServiceCollection,
  InitServiceLoader,
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
  MODULE_INJECT_TOKEN,
  MODULE_PATH_METADATA_TOKEN,
  IAppModule,
  AppModule,
  StartModule,
  StopModule,
  RegisterModuleByPath,
  ModulePath,
  DependsOn,
  GetModulePath,
  GetModuleDepends,
  RegisterModule,
  IProgram,
  SETTING_INJECT_TOKEN,
  ISettingManager,
  SettingManager,
  InitSettingManager,
  IDisposable,
  IAsyncDisposable,
  UsingAsync,
  IRunnable,
  ArrayHelper,
  Guid,
  OsHelper,
  StreamHelper,
  CoreModule,
};
