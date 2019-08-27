import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginUser, User } from '../components/login/user';
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
               if(response.code === "200") {
                this.setLocalStorage(response.email, response.userName);
               }
                return response;
            }));
  }

  signup(user: User): Observable<any> {
    return this.http.post(this.getBaseUrl() + `/login-service/api/v1/signup`, user)
        .pipe(map((response: any) => {
            if(response.code === "200") {
                this.setLocalStorage(response.email, response.userName);
            }
            return response;
            }));
  }

  setLocalStorage(email: string, userName: string) {
   // store user details in local storage to keep user logged in between page refreshes
    let user = window.btoa(email + ':' + userName);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  forgotPassword(email: String): Observable<any> {
    return this.http.put(this.getBaseUrl() + "/login-service/api/v1/login/password?email=" + email, null);
  }

 logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
 }

 validateUserByMobile(mobile: string): Observable<any> {
     return this.http.get(this.getBaseUrl() + "/login-service/api/v1/user/validate?mobile=" + mobile);
 }

 generateOTP(mobile: string): Observable<any> {
    let header = new HttpHeaders({'content-type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.smsgateway.center/OTPApi/send', {
        userId: 'jami11',
        password: 'nlljyel7',
        mobile: '91'+mobile,
        senderId: 'SGCSMS',
        sendMethod: 'generate',
        codeLength: 4
  }, {headers : header});
 }

 validateOTP(mobile:string, otp: string): Observable<any> {
    let header = new HttpHeaders({'content-type': 'application/x-www-form-urlencoded'});
    return this.http.post('https://www.smsgateway.center/OTPApi/send', {
        userId: 'jami11',
        password: 'nlljyel7',
        mobile: '91'+mobile,
        sendMethod: 'verify',
        otp: otp
  }, {headers : header})
  .pipe(map((response: any) => {
        if(response.status === "success") {
            this.setLocalStorage(response.mobile, response.statusCode);
        }
        return response;
    }));
 }
}
