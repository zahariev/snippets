import { Component } from '@angular/core';

import { AccountService } from './_services';
import { authUser } from './_models';
import { Router } from '@angular/router';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  user: authUser;

  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.user.subscribe((x) => (this.user = x));
  }

  logout() {
    this.accountService.logout();
  }

  login() {
    this.accountService.logout();
  }

  newSnippet() {
    this.router.navigate(['/post']);
  }
}
