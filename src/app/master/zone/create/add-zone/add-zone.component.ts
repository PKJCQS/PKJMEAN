import { ZoneService } from '../../zone.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import { } from 'googlemaps';
import {ActivatedRoute, Router} from '@angular/router';
import {SchoolService} from '../../../school/school.service';
import {ZoneTypeService} from '../../../zoneType/zoneType.service';
import {GatewayService} from '../../../gateway/gateway.service';
declare var $: any;

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.css']
})
export class AddZoneComponent implements OnInit, AfterViewInit {
    public zone: any;
    public zoneId: string;
    private options: any;
    private zoneTypes: any;
    private gateways: any;
    constructor( private zoneService: ZoneService,
                 private route: Router,
                 private schoolService: SchoolService,
                 private zoneTypeService: ZoneTypeService,
                 private gatewayService: GatewayService,
                 private route1: ActivatedRoute) {
      this.zone = [];
      const zoneId = this.route1.params.subscribe(params => {
          this.zoneId =  params['id']; // (+) converts string 'id' to a number
      });
      if ( this.zoneId ) {
          this.zoneService.getZone( this.zoneId).subscribe(response => {
              this.zone = response;
          });
          this.gatewayService.getAllGatewaysWithFilter('').subscribe(response => {
              this.gateways = response;
          });
      } else {
          this.gatewayService.getAllGatewaysNotInUse('').subscribe(response => {
              this.gateways = response;
          });
      }
        this.schoolService.getAllSchoolsWithFilter('').subscribe(response => {
            this.options = response;
        });
        this.zoneTypeService.getAllZoneTypesWithFilter('').subscribe(response => {
            this.zoneTypes = response;
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
   }
}
