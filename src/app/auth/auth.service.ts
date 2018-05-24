import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'angular2-cookie/core';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthService {

  public isLoggedIn: any;
  public loggedId: any;
  constructor(private http: HttpClient, private cookieService: CookieService) {
      const isLogged = this.cookieService.get('loggedUser');
      if (isLogged) {
          this.isLoggedIn = true;
          this.loggedId = isLogged;
      } else {
          this.isLoggedIn = false;
          this.loggedId = false;
      }
   }
   public login(username: String, password: String) {
      return this.http.post('/api/users/login.json', {
          responseType: 'json',
          username: username,
          password: password
       }).pipe(
          map(res =>  res)
      );
   }
    public staffLogin(phone: String, password: String) {
        return this.http.post('/api/staffs/login.json', {
            responseType: 'json',
            phone: phone,
            password: password
        }).pipe(
            map(res =>  res)
        );
    }
    public staffforgot(email: string) {
        return this.http.post('/api/staffs/forgot-password.json', {
            responseType: 'json',
            email: email
        }).pipe(
            map(res =>  res)
        );
    }
    public verifyOtp(otp: string, email: string) {
        return this.http.post('/api/staffs/verify-otp.json', {
            responseType: 'json',
            otp: otp,
            email: email
        }).pipe(
            map(res =>  res)
        );
    }
    public changePassword(password: string, staffId: any) {
        return this.http.post('/api/staffs/update.json', {
            responseType: 'json',
            staff : {
                password: password,
                _id: staffId
            }
        }).pipe(
            map(res =>  res)
        );
    }
}
