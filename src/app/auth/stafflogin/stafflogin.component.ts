import { AuthService } from '../auth.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import {Title} from '@angular/platform-browser';
import {SchoolService} from '../../master/school/school.service';

declare var $: any;

@Component({
  selector: 'app-stafflogin',
  templateUrl: './stafflogin.component.html',
  styleUrls: ['./stafflogin.component.css']
})
export class StaffloginComponent implements OnInit, AfterViewInit {
    public schoolId: string;
    public schoolDtl: any;
  constructor(private authService: AuthService,
              private route: Router,
              private cookieService: CookieService,
              private schoolService: SchoolService,
              private route1: ActivatedRoute,
              private titleService: Title ) {
      this.route1.params.subscribe(params => {
          this.schoolDtl = {};
          this.schoolId = params['schoolId']; // (+) converts string 'id' to a number
          if (params['schoolId']) {
              this.schoolService.getSchool(this.schoolId).subscribe(response => {
                  this.schoolDtl = response;
                  this.titleService.setTitle(response['name'] + ' School Staff Login');
              });
              // In a real app: dispatch action to load the details here.
          } else {
              this.titleService.setTitle('School Staff Login');
          }
      });
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    $('body').addClass('login-page');
  }
  stopDefaultSubmit() { return false; }
  submitLogin(phone: string, password: string) {
    if ($('#sign_in').valid()) {
      this.authService.staffLogin(phone, password).subscribe( response => {
          if ( response) {
              if ('_id' in  response) {
                  this.authService.isLoggedIn = true;
                  this.cookieService.put('loggedUser', response['_id'] + '_STAFF');
                  this.route.navigate(['cpanel/staff-dashboard']);
              }
          }
      });
    }
  }
}
