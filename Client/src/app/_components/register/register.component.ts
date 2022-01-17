import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  model: any = {};
  registerForm: FormGroup;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl()
    })
  }

  register() {
    console.log(this.registerForm.value);
    // console.log(this.model);
    // this.accountService.register(this.model).subscribe(result => {
    //   //alert('Registration successful.  Welcome ' + result.username);
    //   this.toastr.success(`Registration successful.  Welcome ${result.username}!`);
    //   this.router.navigateByUrl('/members')
    // }, error => {
    //   console.log(error);
    //   this.toastr.error(error.error, "Error");
    // })
  }

  cancel() {
    console.log("cancel");
    this.cancelRegisterClicked.emit(true);
  }
}
