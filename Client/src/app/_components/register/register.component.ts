import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegisterClicked: EventEmitter<any> = new EventEmitter();
  model: any = {};

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
  }

  register() {
    console.log(this.model);
    this.accountService.register(this.model).subscribe(result => {
      alert('Registration successful.  Welcome ' + result.username);
    })
  }

  cancel() {
    console.log("cancel");
    this.cancelRegisterClicked.emit(true);
  }
}
