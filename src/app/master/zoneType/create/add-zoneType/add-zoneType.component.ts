import { ZoneTypeService } from '../../zoneType.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import { } from 'googlemaps';

import {ActivatedRoute, Router} from '@angular/router';
import {SchoolService} from '../../../school/school.service';
declare var $: any;


@Component({
  selector: 'app-add-zonetype',
  templateUrl: './add-zoneType.component.html',
  styleUrls: ['./add-zoneType.component.css']
})
export class AddZoneTypeComponent implements OnInit, AfterViewInit {
    public zoneType: any;
    public zoneTypeId: string;
    private options: any;
    constructor( private zoneTypeService: ZoneTypeService,
                 private route: Router,
                 private schoolService: SchoolService,
                 private route1: ActivatedRoute) {
      this.zoneType = [];
      const zoneTypeId = this.route1.params.subscribe(params => {
          this.zoneTypeId =  params['id']; // (+) converts string 'id' to a number
      });
      if ( this.zoneTypeId ) {
          this.zoneTypeService.getZoneType( this.zoneTypeId).subscribe(response => {
              this.zoneType = response;
          });
      }
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

  public saveZoneType(event) {
      if ($('#form_validation').valid()) {
          this.zoneTypeService.save(this.zoneType).subscribe(response => {
              this.zoneType = response;
              this.route.navigate(['cpanel/master/zoneType/view-all']);
          });
      }
   }
}
