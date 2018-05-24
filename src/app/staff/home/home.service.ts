import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class StaffhomeService {

    constructor(private http: HttpClient, private authService: AuthService, private cookieService: CookieService) {
}
}
