import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
@Injectable()
export class EmployeeTypeService {
    constructor(private http: HttpClient, private authService: AuthService, private route: Router) {
    }
    public getEmployeeTypes(p: number, ps: number, sort: any) {
        return this.http.get('/api/employeeTypes.json/' + p + '/' + ps + '/' + sort.sortBy + '/' + sort.isSortAscending, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllEmployeeTypesWithFilter(str: any) {
        const obj = this;
        return this.http.get('/api/employeeTypes/autocomplete.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllEmployeeTypesNotInClassrrom(str: any) {
        return this.http.get('/api/employeeTypes/autocomplete-not-in-teacher-student.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getEmployeeType(id: string) {
        const obj = this;
        return this.http.get('/api/employeeTypes/view.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public delete(id: string) {
        const obj = this;
        return this.http.get('/api/employeeTypes/delete.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public save(data: any) {
        // console.log(data);
        const obj = this;
        let url = '/api/employeeTypes/add.json';
        let param = {};
        if (data['_id']) {
            url = '/api/employeeTypes/update.json';
            param = {
                responseType: 'json',
                employeeType: {
                    _id: data['_id'],
                    name: data['name'],
                    isActive: data['isActive'],
                    modifiedOn: new Date(),
                    modifiedBy: this.authService.loggedId
                }
            };
        } else {
            param = {
                responseType: 'json',
                employeeType: {
                    name: data['name'],
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
