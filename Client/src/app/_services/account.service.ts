import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  login(loginModel: any) {
    return this.http.post(this.baseUrl + 'account/login', loginModel).pipe(
      map((result: User) => {
        const user = result;

        if (user) {
          this.setCurrentUser(user);
        }

        return result;
      })
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.setCurrentUser(null);
  }

  register(registerUserInfo: any) {
    return this.http.post(this.baseUrl + 'account/register', registerUserInfo).pipe(
      map((result: User) => {
        const user = result;

        if (user) {
          this.setCurrentUser(user);
        }

        return result;
      })
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
}
