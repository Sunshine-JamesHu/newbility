import 'reflect-metadata';
import {
  Controller,
  CONTROLLER_INJECT_TOKEN,
  CONTROLLER_METADATA,
  GetAllControllers,
  GetControllerName,
  IController,
  IsController,
} from './src/controller/Controller';
import { IControllerBuilder, ActionDescriptor, ControllerBuilder, CTL_BUILDER_INJECT_TOKEN } from './src/controller/ControllerBuilder';
import { AddCors } from './src/cors/Cors';
import { InitGlobalError } from './src/error/Error';
import { KoaCoreModule } from './src/KoaCoreModule';
import { Program } from './src/Program';
import {
  HttpMethod,
  ActionInfo,
  FullActionInfo,
  HttpGet,
  HttpPost,
  HttpPut,
  HttpDelete,
  HttpOptions,
  HttpRequest,
  GetHttpMethodStr,
  GetActionInfo,
} from './src/router/Request';
import { RequestQuery, RequestBody, GetActionParamsMetadata } from './src/router/RequestData';
import { RouterInfo, GetRouterPath, GetRouterInfo, Router } from './src/router/Router';
import { SWAGGER_BUILDER_INJECT_TOKEN, ISwaggerBuilder, SwaggerBuilder } from './src/swagger/SwaggerBuilder';

export {
  CONTROLLER_METADATA,
  CONTROLLER_INJECT_TOKEN,
  IController,
  Controller,
  IsController,
  GetControllerName,
  GetAllControllers,
  CTL_BUILDER_INJECT_TOKEN,
  IControllerBuilder,
  ActionDescriptor,
  ControllerBuilder,
  AddCors,
  InitGlobalError,
  HttpMethod,
  ActionInfo,
  FullActionInfo,
  HttpGet,
  HttpPost,
  HttpPut,
  HttpDelete,
  HttpOptions,
  HttpRequest,
  GetHttpMethodStr,
  GetActionInfo,
  RequestQuery,
  RequestBody,
  GetActionParamsMetadata,
  RouterInfo,
  Router,
  GetRouterPath,
  GetRouterInfo,
  SWAGGER_BUILDER_INJECT_TOKEN,
  ISwaggerBuilder,
  SwaggerBuilder,
  KoaCoreModule,
  Program,
};
