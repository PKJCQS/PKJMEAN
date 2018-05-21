///<reference path="../../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {EmployeeService } from '../../employee.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import { } from 'googlemaps';

import {ActivatedRoute, Router} from '@angular/router';
import {SchoolService} from '../../../school/school.service';
import {EmployeeTypeService} from '../../../employeeType/employeeType.service';
import {GatewayService} from '../../../gateway/gateway.service';
declare var $: any;
@Component({
    selector: 'app-add-employee',
    templateUrl: './add-employee.component.html',
    styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit, AfterViewInit {
    public employee: any;
    public employeeId: string;
    public color = 'primary';
    public options: any;
    public employeeTypes: any;
    public gateways: any;
    constructor( private employeeService: EmployeeService,
                 private route: Router,
                 private schoolService: SchoolService,
                 private employeeTypeService: EmployeeTypeService,
                 private gatewayService: GatewayService,
                 private route1: ActivatedRoute) {
        this.employee = [];
        const employeeId = this.route1.params.subscribe(params => {
            this.employeeId =  params['id']; // (+) converts string 'id' to a number
        });
        if ( this.employeeId ) {
            this.employeeService.getEmployee( this.employeeId).subscribe(response => {
                this.employee = response;
            });
        }
        this.employeeTypeService.getAllEmployeeTypesWithFilter('').subscribe(response => {
            this.employeeTypes = response;
        });
        this.schoolService.getAllSchoolsWithFilter('').subscribe(response => {
            this.options = response;
        });
        this.gatewayService.getAllGatewaysWithFilter('').subscribe(response => {
            this.gateways = response;
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

    public saveEmployee(event) {
        if ($('#form_validation').valid()) {
            this.employeeService.save(this.employee).subscribe(response => {
                this.employee = response;
                this.route.navigate(['cpanel/master/employee/view-all']);
            });
        }
    }
}
