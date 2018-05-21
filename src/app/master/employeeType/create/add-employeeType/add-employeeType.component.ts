///<reference path="../../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { EmployeeTypeService } from '../../employeeType.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import { } from 'googlemaps';

import {ActivatedRoute, Router} from '@angular/router';
import {SchoolService} from '../../../school/school.service';
declare var $: any;


@Component({
    selector: 'app-add-employeetype',
    templateUrl: './add-employeeType.component.html',
    styleUrls: ['./add-employeeType.component.css']
})
export class AddEmployeeTypeComponent implements OnInit, AfterViewInit {
    public employeeType: any;
    public employeeTypeId: string;
    private options: any;
    constructor( private employeeTypeService: EmployeeTypeService,
                 private route: Router,
                 private schoolService: SchoolService,
                 private route1: ActivatedRoute) {
        this.employeeType = [];
        const employeeTypeId = this.route1.params.subscribe(params => {
            this.employeeTypeId =  params['id']; // (+) converts string 'id' to a number
        });
        if ( this.employeeTypeId ) {
            this.employeeTypeService.getEmployeeType( this.employeeTypeId).subscribe(response => {
                this.employeeType = response;
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

    public saveEmployeeType(event) {
        if ($('#form_validation').valid()) {
            this.employeeTypeService.save(this.employeeType).subscribe(response => {
                this.employeeType = response;
                this.route.navigate(['cpanel/master/employeeType/view-all']);
            });
        }
    }
}
