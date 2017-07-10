import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { StompProvider } from './stomp.provider';
import { StompConfig } from '@stomp/ng2-stompjs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    StompProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
