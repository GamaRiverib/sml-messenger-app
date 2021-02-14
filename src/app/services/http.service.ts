import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';

export type HttpHeaders = { [header: string]: string };

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private _useWeb = true;

  private _token: string;


  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    private platform: Platform) {
      if (this.platform.is('hybrid')) {
        this._useWeb = false;
      } else {
        this._useWeb = true;
      }
  }

  get useWeb(): boolean {
    return this._useWeb;
  }

  set useWeb(val: boolean) {
    this._useWeb = val;
  }

  get token(): string {
    return this._token;
  }

  set token(val: string) {
    this._token = val;
  }

  private throwError(reason: { status: number }): void {
    console.log(reason);
    switch (reason.status || -1) {
      case 403:
        throw { error: 0 };
      case 409:
        throw { error: 1 };
      default:
        throw { error: -1 };
    }
  }

  private getWeb(url: string, headers?: HttpHeaders, options?: any): Promise<any> {
    try {
      options = Object.assign(options || {}, headers ? { headers } : {});
      return this.httpClient.get(url, options).toPromise();
    } catch (reason) {
      this.throwError(reason);
    }
  }

  private postWeb(url: string, body: any, headers?: HttpHeaders, options?: any): Promise<any> {
    try {
      options = Object.assign(options || {}, headers ? { headers } : {});
      return this.httpClient.post(url, body, options).toPromise();
    } catch (reason) {
      this.throwError(reason);
    }
  }

  private putWeb(url: string, body?: any, headers?: HttpHeaders, options?: any): Promise<any> {
    try {
      options = Object.assign(options || {}, headers ? { headers } : {});
      return this.httpClient.put(url, body, options).toPromise();
    } catch (reason) {
      this.throwError(reason);
    }
  }

  private deleteWeb(url: string, headers?: HttpHeaders, options?: any): Promise<any> {
    try {
      options = Object.assign(options || {}, headers ? { headers } : {});
      return this.httpClient.delete(url, options).toPromise();
    } catch (reason) {
      this.throwError(reason);
    }
  }

  private async getNative(url: string, headers?: HttpHeaders, options?: any): Promise<any> {
    try {
      // this.http.clearCookies();
      const response: HTTPResponse = await this.http.get(url, {}, headers);
      if (response.status >= 300) {
        console.log('get request error', { status: response.status, error: response.error });
        throw { error: -1 };
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  private async postNative(url: string, body: any, headers?: HttpHeaders, options?: any): Promise<any> {
    try {
      // this.http.clearCookies();
      const response: HTTPResponse = await this.http.post(url, body, headers);
      if (response.status >= 300) {
        console.log('post request error', { status: response.status, error: response.error });
        throw { error: -1 };
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  private async putNative(url: string, body?: any, headers?: HttpHeaders, options?: any): Promise<any> {
    try {
      // this.http.clearCookies();
      const response: HTTPResponse = await this.http.put(url, body, headers);
      if (response.status >= 300) {
        console.log('put request error', { status: response.status, error: response.error });
        throw { error: -1 };
      }
      return response.data;
    } catch (reason) {
      console.log(reason);
      return null;
    }
  }

  private async deleteNative(url: string, headers?: HttpHeaders, options?: any): Promise<any> {
    try {
      // this.http.clearCookies();
      const response: HTTPResponse = await this.http.delete(url, {}, headers);
      if (response.status >= 300) {
        console.log('delete request error', { status: response.status, error: response.error });
        throw { error: -1 };
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  private setTokenToHeaders(headers?: HttpHeaders): HttpHeaders {
    let h: HttpHeaders = headers || {};
    if (this._token) {
      h['Authorization'] = `Bearer ${this._token}`;
    }
    return h;
  }

  public get(url: string, headers?: HttpHeaders, options?: any): Promise<any> {
    headers = this.setTokenToHeaders(headers);
    if (this.platform.is('hybrid') && !this._useWeb) {
      return this.getNative(url, headers, options);
    }
    return this.getWeb(url, headers, options);
  }

  public post(url: string, body: any, headers?: HttpHeaders, options?: any): Promise<any> {
    headers = this.setTokenToHeaders(headers);
    if (this.platform.is('hybrid') && !this._useWeb) {
      return this.postNative(url, body, headers, options);
    }
    return this.postWeb(url, body, headers, options);
  }

  public put(url: string, body?: any, headers?: HttpHeaders, options?: any): Promise<any> {
    headers = this.setTokenToHeaders(headers);
    if (this.platform.is('hybrid') && !this._useWeb) {
      return this.putNative(url, body, headers, options);
    }
    return this.putWeb(url, body, headers, options);
  }

  public delete(url: string, headers?: HttpHeaders, options?: any): Promise<any> {
    headers = this.setTokenToHeaders(headers);
    if (this.platform.is('hybrid') && !this._useWeb) {
      return this.deleteNative(url, headers, options);
    }
    return this.deleteWeb(url, headers, options);
  }

}