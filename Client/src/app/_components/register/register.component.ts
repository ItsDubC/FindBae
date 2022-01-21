import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/_services/account.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegisterClicked: EventEmitter<any> = new EventEmitter();
    //model: any = {};
    registerForm: FormGroup;
    maxDate: Date;
    validationErrors: string[] = [];

    constructor(
        private accountService: AccountService,
        private router: Router,
        private toastr: ToastrService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initializeForm();
        this.maxDate = new Date();
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    }

    initializeForm() {
        this.registerForm = this.fb.group({
            username: ['', Validators.required],
            gender: ['non-binary'],
            knownAs: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(15)]
            ],
            confirmPassword: ['', [
                Validators.required, 
                this.matchValues('password')]
            ]
        });

        this.registerForm.controls.password.valueChanges.subscribe(() => {
            this.registerForm.controls.confirmPassword.updateValueAndValidity();
        })
    }

    matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl) => {
            return control?.value === control?.parent?.controls[matchTo].value
                ? null
                : { isMatching: true }
        };
    }

    register() {
        this.accountService.register(this.registerForm.value).subscribe(result => {
          this.toastr.success(`Registration successful.  Welcome ${result.username}!`);
          this.router.navigateByUrl('/members')
        }, error => {
          console.log(error);
          //this.toastr.error(error.error, "Error");
          this.validationErrors = error;
        })
    }

    cancel() {
        console.log("cancel");
        this.cancelRegisterClicked.emit(true);
    }
}
