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
    this.getCurrentUser();
  }

  login() {
    this.accountService.login(this.model).subscribe((result: any) => {
      alert(result.username + ' logged in successfully');
      //console.log(result);
      this.isLoggedIn = true;
    },
    error => {
      alert(error.error);
    })
  }

  logout() {
    this.isLoggedIn = false;
    this.accountService.logout();
  }

  getCurrentUser() {
    this.accountService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    }, error => {
      console.log(error);
    })
  }
}
