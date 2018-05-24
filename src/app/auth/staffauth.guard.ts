import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class StaffauthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {

    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // console.log(this.authService.isLoggedIn);
        if (!this.authService.isLoggedIn) {
            this.router.navigate(['/staff-login', this.cookieService.get('schoolId')]);
            return false;
        } else {
            if (this.cookieService.get('schoolId')) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        }
    }
}
