import { Component } from '@angular/core';
import { DataService } from '../_services/data.service';
import { authUser } from '@app/_models';
import { AccountService } from '@app/_services';
import { Snippet } from '@app/_models/snippet';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent {
  user: authUser;
  snippets: any = [];

  constructor(
    private accountService: AccountService,
    private dataService: DataService,
    private activeRoute: ActivatedRoute
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

  ngOnInit() {
    const queryParams = this.activeRoute.snapshot.queryParams;
    const routeParams = this.activeRoute.snapshot.params;

    // do something with the parameters
    this.dataService.getSnippetsData();
  }

  countMySnippets() {
    return this.snippets.filter((snippet) => snippet.createdBy == this.user._id)
      .length;
  }

  voteToggle(id) {
    this.dataService.vote(this.snippets[id]._id).subscribe((data) => {
      if (!data.ok) return;
      let idx = this.snippets[id].likes.indexOf(this.user._id);
      console.log(idx);

      if (idx > -1) {
        this.snippets[id].likes.splice(idx, 1);
        this.snippets[id].countLikes -= 1;
      } else {
        this.snippets[id].likes.push(this.user._id);
        this.snippets[id].countLikes += 1;
      }
    });
  }
}
