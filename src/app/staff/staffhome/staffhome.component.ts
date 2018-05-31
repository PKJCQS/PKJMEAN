import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import * as io from 'socket.io-client';
declare var $: any;
@Component({
  selector: 'app-staffhome',
  templateUrl: './staffhome.component.html',
  styleUrls: ['./staffhome.component.css']
})
export class StaffhomeComponent implements OnInit, AfterViewInit {
    public alerts: any;
    public zt: any;
    private url = 'http://localhost:5000/';
    private socket;
    private schoolId: any;
  constructor(private route: Router, private cookieService: CookieService) {
      this.schoolId = this.cookieService.get('schoolId');
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
      this.socket = io(this.url);
      this.socket.emit('setSchool', this.schoolId);
      this.socket.on('latestAtendence', (data) => {
          this.alerts = data['exceptions'];
          this.zt = data['zoneTypes'];
          // console.log(this);
      });
  }
    logOut() {
        this.cookieService.remove('loggedUser' );
        this.route.navigate(['/staff-login', this.cookieService.get('schoolId' )]);
    }
}
