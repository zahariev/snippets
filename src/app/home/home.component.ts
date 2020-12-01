import { Component } from '@angular/core';
import { dataService } from '../_services/data.service';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent {
  user: User;
  snippets;

  constructor(
    private accountService: AccountService,
    private dataService: dataService
  ) {
    this.user = this.accountService.userValue;
    this.snippets = dataService.snippets;
  }
}
