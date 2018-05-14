import { ZoneService } from '../../zone.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import { } from 'googlemaps';

import {ActivatedRoute, Router} from '@angular/router';
import {SchoolService} from '../../../school/school.service';
declare var $: any;


@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.css']
})
export class AddZoneComponent implements OnInit, AfterViewInit {
    /*public myControl = new FormControl();
    public filteredOptions: any;*/
    public zone: any;
    public zoneId: string;
    private options: any;
    constructor( private zoneService: ZoneService,
                 private route: Router,
                 private schoolService: SchoolService,
                 private route1: ActivatedRoute) {
      this.zone = [];
      this.zone.password = 'minew123';
      const zoneId = this.route1.params.subscribe(params => {
          this.zoneId =  params['id']; // (+) converts string 'id' to a number

          // In a real app: dispatch action to load the details here.
      });
      // this.myControl = new FormControl();
      // params( 'id' );
      if ( this.zoneId ) {
          this.zoneService.getZone( this.zoneId).subscribe(response => {
              this.zone = response;
          });
      }
        this.schoolService.getAllSchoolsWithFilter('').subscribe(response => {
            this.options = response;
        });
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
      $('#form_validation').validate({
          rules: {
              'checkbox': {
                  required: true
              },
              'gender': {
                  required: true
              }
          },
          highlight: function (input) {
              $(input).parents('.form-line').addClass('error');
          },
          unhighlight: function (input) {
              $(input).parents('.form-line').removeClass('error');
          },
          errorPlacement: function (error, element) {
              $(element).parents('.form-group').append(error);
          }
      });
  }

  public saveZone(event) {
      if ($('#form_validation').valid()) {
          this.zoneService.save(this.zone).subscribe(response => {
              this.zone = response;
              this.route.navigate(['cpanel/master/zone/view-all']);
          });
      }
      // this.cookieService.put('putting', 'putty');
   }
}
