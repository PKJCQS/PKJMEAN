import { RouteService } from '../../route.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import { } from 'googlemaps';
import {ActivatedRoute, Router} from '@angular/router';
import {PickupService} from '../../../pickup/pickup.service';

import {Title} from '@angular/platform-browser';
declare var $: any;


@Component({
    selector: 'app-add-route',
    templateUrl: './add-route.component.html',
    styleUrls: ['./add-route.component.css']
})
export class AddRouteComponent implements OnInit, AfterViewInit {
    public rout: any;
    public routeId: string;
    private options: any;
    private pickups: Array<any> = [];
    private timepicker = [];
    private newAttribute: any = {pickup1: '' , time: '08:00 AM'};
    constructor( private routeService: RouteService,
                 private route: Router,
                 private pickupService: PickupService,
                 private titleService: Title,
                 private route1: ActivatedRoute) {
        this.rout = [];
        this.titleService.setTitle( 'Add Route' );
        const routeId = this.route1.params.subscribe(params => {
            this.routeId =  params['id']; // (+) converts string 'id' to a number
        });
        // this.myControl = new FormControl();
        // params( 'id' );
        if ( this.routeId ) {
            this.titleService.setTitle( 'Add Route' );
            this.routeService.getRoute( this.routeId).subscribe(response => {
                this.rout = response;
                this.pickups = response['pickups'];
            });
        }
        this.pickupService.getAllPickupsWithFilter('').subscribe(response => {
            this.options = response;
        });
    }
    addRow() {
        var p =  this.pickups;
        // console.log(this.pickups);
        p.push(this.newAttribute);
        // console.log(this.pickups);
        this.pickups = p;
        this.newAttribute = {pickup1: '' , time: '08:00 AM'};
    }
    loadDatepicker(ith) {
        if (this.timepicker.indexOf(ith) === -1) {
            this.timepicker.push(ith);
            $('.timepicker' + ith).datetimepicker({
                pickDate: false,
                pickTime: true,
                format: 'hh:mm A'
            });
        }
    }
    deleteRow(index) {
        this.timepicker.splice(index, 1);
        this.pickups.splice(index, 1);
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

    public saveRoute(event) {
        if ($('#form_validation').valid()) {
            this.rout['pickups'] = this.pickups;
            this.routeService.save(this.rout).subscribe(response => {
                this.rout = response;
                this.route.navigate(['cpanel/master/route/view-all']);
            });
        }
        // this.cookieService.put('putting', 'putty');
    }
}
