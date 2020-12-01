import { Component } from '@angular/core';
import { DataService } from '../_services/data.service';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { Snippet } from '@app/_models/snippet';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent {
  user: User;
  snippets: any = [];

  constructor(
    private accountService: AccountService,
    private dataService: DataService
  ) {
    this.user = this.accountService.userValue;
    dataService.snippetData.subscribe(
      function (data) {
        if (data.length) {
          this.snippets = data;
        }
      }.bind(this)
    );
  }
}
