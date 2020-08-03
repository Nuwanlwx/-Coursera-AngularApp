import { Component, OnInit, Input , ViewChild, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { Comment } from '../shared/comment';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  @ViewChild('fform') commentFormDirective;
  // @Input()
  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  comment: Comment;
  commentForm: FormGroup;
  formErrors = {
    'author': '',
    'rating': '',
    'comment': '',
  };
  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Message is required.',
    },
  };
  // selectedDish =  DISHES[0];
  constructor(private dishservice: DishService, private fb: FormBuilder,
    private route: ActivatedRoute,
    @Inject('BaseURL') private BaseURL,
    private location: Location) { 
      this.createForm(); 
    }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
      errmess => this.errMess = <any> errmess);
    }
  
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
    goBack(): void {
      this.location.back();
    }
    createForm() {

      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        comment: ['', [Validators.required]],
        rating: 5,
        date: ''
      });
      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  
    this.onValueChanged(); // (re)set validation messages now
  
    }
    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }
  
    onSubmit() {
      const date = new Date();
      // this.comment.date = date.toString();
      // console.log(date);
      this.commentForm.value.date = date;
      this.comment = this.commentForm.value;
      console.log(this.comment);
      this.dish.comments.push(this.comment);
      console.log(  this.dish);
      this.commentForm.reset({
        author: '',
        rating: 5,
        comment: '',
        date: ''
      });
      this.commentFormDirective.resetForm();
      console.log(this.commentForm.value);
    }
}
