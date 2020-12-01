import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PusherService {
  pusher: any;
  channel: any;
  socket_id: string;

  public socketSource = new BehaviorSubject([]);
  socketId = this.socketSource.asObservable();

  constructor(private http: HttpClient) {
    this.pusher = new Pusher(environment.PUSHER.APP_KEY, {
      cluster: environment.PUSHER.APP_CLUSTER,
    });

    // socket_id change detection
    this.pusher.connection.bind(
      'connected',
      function (data) {
        if (data.socket_id) {
          this.socketSource.next(data.socket_id);
        }
      }.bind(this)
    );

    // connection state
    this.pusher.connection.bind(
      'unavailable',
      function (data) {
        // alert('Wethg');
      }.bind(this)
    );

    this.channel = this.pusher.subscribe('officernd');
  }
}
