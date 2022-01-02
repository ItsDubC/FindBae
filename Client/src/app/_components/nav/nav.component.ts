import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { }

  login() {
    this.accountService.login(this.model).subscribe((result: any) => {
      //alert(result.username + ' logged in successfully');
      this.toastr.success(`Welcome back, ${result.username}!`, "Success");
      this.router.navigateByUrl('/members');
    },
    error => {
      console.log(error.error);
      this.toastr.error(error.error, "Error")
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/home');
  }
}
