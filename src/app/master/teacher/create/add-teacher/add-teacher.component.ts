import { TeacherService } from '../../teacher.service';
import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '../../../subject/subject.service';
import {SchoolService} from '../../../school/school.service';
import {IdcardService} from '../../../idcard/idcard.service';
import { ZoneService } from '../../../zone/zone.service';
declare var $: any;


@Component({
    selector: 'app-add-teacher',
    templateUrl: './add-teacher.component.html',
    styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent implements OnInit, AfterViewInit {
    public teacher: any;
    public teacherId: string;
    public options: any;
    public schools: any;
    public idCards: any;
    public zoneTypes: any;
    public access: any = [];
    color = 'primary';
    @ViewChild('search')
    public searchElementRef: ElementRef;
    constructor( private teacherService: TeacherService,
                 private route: Router,
                 private route1: ActivatedRoute,
                 private zoneService: ZoneService,
                 private schoolService: SchoolService,
                 private idCardService: IdcardService,
                 private subjectService: SubjectService) {
        this.teacher = [];
        const teacherId = this.route1.params.subscribe(params => {
            this.teacherId =  params['id'];
        });
        if ( this.teacherId ) {
            this.teacherService.getTeacher( this.teacherId).subscribe(response => {
                // console.log(response);
                this.teacher = response['data'];
                this.access = response['data']['access'];
                let subjs = [];
                let i = 0;
                if (response['subjects']) {
                    for (let subj in response['subjects']) {
                        subjs[i] = response['subjects'][subj]['subject'];
                        i++;
                    }
                }
                this.teacher.subjects = subjs;
                // console.log(this.access);
            });
        }
        this.subjectService.getAllSubjectsWithFilter('').subscribe(response => {
            this.options = response;
        });
        this.schoolService.getAllSchoolsWithFilter('').subscribe(response => {
            this.schools = response;
        });
        this.idCardService.getAllIdCardsWithFilter('').subscribe(response => {
            this.idCards = response;
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
    public setAttr(event, z, zones) {
        let index: number = this.access.indexOf(z);
        if (event.target.checked) {
            if (index === -1) {
                this.access.push(z);
                if (zones !== '') {
                    for (let i in zones) {
                        console.log(this);
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
        //console.log(this.access);
    }
    public saveTeacher(event) {
        if ($('#form_validation').valid()) {
            this.teacher['access'] = this.access;
            this.teacherService.save(this.teacher).subscribe(response => {
                this.teacher = response;
                this.route.navigate(['cpanel/master/teacher/view-all']);
            });
        }
        // this.cookieService.put('putting', 'putty');
    }
}
