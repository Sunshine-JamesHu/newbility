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
import { AllowAnonymous, IsAllowAnonymous } from './src/auth/AllowAnonymous';
import { AUTH_INJECT_TOKEN, AUTH_OPTIONS_INJECT_TOKEN, GetAuthOptions, IAuth, JwtAuth } from './src/auth/Auth';
import { AUTHENTICATION_INJECT_TOKEN, IAuthentication, Authentication } from './src/auth/Authentication';
import { AuthorizeInfo, Authorize, GetAuthInfo, SetAuthInfo } from './src/auth/Authorize';
import { PERMISSION_CHECKER_INJECT_TOKEN, IPermissionChecker, PermissionChecker } from './src/auth/PermissionChecker';
import { HttpContext, IHttpContext } from './src/context/HttpContext';
import { CreateStorage } from './src/context/AsyncHooksStorage';
import { run, useContext } from './src/context/HttpContextStorage';
import { CurrentUser } from './src/context/CurrentUser';

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
  AllowAnonymous,
  IsAllowAnonymous,
  AUTH_INJECT_TOKEN,
  AUTH_OPTIONS_INJECT_TOKEN,
  IAuth,
  JwtAuth,
  GetAuthOptions,
  AUTHENTICATION_INJECT_TOKEN,
  IAuthentication,
  Authentication,
  AuthorizeInfo,
  Authorize,
  GetAuthInfo,
  SetAuthInfo,
  PERMISSION_CHECKER_INJECT_TOKEN,
  IPermissionChecker,
  PermissionChecker,
  IHttpContext,
  HttpContext,
  CreateStorage,
  run,
  useContext,
  CurrentUser,
  KoaCoreModule,
  Program,
};
