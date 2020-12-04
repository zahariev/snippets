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
  lastActive = 1;
  allCount;
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

          this.allCount = this.snippets.length;
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

  filterByUser(tab) {
    this.dataService.getOwnSnippetsData();
    this.lastActive = tab;
  }

  showAll(tab) {
    this.dataService.getSnippetsData();
    this.lastActive = tab;
  }

  voteToggle(id) {
    if (!this.user) return;
    this.dataService.vote(this.snippets[id]._id).subscribe((data) => {
      if (!data.ok) return;
      let idx = this.snippets[id].likes.indexOf(this.user._id);

      if (idx > -1) {
        this.snippets[id].likes.splice(idx, 1);
        this.snippets[id].countLikes -= 1;
      } else {
        this.snippets[id].likes.push(this.user._id);
        this.snippets[id].countLikes += 1;
      }
    });
  }

  deleteSnippet(id) {
    console.log('delete');

    this.dataService.deleteSnippet(this.snippets[id]._id);
  }
}
