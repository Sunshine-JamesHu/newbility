import qs from 'qs';
import { Singleton, NewbilityError } from '@newbility/core';
import { HttpClientBase, HttpClientResult, RequestOptions, HTTP_CLIENT_INJECT_TOKEN } from '@newbility/http-client-core';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosError } from 'axios';

const arrayBufferReg = /protobuf|msgpack/i;

@Singleton(HTTP_CLIENT_INJECT_TOKEN)
export class AxiosHttpClient extends HttpClientBase {
  constructor() {
    super();
  }

  async Send<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>> {
    const result: HttpClientResult<TResult> = { status: 204 };

    try {
      const httpRes = await axios.request(this.GetOptions(config));
      if (httpRes) {
        result.status = httpRes.status;
        result.data = httpRes.data;
      }
    } catch (error: any) {
      // 库内抛出的错误太多了,不是很好找问题,抛出一个简单的
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any, any>;
        const simpleErrData = {
          config: {
            url: axiosError.config.url,
            method: axiosError.config.method,
            headers: JSON.stringify(axiosError.config.headers),
            params: JSON.stringify(axiosError.config.params),
            data: JSON.stringify(axiosError.config.data),
            responseType: axiosError.config.responseType,
            timeout: axiosError.config.timeout,
          },
          response: {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            headers: JSON.stringify(axiosError.response?.headers),
            data: axiosError.response?.data,
          },
        };
        this.Logger.LogError('Send Http Request Error', simpleErrData);
        throw new NewbilityError(axiosError.message, simpleErrData);
      }
      throw error;
    }
    return result;
  }

  private GetOptions(config: RequestOptions): AxiosRequestConfig {
    const headers: AxiosRequestHeaders = {
      Connection: 'keep-alive',
    };

    // 处理是空的情况
    if (!config) return { headers };

    // 处理header
    if (config.headers) {
      for (const key in config.headers) {
        if (Object.prototype.hasOwnProperty.call(config.headers, key)) {
          const element = config.headers[key];
          headers[key.toLowerCase()] = element;
        }
      }
    }

    if (config.responseType && (config.responseType === 'arraybuffer' || config.responseType === 'blob')) {
      headers['accept'] = 'arraybuffer';
    }

    // 处理返回值
    const accept = headers['accept'];
    if (accept && !Array.isArray(accept) && arrayBufferReg.test(accept.toString())) {
      config.responseType = 'arraybuffer';
    }

    return {
      url: config.url,
      method: config.method,

      params: config.params,
      data: config.data,

      headers: headers,

      timeout: config.timeout,
      timeoutErrorMessage: config.timeoutErrorMessage,

      responseType: config.responseType,
      withCredentials: true,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    };
  }
}
