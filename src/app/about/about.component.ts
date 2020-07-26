import { Component, OnInit } from '@angular/core';
import {LeaderService } from '../services/leader.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Leader } from '../shared/leader';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leaders: Leader[] ;
  constructor(private leaderService: LeaderService,) { }

  ngOnInit() {
    this.leaders = this.leaderService.getLeaders();
  }

}
