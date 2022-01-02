import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(
    public accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  login() {
    this.accountService.login(this.model).subscribe((result: any) => {
      alert(result.username + ' logged in successfully');
      this.router.navigateByUrl('/members');
    },
    error => {
      alert(error.error);
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/home');
  }
}
