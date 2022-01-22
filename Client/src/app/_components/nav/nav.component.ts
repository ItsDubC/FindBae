import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { TitleCasePipe } from '@angular/common';

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
    private toastr: ToastrService,
    private titleCasePipe: TitleCasePipe
  ) { }

  ngOnInit(): void { }

  login() {
    this.accountService.login(this.model).subscribe((result: any) => {
      this.toastr.success(`Welcome back, ${this.titleCasePipe.transform(result.username)}!`, "Success");
      this.router.navigateByUrl('/members');
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('');

    this.model.username = '';
    this.model.password = '';
  }
}
