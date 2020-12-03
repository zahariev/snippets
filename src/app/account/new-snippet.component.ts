import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-snippet',
  templateUrl: './new-snippet.component.html',
})
export class NewSnippetComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  @Input('formGroup') userForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    tags: new FormControl(''),
    code: new FormControl(''),
  });

  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: '',
      tags: '',
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // this.loading = true;
    // this.accountService
    //   .register(this.form.value)
    //   .pipe(first())
    //   .subscribe({
    //     next: () => {
    //       this.alertService.success('Registration successful', {
    //         keepAfterRouteChange: true,
    //       });
    //       this.router.navigate(['../login'], { relativeTo: this.route });
    //     },
    //     error: (err) => {
    //       this.alertService.error(err.error);
    //       this.loading = false;
    //     },
    //   });
    // }
  }

  cancel(ev) {
    this.router.navigate(['/']);
    ev.stopPropagation();
  }
}
