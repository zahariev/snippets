import { Component } from '@angular/core';

import { AccountService } from './_services';
import { authUser } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  user: authUser;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe((x) => (this.user = x));
  }

  logout() {
    this.accountService.logout();
  }
  login() {
    this.accountService.logout();
  }
}
