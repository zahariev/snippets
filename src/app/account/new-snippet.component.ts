import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-new-snippet',
  templateUrl: './new-snippet.component.html',
})
export class NewSnippetComponent implements OnInit {
  form: FormGroup;
  tags;
  submitted: boolean = false;

  // @Input('formGroup') userForm: FormGroup = new FormGroup({
  //   title: new FormControl(''),
  //   tags: new FormControl(''),
  //   code: new FormControl(''),
  // });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private data: DataService
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      tags: ['', Validators.required],
      code: ['', Validators.required],
      private: [''],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.form.controls;
  }

  submit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.data.http
      .post('/snippets/add', {
        code: this.f.code.value,
        title: this.f.title.value,
        tags: this.f.tags.value,
        private: this.f.private.value || false,
      })
      .subscribe({
        next: (data) => {
          if (data) {
            // this.data.reload(data);
            this.router.navigate(['/']);
          }
        },
      });
    return false;
  }

  cancel(ev) {
    this.router.navigate(['/']);
    ev.stopPropagation();
  }
}
