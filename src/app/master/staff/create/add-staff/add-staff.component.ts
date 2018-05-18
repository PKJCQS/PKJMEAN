import { StaffService } from '../../staff.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import { } from 'googlemaps';
import {ActivatedRoute, Router} from '@angular/router';
import {SchoolService} from '../../../school/school.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
declare var $: any;


@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit, AfterViewInit {
    public staff: any;
    public staffId: string;
    private options: any;
    public color = 'primary';
    public form: FormGroup;
    constructor( private staffService: StaffService,
                 private route: Router,
                 private schoolService: SchoolService,
                 private formBuilder: FormBuilder,
                 private route1: ActivatedRoute) {
      this.staff = [];
      const staffId = this.route1.params.subscribe(params => {
          this.staffId =  params['id']; // (+) converts string 'id' to a number
      });
      if ( this.staffId ) {
          this.staffService.getStaff( this.staffId).subscribe(response => {
              this.staff = response;
          });
      }
        this.schoolService.getAllSchoolsWithFilter('').subscribe(response => {
            this.options = response;
        });
  }
  ngOnInit() {
      this.form = this.formBuilder.group({
          school: [null, [Validators.required]]
      });

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
  public saveStaff(event: boolean) {
      if ($('#form_validation').valid() && event) {
          this.staffService.save(this.staff).subscribe(response => {
              this.staff = response;
              this.route.navigate(['cpanel/master/staff/view-all']);
          });
      }
   }
}
