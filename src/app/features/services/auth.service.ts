import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginUser } from '../components/login/user';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

    private currentUserSubject: BehaviorSubject<String>;
    public currentUser: Observable<String>;

  constructor(private http: HttpClient) {
      super();
      this.currentUserSubject = new BehaviorSubject<String>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  get currentUserValue(): String {
        return this.currentUserSubject.value;
    }

  login(loginUser: LoginUser): Observable<any> {
      return this.http.post(this.getBaseUrl() + "/login-service/api/v1/login", loginUser)
      .pipe(map((response: any) => {
                // store user details in local storage to keep user logged in between page refreshes
                let user = window.btoa(response.email + ':' + response.userName);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
  }

  forgotPassword(email: String): Observable<any> {
      return this.http.put(this.getBaseUrl() + "/login-service/api/v1/login/password?email=" + email, null);
  }

 logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    }
}
