import { Component, OnInit, AfterViewInit } from '@angular/core';
import {StaffService} from '../../staff.service';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-view-all-staffs',
  templateUrl: './view-all-staffs.component.html',
  styleUrls: ['./view-all-staffs.component.css']
})
export class ViewAllStaffsComponent implements OnInit, AfterViewInit {
  public staffs: any;
    public pages: number;
    public pageIndex = 0;
    public pageSize = 5;
    public pageSizeOptions = [5, 10, 25, 100];
    public columns = [
        { key: 'sn', title: 'S. No.', isSortable: false },
        { key: 'fname', title: 'Name', isSortable: true},
        { key: 'email', title: 'Email', isSortable: true},
        { key: 'phone', title: 'Phone No.', isSortable: true},
        { key: 'school', title: 'School', isSortable: true},
        { key: 'isActive', title: 'IsActive', isSortable: true},
        { key: 'action', title: 'Action', isSortable: false}
    ];
    color = 'primary';
    public query = {
        sortBy: 'fname',
        isSortAscending: 1
    };
  constructor(private staffService: StaffService, private route: Router) {
    this.staffService.getStaffs(this.pageIndex, this.pageSize, this.query).subscribe(response => {
        this.staffs = response['data'];
        this.pages = Math.ceil(response['total'] / this.pageSize);
    });
  }

  ngOnInit() {
  }
    ngAfterViewInit() {
    }
    public setPageData(event: PageEvent) {
        console.log( event );
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.staffService.getStaffs(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.staffs = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
    public changeStatus(event: any, staff: any) {
        staff['isActive'] =  event.checked;
        this.staffService.save(staff).subscribe(response1 => {
            if (response1) {
                this.staffService.getStaffs(this.pageIndex, this.pageSize, this.query).subscribe(response => {
                    this.staffs = response['data'];
                    this.pages = Math.ceil(response['total'] / this.pageSize);
                });
            }
        });
    }
    public SortBy(sortKey: string) {
        this.query.sortBy = sortKey;
        this.query.isSortAscending = this.query.isSortAscending === -1 ? 1 : -1;
        this.staffService.getStaffs(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.staffs = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
  public deleteStaff(id: string) {
      if (confirm('Are you sure!')) {
          this.staffService.delete( id).subscribe(response => {
              this.staffs = response['data'];
              this.pages = Math.ceil(response['total'] / this.pageSize);
              this.route.navigate(['cpanel/master/staff/view-all']);
          });
      }
  }
}
