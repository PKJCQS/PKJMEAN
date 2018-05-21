import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
@Injectable()
export class EmployeeService {
    constructor(private http: HttpClient, private authService: AuthService, private route: Router) {
    }
    public getEmployees(p: number, ps: number, sort: any) {
        return this.http.get('/api/employees.json/' + p + '/' + ps + '/' + sort.sortBy + '/' + sort.isSortAscending, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllIdCardsWithFilter(str: any) {
        const obj = this;
        return this.http.get('/api/employees/autocomplete.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllEmployeesNotInClassrrom(str: any) {
        return this.http.get('/api/employees/autocomplete-not-in-teacher-student.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getEmployee(id: string) {
        const obj = this;
        return this.http.get('/api/employees/view.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public delete(id: string) {
        const obj = this;
        return this.http.get('/api/employees/delete.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public save(data: any) {
        // console.log(data);
        const obj = this;
        let url = '/api/employees/add.json';
        let param = {};
        if (data['_id']) {
            url = '/api/employees/update.json';
            param = {
                responseType: 'json',
                employee: {
                    _id: data['_id'],
                    name: data['name'],
                    employeeType: data['employeeType'],
                    school: data['school'],
                    gateway: data['gateway'],
                    isActive: data['isActive'],
                    modifiedOn: new Date(),
                    modifiedBy: this.authService.loggedId
                }
            };
        } else {
            param = {
                responseType: 'json',
                employee: {
                    name: data['name'],
                    employeeType: data['employeeType'],
                    school: data['school'],
                    gateway: data['gateway'],
                    isActive: data['isActive'],
                    createdOn: new Date(),
                    createdBy: this.authService.loggedId
                }
            };
        }
        return this.http.post(url, param).pipe(
            map(res =>  res)
        );
    }
}
