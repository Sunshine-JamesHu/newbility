export interface SwaggerOptions {
  info?: {
    description?: string;
    title?: string;
  };
  auth?: {
    url: string;
    fields?: Array<{
      id: string;
      displayName: string;
      type?: 'text' | 'password' | string;
      required?: boolean;
    }>;
    responseConverter?: (data: any) => { token: string; expiresIn: number };
  };
  path?: string;
  cacheMaxAge?: number;
  requestInterceptor?: any;
  responseInterceptor?: any;
  plugins?: any;
}
