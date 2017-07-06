import { StompConfig } from '@stomp/ng2-stompjs';
import { Http } from '@angular/http';

/**
 * We need to somehow pass Http object to our csrf token-supporting StompService
 * Because it connects in constructor, we have to pass it before super constructor call
 * As messy as it is, extending StompConfig and adding http field there was the only way I found.
 */
export interface StompConfigHttp extends StompConfig{
	http:Http;
}