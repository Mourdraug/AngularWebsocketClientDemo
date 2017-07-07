import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { StompService } from '@stomp/ng2-stompjs';
import { StompConfigHttp } from  './stomp.config.http';
import { StompCsrfService } from './stomp.csrf.service';

/**
 *  Service providing our implementation of StompService which supports csrf protection.
 *  After logging in server will by default create new session for us, to ensure that StompService
 *  won't try to resubscribe to endpoints that might no longer be accessible,
 *  we want to have separate service for each session.
 */
@Injectable()
export class StompProvider {
  private service: StompCsrfService;
  private stompConfig: StompConfigHttp = {
    url: 'ws://localhost:8080/stomp',
    headers: {
      login: 'guest',
      passcode: 'guest'
    },
    heartbeat_in: 0,
    heartbeat_out: 20000,
    reconnect_delay: 5000,
    debug: true,
    http: null
  };

  constructor(private http: Http) {
    this.stompConfig.http = http;
  }

  public newService() {
    if (this.service !== undefined) {
      this.service.disconnect();
      this.service = null;
    }
  }

  public getService(): StompService {
    if (this.service == null) {
      console.log(this.service);
      this.service = new StompCsrfService(this.stompConfig);
    }
    return this.service;
  }
}
