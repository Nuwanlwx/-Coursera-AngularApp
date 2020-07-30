import { Component, OnInit, Input } from '@angular/core';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  // @Input()
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  // selectedDish =  DISHES[0];
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    console.log('dsdsd');
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
     .subscribe(dish => this.dish = dish);
  }
  goBack(): void {
    this.location.back();
  }
}
