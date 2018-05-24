import { Component, OnInit, AfterViewInit } from '@angular/core';
import {UserService} from '../../../user/user.service';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit, AfterViewInit {
  public Name: any;
  public userEmail: any;
  constructor(private userService: UserService,
              private route: Router,
              private cookieService: CookieService) {
    this.userService.getLoggedUserData().subscribe(response => {
        if ( response ) {
            // console.log(data);
            this.Name = response['userInfo']['firstName']
                + ' ' + ( response['userInfo']['middleName'] ? response['userInfo']['middleName'] + ' ' : '')
                + response['userInfo']['lastName'];
            this.userEmail = response['userInfo']['email'];
        }
    });
  }
  logOut() {
      this.cookieService.remove('loggedUser' );
      this.route.navigate(['login']);
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
  }
}
