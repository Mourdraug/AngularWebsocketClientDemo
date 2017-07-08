import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { StompConfig, StompService } from '@stomp/ng2-stompjs';

/**
 *  Service providing our implementation of StompService which supports csrf protection.
 *  After logging in server will by default create new session for us, to ensure that StompService
 *  won't try to resubscribe to endpoints that might no longer be accessible,
 *  we want to have separate service for each session.
 */
@Injectable()
export class StompProvider {
  public service: StompService;

  private behaviorSubjectStompService = new BehaviorSubject<StompService>(null);

  public observable: Observable<StompService>;

  private stompConfig: StompConfig = {
    url: 'ws://localhost:8080/stomp',
    headers: {
      login: 'guest',
      passcode: 'guest'
    },
    heartbeat_in: 0,
    heartbeat_out: 20000,
    reconnect_delay: 5000,
    debug: true
  };

  constructor(private http: Http) {
    this.service = null;

    this.observable = this.behaviorSubjectStompService.filter((service) => {
        return !!service;
      }
    ).take(1);
  }

  public refreshService(): void {
    this.disconnect();

    document.cookie = 'XSRF-TOKEN=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    this.http.get('http://localhost:8080/csrf', {withCredentials: true}).filter((res) => {
      return res.status === 200;
    }).subscribe((res) => {
      this.stompConfig.headers['X-XSRF-TOKEN'] = this.getCookie('XSRF-TOKEN');
      this.connect();
    });

  }

  private connect() {
    this.service = new StompService(this.stompConfig);
    this.behaviorSubjectStompService.next(this.service);
  }

  private getCookie(cookieName: string): string {
    let value = null;

    const cookies: Array<string> = document.cookie.split(';');
    for (let c of cookies) {
      c = c.replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        value = c.substring(cookieName.length + 1, c.length);
      }
    }

    return value;
  }

  private disconnect() {
    if (this.service) {
      this.service.disconnect();
      this.service = null;

      this.behaviorSubjectStompService.next(this.service);
    }
  }
}
