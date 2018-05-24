import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CookieService} from 'angular2-cookie/core';
import {UserService} from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private cookieService: CookieService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log(this.authService.isLoggedIn);
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login']);
      return false;
    } else {
      if (this.cookieService.get('schoolId')) {
          this.userService.getLoggedUserData().subscribe(response => {
              if ( response ) {
                  return true;
              } else {
                  this.router.navigate(['staff-login', this.cookieService.get('schoolId')]);
                  return false;
              }
          });
      } else {
          return true;
      }
    }
  }
}
