import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private readonly baseUrl = environment.apiUrl;
    private currentUserSource = new ReplaySubject<User>(1);
    currentUser$ = this.currentUserSource.asObservable();

    constructor(
        private http: HttpClient,
        private presenceService: PresenceService
    ) { }

    login(loginModel: any) {
        return this.http.post(this.baseUrl + 'account/login', loginModel).pipe(
            map((result: User) => {
                const user = result;

                if (user) {
                    this.setCurrentUser(user);
                    this.presenceService.createHubConnection(user);
                }

                return result;
            })
        )
    }

    logout() {
        localStorage.removeItem('user');
        this.setCurrentUser(null);
        this.presenceService.stopHubConnection();
    }

    register(registerUserInfo: any) {
        return this.http.post(this.baseUrl + 'account/register', registerUserInfo).pipe(
            map((result: User) => {
                const user = result;

                if (user) {
                    this.setCurrentUser(user);
                    this.presenceService.createHubConnection(user);
                }

                return result;
            })
        )
    }

    setCurrentUser(user: User) {
        if (user) {
            user.roles = [];
            const roles = this.getDecodedToken(user.token).role;
    
            Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
        }

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
    }

    getDecodedToken(token) {
        return JSON.parse(atob(token.split('.')[1]));
    }
}
