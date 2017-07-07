import { Http, Response } from '@angular/http';

import { StompService, StompConfig } from '@stomp/ng2-stompjs';

import { Observable } from 'rxjs/Observable';

import { StompConfigHttp } from './stomp.config.http';

import 'rxjs/observable/timer';

/**
 * We're extending StompService to make changes required to make csrf protection work.
 */
export class StompCsrfService extends StompService {

  constructor(protected config: StompConfigHttp) {
    super(config);
  }

  /**
   * To connect properly throught STOMP 2 things are needed:
   * 1. Correct session cookie.
   * Angular does this for us as long as credentials are enabled during login.
   * 2. Csrf token needs to be set in STOMP header.
   * Angular supports csrf headers for http out of the box,
   * it sends XSRF-TOKEN cookie as X-XSFR-TOKEN and this behaviour can be accepted by spring security.
   * Spring Security for WS however, requires token not only in upgrade request, but also in STOMP
   * frame headers, that's why we first have to acquire csrf token, and only then try to connect.
   * We also need to clear old token to receive new on login.
   */
  protected try_connect(): void {
    document.cookie = 'XSRF-TOKEN=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.config.http.get('http://localhost:8080/csrf', {withCredentials: true}).subscribe((res: Response) => {
      if (res.status === 200) {
        this.xsrfSetup()
        super.try_connect();
      }
      else
        Observable.timer(5000).subscribe(() => {
          this.try_connect();
        });
    });
  }

  protected xsrfSetup(): void {
    let cookies: Array<string> = document.cookie.split(';');
    for (let c of cookies) {
      c = c.replace(/^\s+/g, '');
      if (c.indexOf('XSRF-TOKEN') == 0) {
        this.config.headers['X-XSRF-TOKEN'] = c.substring(11, c.length);
        return;
      }
    }
  }
}
