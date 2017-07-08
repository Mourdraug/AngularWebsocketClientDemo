import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { StompProvider } from './stomp.provider';
import { StompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public text = '';

  constructor(private stompProvider: StompProvider, private http: Http) {
    this.stompProvider.refreshService();
    this.subscribeToCurrent();
  }

  public setText(form: NgForm) {
    this.stompProvider.observable.subscribe((stompService) => {
      stompService.publish('/app/settext', form.value.text);
    });
  }

  public login() {
    const headers: Headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa('user:password'));
    this.http.get('http://localhost:8080/user', {
      headers: headers,
      withCredentials: true
    }).subscribe((res: Response) => {
      if (res.status === 200) {
        this.stompProvider.refreshService();
        this.subscribeToCurrent();
      }
    });
  }

  private subscribeToCurrent() {
    this.stompProvider.observable.subscribe((stompService) => {
      stompService.subscribe('/app/text').subscribe((msg: Message) => {
        this.text = msg.body;
      });
    });
  }
}
