import { Injectable, Injector } from '@angular/core';
import { Snippet } from '../_models/snippet';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { HttpService } from './http.service';
// import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AccountService } from '@app/_services';

// import { PusherService } from './pusher.service';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  snippets;
  users;

  // private get _router() {
  //   // return this._injector.get(Router);
  // }

  private snippetSource = new BehaviorSubject([]);
  snippetData = this.snippetSource.asObservable();

  // private itemSource = new BehaviorSubject([]);
  // itemData = this.itemSource.asObservable();

  constructor(
    private accountService: AccountService,
    public http: HttpService // pusher: PusherService // private _injector: Injector
  ) {
    this.getSnippetsData();
    // this.getStatistics();
    // pusher.channel.bind('newSnippet', (data) => {
    //   this.snippets = data;
    //   this.snippetSource.next(data);
    // });
  }

  // Loads Data before appComponents

  getLocalStorage(item) {
    return JSON.parse(localStorage.getItem(item)) || {};
  }

  /*
      GET Settings
   */
  public getSnippetsData(): void {
    let path = '';
    if (this.accountService.userValue) path = '/all';

    this.http.get(`/snippets${path}`).subscribe((data: Snippet[]) => {
      if (data) {
        this.snippetSource.next(data);
      }
    });
  }

  private getStatistics(): void {
    let path = '';
    if (this.accountService.userValue) path = '/all';

    this.http.get(`/stats${path}`).subscribe((data: Snippet[]) => {
      if (data) {
        this.snippetSource.next(data);
      }
    });
  }

  /*
      PUT QUEUE
   */
}
