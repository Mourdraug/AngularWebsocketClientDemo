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
	public text: string = '';

	constructor(private stompProvider: StompProvider, private http: Http) {
		this.subscribeToCurrent();
	}

	public setText(form: NgForm) {
		this.stompProvider.getService().publish('/app/settext', form.value.text);
	}

	public login() {
		let headers: Headers = new Headers();
		headers.append("Authorization", "Basic " + btoa("user:password"));
		this.http.get("http://localhost:8080/user", { headers: headers, withCredentials: true }).subscribe((res: Response) => {
			if (res.status == 200) {
				this.stompProvider.newService();
				this.subscribeToCurrent();
			}
		});
	}

	private subscribeToCurrent() {
		this.stompProvider.getService().subscribe('/app/text').subscribe((msg: Message) => {
			this.text = msg.body;
		});

	}
}
