import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
declare var $: any, Morris: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class StaffhomeComponent implements OnInit, AfterViewInit {

  constructor(private route: Router, private cookieService: CookieService) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
  }
    logOut() {
        this.cookieService.remove('loggedUser' );
        this.route.navigate(['/staff-login', this.cookieService.get('schoolId' )]);
    }
}
