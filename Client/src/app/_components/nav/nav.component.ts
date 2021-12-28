import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  isLoggedIn: boolean = false;

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
  }

  login() {
    console.log(this.model);

    this.accountService.login(this.model).subscribe((result: any) => {
      alert(result.username + ' logged in successfully');
      this.isLoggedIn = true;
    },
    error => {
      alert(error.error);
    })
  }
}
