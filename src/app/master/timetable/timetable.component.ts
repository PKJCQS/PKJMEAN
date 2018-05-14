import { Component, OnInit } from '@angular/core';
import {TeacherService} from '../teacher/teacher.service';
import {SubjectService} from '../subject/subject.service';
import {TimetableService} from './timetable.service';
import {PageEvent} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {SchoolService} from '../school/school.service';
import {ClassroomService} from '../classroom/classroom.service';
declare var $: any;

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
    public subjects: any;
    public schools: any;
    public teachers: any;
    public classroomDtl: any;
    public timetable = {};
    public isLoader = false;
    public pages: number;
    public pageIndex = 0;
    public pageSize = 5;
    public pageSizeOptions = [5, 10, 25, 100];
    public columns = [
        { key: 'sn', title: 'S. No.', isSortable: false },
        { key: 'subject', title: 'Name', isSortable: true},
        { key: 'time', title: 'Time', isSortable: false}
    ];
    color = 'primary';
    public query = {
        sortBy: 'name',
        isSortAscending: 1
    };
    public classroom: string;
  constructor(private teacherService: TeacherService,
              private subjectService: SubjectService,
              private timetableService: TimetableService,
              private classroomService: ClassroomService,
              private schoolService: SchoolService,
              private route: Router,
              private route1: ActivatedRoute) {
      const classId = this.route1.params.subscribe(params => {
          this.classroom =  params['class'];
          this.isLoader = true;
          this.classroomService.getClassroom(this.classroom).subscribe(response => {
              this.classroomDtl = response;
          });
          this.subjectService.getSubjectsWithTimetable(this.classroom,
              this.pageIndex, this.pageSize, this.query).subscribe(response2 => {
              this.subjects = response2['data'];
              this.pages = Math.ceil(response2['total'] / this.pageSize);
              this.isLoader = false;
          });
      });
  }

  ngOnInit() {
  }
    public setPageData(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.isLoader = true;
        this.subjectService.getSubjectsWithTimetable(this.classroom,this.pageIndex, this.pageSize, this.query).subscribe(response3 => {
            this.subjects = response3['data'];
            this.pages = Math.ceil(response3['total'] / this.pageSize);
            this.isLoader = false;
        });
    }
    public SortBy(sortKey: string) {
        this.query.sortBy = sortKey;
        this.query.isSortAscending = this.query.isSortAscending === -1 ? 1 : -1;
        this.isLoader = true;
        this.subjectService.getSubjectsWithTimetable(this.classroom, this.pageIndex, this.pageSize, this.query).subscribe(response3 => {
            this.subjects = response3['data'];
            this.pages = Math.ceil(response3['total'] / this.pageSize);
            this.isLoader = false;
        });
    }
}
