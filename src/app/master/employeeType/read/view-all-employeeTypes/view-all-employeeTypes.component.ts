import { Component, OnInit, AfterViewInit } from '@angular/core';
import {EmployeeTypeService} from '../../employeeType.service';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';
declare var $: any;

@Component({
    selector: 'app-view-all-employeetypes',
    templateUrl: './view-all-employeeTypes.component.html',
    styleUrls: ['./view-all-employeeTypes.component.css']
})
export class ViewAllEmployeeTypesComponent implements OnInit, AfterViewInit {
    public employeeTypes: any;
    public pages: number;
    public pageIndex = 0;
    public pageSize = 5;
    public pageSizeOptions = [5, 10, 25, 100];
    public columns = [
        { key: 'sn', title: 'S. No.', isSortable: false },
        { key: 'name', title: 'Name', isSortable: true},
        { key: 'isActive', title: 'IsActive', isSortable: true},
        { key: 'action', title: 'Action', isSortable: false}
    ];
    color = 'primary';
    public query = {
        sortBy: 'name',
        isSortAscending: 1
    };
    constructor(private employeeTypeService: EmployeeTypeService, private route: Router) {
        this.employeeTypeService.getEmployeeTypes(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.employeeTypes = response['data'];
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
        this.employeeTypeService.getEmployeeTypes(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.employeeTypes = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
    public changeStatus(event: any, employeeType: any) {
        employeeType['isActive'] =  event.checked;
        this.employeeTypeService.save(employeeType).subscribe(response1 => {
            if (response1) {
                this.employeeTypeService.getEmployeeTypes(this.pageIndex, this.pageSize, this.query).subscribe(response => {
                    this.employeeTypes = response['data'];
                    this.pages = Math.ceil(response['total'] / this.pageSize);
                });
            }
        });
    }
    public SortBy(sortKey: string) {
        this.query.sortBy = sortKey;
        this.query.isSortAscending = this.query.isSortAscending === -1 ? 1 : -1;
        this.employeeTypeService.getEmployeeTypes(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.employeeTypes = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
    public deleteEmployeeType(id: string) {
        if (confirm('Are you sure!')) {
            this.employeeTypeService.delete( id).subscribe(response => {
                this.employeeTypes = response['data'];
                this.pages = Math.ceil(response['total'] / this.pageSize);
                this.route.navigate(['cpanel/master/employeeType/view-all']);
            });
        }
    }
}
