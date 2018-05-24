import { AuthService } from '../auth.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import {Title} from '@angular/platform-browser';
import {SchoolService} from '../../master/school/school.service';

declare var $, swal: any;

@Component({
  selector: 'app-staffforgot',
  templateUrl: './staffforgot.component.html',
  styleUrls: ['./staffforgot.component.css']
})
export class StaffforgotComponent implements OnInit, AfterViewInit {
    public schoolId: string;
    public schoolDtl: any;
    public forgot = false;
    public otp = false;
    public email: string;
    public userId: any;
    public notMatch = false;
    public invalid = false;
    public reset = false;
  constructor(private authService: AuthService,
              private route: Router,
              private cookieService: CookieService,
              private schoolService: SchoolService,
              private route1: ActivatedRoute,
              private titleService: Title ) {
      this.forgot = true;
      this.route1.params.subscribe(params => {
          this.schoolDtl = {};
          this.schoolId = params['schoolId']; // (+) converts string 'id' to a number
          if (params['schoolId']) {
              this.schoolService.getSchool(this.schoolId).subscribe(response => {
                  this.schoolDtl = response;
                  this.titleService.setTitle(response['name'] + ' School Staff Forgot Password');
              });
              // In a real app: dispatch action to load the details here.
          } else {
              this.titleService.setTitle('School Staff Forgot Password');
          }
      });
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    $('body').addClass('login-page');
  }
  stopDefaultSubmit() { return false; }
  submitForgot(email: string) {
      this.email = email;
    if ($('#sign_forgot').valid()) {
      this.authService.staffforgot(email).subscribe( response => {
          if ( response) {
              if (response !== 'invalid' ) {
                  this.forgot = false;
                  this.otp = true;
                  this.reset = false;
              } else {
                  this.invalid = true;
              }
          }
      });
    }
  }
    submitOTP(otp: string) {
        if ($('#sign_otp').valid()) {
            this.authService.verifyOtp(otp, this.email).subscribe( response => {
                if ( response) {
                    if (response !== 'invalid' ) {
                        this.forgot = false;
                        this.otp = false;
                        this.reset = true;
                        this.userId = response['userId'];
                    } else {
                        this.invalid = true;
                    }
                }
            });
        }
    }
    submitReset(password: string, confpassword: string) {
        if ($('#sign_reset').valid()) {
            if (password === confpassword) {
                this.authService.changePassword(password, this.userId).subscribe(response => {
                    if (response) {
                        swal('Success!', 'Your Password changed successfully', 'success');
                        this.route.navigate(['/staff-login', this.schoolId]);
                    }
                });
            } else {
                this.notMatch = true;
            }
        }
    }
}
