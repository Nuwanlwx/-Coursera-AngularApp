import { Component, OnInit, Inject } from '@angular/core';
import {LeaderService } from '../services/leader.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animation';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  // tslint:disable-next-line: use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class AboutComponent implements OnInit {
  leaderErrMess: string;
  leaders: Leader[] ;
  constructor(private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
   this.leaderService.getLeaders().
   subscribe(leaders =>  this.leaders = leaders,
    errmess => this.leaderErrMess = <any>errmess );
  }

}
