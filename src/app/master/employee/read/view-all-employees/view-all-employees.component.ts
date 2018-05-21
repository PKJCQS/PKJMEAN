///<reference path="../../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {EmployeeService} from '../../employee.service';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';
declare var $: any;

@Component({
    selector: 'app-view-all-employees',
    templateUrl: './view-all-employees.component.html',
    styleUrls: ['./view-all-employees.component.css']
})
export class ViewAllEmployeesComponent implements OnInit, AfterViewInit {
    public employees: any;
    public pages: number;
    public pageIndex = 0;
    public pageSize = 5;
    public pageSizeOptions = [5, 10, 25, 100];
    public columns = [
        { key: 'sn', title: 'S. No.', isSortable: false },
        { key: 'name', title: 'Name', isSortable: true},
        { key: 'employeeType', title: 'Employ Type', isSortable: true},
        { key: 'school', title: 'School', isSortable: true},
        { key: 'gateway', title: 'Gateway', isSortable: true},
        { key: 'isActive', title: 'IsActive', isSortable: true},
        { key: 'action', title: 'Action', isSortable: false}
    ];
    color = 'primary';
    public query = {
        sortBy: 'name',
        isSortAscending: 1
    };
    constructor(private employeeService: EmployeeService, private route: Router) {
        this.employeeService.getEmployees(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.employees = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }

    ngOnInit() {
    }
    ngAfterViewInit() {
        /*$('.js-exportable').DataTable({
            dom: 'Bfrtip',
            responsive: true,
            buttons: [
                'pdf'
            ]
        });*/
    }
    public setPageData(event: PageEvent) {
        console.log( event );
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.employeeService.getEmployees(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.employees = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
    public changeStatus(event: any, employee: any) {
        employee['isActive'] =  event.checked;
        this.employeeService.save(employee).subscribe(response1 => {
            if (response1) {
                this.employeeService.getEmployees(this.pageIndex, this.pageSize, this.query).subscribe(response => {
                    this.employees = response['data'];
                    this.pages = Math.ceil(response['total'] / this.pageSize);
                });
            }
        });
    }
    public SortBy(sortKey: string) {
        this.query.sortBy = sortKey;
        this.query.isSortAscending = this.query.isSortAscending === -1 ? 1 : -1;
        this.employeeService.getEmployees(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.employees = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
    public deleteEmployee(id: string) {
        if (confirm('Are you sure!')) {
            this.employeeService.delete( id).subscribe(response => {
                this.employees = response['data'];
                this.pages = Math.ceil(response['total'] / this.pageSize);
                this.route.navigate(['cpanel/master/employee/view-all']);
            });
        }
    }
}
