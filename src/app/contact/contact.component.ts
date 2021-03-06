import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
// import { setTimeout } from 'timers';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };
  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  feedbackcopy: Feedback;
  feedbackRes: Feedback;
  feedbackRescopy: Feedback;
  errMess: string;
  showForm: boolean = true;
  showRes = false;
  constructor(private fb: FormBuilder,
    private feedbackservice: FeedbackService,) {
    this.createForm();
  }


  ngOnInit() {
  }
  createForm() {
    // static min(min: number): ValidatorFn
    // static max(max: number): ValidatorFn
    // static required(control: AbstractControl): ValidationErrors | null
    // static requiredTrue(control: AbstractControl): ValidationErrors | null
    // static email(control: AbstractControl): ValidationErrors | null
    // static minLength(minLength: number): ValidatorFn
    // static maxLength(maxLength: number): ValidatorFn
    // static pattern(pattern: string | RegExp): ValidatorFn
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now

  }
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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
    this.showForm = false;
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackservice.submitFeedback(this.feedback )
    .subscribe(feedbackRes  => {
      this.feedbackRes = feedbackRes; this.feedbackRescopy = feedbackRes;
      console.log(this.feedbackRes);
      this.showRes = true;
      this.controlForm();
    },
    errmess => {this.feedback = null; this.feedbackcopy = null; this.errMess = <any>errmess; 
      this.showRes = false;
      this.controlForm(); });
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

  controlForm() {
    setTimeout(() => {
      this.showForm = true;
    }, 5000);
  }
}
