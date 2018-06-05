import { StudentService } from '../../student.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import { } from 'googlemaps';
import {ActivatedRoute, Router} from '@angular/router';
import {SchoolService} from '../../../school/school.service';
import {Title} from '@angular/platform-browser';
import {ParentService} from '../../../parent/parent.service';
import {PickupService} from '../../../pickup/pickup.service';
import {IdcardService} from '../../../idcard/idcard.service';
import {ZoneService} from '../../../zone/zone.service';
declare var $: any;

@Component({
    selector: 'app-add-student',
    templateUrl: './add-student.component.html',
    styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit, AfterViewInit {
    public student: any;
    public parents: any;
    public pickups: any;
    public studentId: string;
    public options: any;
    public zoneTypes: any;
    public access: any = [];
    public idcards: any;
    public classrooms: any;
    color = 'primary';
    public genders = [
            {'key': 'M' , 'name': 'Male'},
            {'key': 'F', 'name': 'Female'}
        ];
    constructor( private studentService: StudentService,
                 private route: Router,
                 private schoolService: SchoolService,
                 private zoneService: ZoneService,
                 private parentService: ParentService,
                 private pickupService: PickupService,
                 private idcardService: IdcardService,
                 private route1: ActivatedRoute, private titleService: Title ) {
        this.titleService.setTitle( 'Add Student' );
        this.student = {};
        const studentId = this.route1.params.subscribe(params => {
            this.studentId =  params['id']; // (+) converts string 'id' to a number
            if ( this.studentId ) {
                this.titleService.setTitle('Edit Student');
                this.studentService.getStudent( this.studentId).subscribe(response => {
                    this.student = response;
                    this.access = response['access'];
                });
            }
        });
        this.schoolService.getAllSchoolsWithFilter('').subscribe(response => {
            this.options = response;
        });
        this.zoneService.getAllClassroom('').subscribe(response => {
            this.classrooms = response;
        });
        this.parentService.getAllParentsWithFilter('').subscribe(response => {
            this.parents = response;
        });
        this.pickupService.getAllPickupsWithFilter('').subscribe(response => {
            this.pickups = response;
        });
        this.idcardService.getAllIdCardsWithFilter('').subscribe(response => {
            this.idcards = response;
        });
        this.zoneService.getAllZoneByTye().subscribe(response => {
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
    public setAttr(event: any, z: any, zones: any) {
        console.log(event, z, zones);
        let index: number = this.access.indexOf(z);
        console.log(index);
        if (event.target.checked) {
            if (index === -1) {
                this.access.push(z);
                if (zones !== '') {
                    for (let i in zones) {
                        //console.log(this);
                        let index1: number = this.access.indexOf(zones[i]._id);
                        if (index1 === -1) {
                            this.access.push(zones[i]._id);
                        }
                    }
                }
            }
        } else {
            if (index >= 0) {
                this.access.splice(index, 1);
                if (zones !== '') {
                    for (let i in zones) {
                        let index1: number = this.access.indexOf(zones[i]._id);
                        if (index1 >= 0) {
                            this.access.splice(index1, 1);
                        }
                    }
                }
            }
        }
        // console.log(this.access);
    }

    public saveStudent(event) {
        // console.log(this.student, this.access);
        this.student['access'] = this.access;
        if ($('#form_validation').valid()) {
            this.studentService.save(this.student).subscribe(response => {
                this.student = response;
                this.route.navigate(['cpanel/master/student/view-all']);
            });
        }
        // this.cookieService.put('putting', 'putty');
    }
}
