import { TimetableService } from '../timetable.service';
import {Component, OnInit, AfterViewInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TeacherService} from '../../teacher/teacher.service';
import {ZoneService} from '../../zone/zone.service';
declare var $: any;


@Component({
  selector: 'app-add-timetable',
  templateUrl: './add-timetable.component.html',
  styleUrls: ['./add-timetable.component.css']
})
export class AddTimetableComponent implements OnInit, AfterViewInit {
    public timetable: any;
    public timetableId: string;
    private timepicker = [];
    private teachers: any;
    constructor( private timetableService: TimetableService,
                 private route: Router,
                 private teacherService: TeacherService,
                 private zoneService: ZoneService,
                 private route1: ActivatedRoute) {
      this.timetable = [];
      const timetableId = this.route1.params.subscribe(params => {
          this.timetableId =  params['id']; // (+) converts string 'id' to a number

          // In a real app: dispatch action to load the details here.
      });
    const classroom = this.route1.params.subscribe(params => {
        this.timetable['classroom'] =  params['classroom']; // (+) converts string 'id' to a number
        if (params['classroom']) {
            this.zoneService.getZone(params['classroom']).subscribe(response => {
                this.timetable['school'] = response['school'];
            });
        }
        // In a real app: dispatch action to load the details here.
    });
    const subject = this.route1.params.subscribe(params => {
        this.timetable['subject'] =  params['subject']; // (+) converts string 'id' to a number

        // In a real app: dispatch action to load the details here.
    });
      // this.myControl = new FormControl();
      // params( 'id' );
      if ( this.timetableId ) {
          this.timetableService.getTimetable( this.timetableId).subscribe(response => {
              this.timetable = response;
          });
      }
        this.teacherService.getAllTeachersWithFilter('').subscribe(response => {
            this.teachers = response;
        });

  }

  ngOnInit() {
  }
  setTime(event, type) {
        this.timetable[type] = event.target.value;
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

  public saveTimetable(event) {
      if ($('#form_validation').valid()) {
          this.timetableService.save(this.timetable).subscribe(response => {
              this.timetable = response;
              this.route.navigate(['cpanel/master/timetable/', this.timetable.classroom ]);
          });
      }
   }
}
