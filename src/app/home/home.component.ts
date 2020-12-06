import { Component } from '@angular/core';
import { DataService } from '../_services/data.service';
import { authUser } from '@app/_models';
import { AccountService } from '@app/_services';
import { Snippet } from '@app/_models/snippet';
import { Stat } from '@app/_models/stat';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent {
  user: authUser;
  snippets: any = [];
  lastActive = 1;
  allCount;
  stats;
  countLikes;
  chart;
  series;

  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 1000,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 400,
    overflow: false,
  };

  constructor(
    private accountService: AccountService,
    private dataService: DataService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.user = this.accountService.userValue;
    dataService.snippetData.subscribe(
      function (data) {
        this.snippets = data;
        this.allCount = this.snippets.length;
      }.bind(this)
    );
  }

  ngOnInit() {
    const queryParams = this.activeRoute.snapshot.queryParams;
    const routeParams = this.activeRoute.snapshot.params;

    // do something with the parameters
    this.dataService.getSnippetsData();
    // get added info for likes and stars/votes
    if (this.user?.isAdmin) this.calculateStats();
  }

  calculateStats() {
    this.dataService.getStats().subscribe(
      (stats: Stat) => {
        this.stats = stats;
        this.countLikes = 0;
        this.stats.forEach((tag) => {
          this.countLikes += tag.likes;
        });
      },
      (err) => console.log(err)
    );
  }

  countMySnippets() {
    return this.snippets.filter((snippet) => snippet.createdBy == this.user._id)
      .length;
  }

  filterByUser(tab) {
    this.snippets = this.snippets.filter(
      (snippet) => snippet.createdBy == this.user._id
    );
    this.lastActive = tab;
  }

  showAll(tab) {
    this.dataService.getSnippetsData();
    this.lastActive = tab;
  }

  showTagsCloud() {
    this.lastActive = 3;
    let newSeries = [];
    this.stats.forEach((x) => {
      newSeries.push({ text: x.tag, weight: x.count });
    });
    this.series = newSeries;
  }

  showVotesCloud() {
    this.lastActive = 4;
    let newSeries = [];
    this.stats.forEach((x) => {
      newSeries.push({ text: x.tag, weight: x.likes });
    });
    this.series = newSeries;
  }

  voteToggle(id) {
    if (!this.user) return;
    this.dataService.vote(this.snippets[id]._id).subscribe((data) => {
      if (!data.ok) return;
      let idx = this.snippets[id].likes.indexOf(this.user._id);

      if (idx > -1) {
        this.snippets[id].likes.splice(idx, 1);
        this.snippets[id].countLikes -= 1;
        this.countLikes -= 1;
      } else {
        this.snippets[id].likes.push(this.user._id);
        this.snippets[id].countLikes += 1;
        this.countLikes += 1;
      }
    });
  }

  async deleteSnippet(id) {
    this.dataService.deleteSnippet(this.snippets[id]._id);

    // this.snippets.splice(id, 1);
    // this.allCount = this.snippets.length;
  }
}
