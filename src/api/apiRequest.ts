import { APIRequestContext, request, expect } from '@playwright/test';
import { ENV } from '../../configs/env/env.helper';

export class ApiRequest {
  private ctx!: APIRequestContext;

  async init(extraHeaders?: Record<string, string>) {
    this.ctx = await request.newContext({
      baseURL: ENV.crmConfig.apibaseurl,
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(extraHeaders ?? {}),
      },
    });
  }

  async dispose() {
    await this.ctx?.dispose();
  }

  get context() {
    if (!this.ctx) throw new Error('ApiClient not initialized. Call init() first.');
    return this.ctx;
  }

  async get(path: string, body?: any,  headers?: Record<string, string>) {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return this.context.get(normalized, {data: body, headers});
  }

  async getwithToken(path: string, body?: any, headers?: Record<string, string>) {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return this.context.get(normalized, {data: body, headers});
  }

  async post(path: string, body?: any, headers?: Record<string, string>) { 
    if (!path) throw new Error(`API post() path is empty: ${path}`);
    const normalized = path.startsWith('/') ? path : `/${path}`;
  return this.context.post(normalized, { data: body, headers });    
  }

  async put(path: string, body?: any) {
    return this.context.put(path, { data: body });
  }

  async delete(path: string) {
    return this.context.delete(path);
  }
}
