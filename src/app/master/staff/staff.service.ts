import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
@Injectable()
export class StaffService {
    constructor(private http: HttpClient, private authService: AuthService, private route: Router) {
    }
    public getStaffs(p: number, ps: number, sort: any) {
        return this.http.get('/api/staffs.json/' + p + '/' + ps + '/' + sort.sortBy + '/' + sort.isSortAscending, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllIdCardsWithFilter(str: any) {
        const obj = this;
        return this.http.get('/api/staffs/autocomplete.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllStaffsNotInClassrrom(str: any) {
        return this.http.get('/api/staffs/autocomplete-not-in-teacher-student.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getStaff(id: string) {
        const obj = this;
        return this.http.get('/api/staffs/view.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public delete(id: string) {
        const obj = this;
        return this.http.get('/api/staffs/delete.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public save(data: any) {
        // console.log(data);
        const obj = this;
        let url = '/api/staffs/add.json';
        let param = {};
        if (data['_id']) {
            url = '/api/staffs/update.json';
            param = {
                responseType: 'json',
                staff: {
                    _id: data['_id'],
                    fname: data['fname'],
                    lname: data['lname'],
                    school: data['school'],
                    password: data['password'],
                    isActive: data['isActive'],
                    phone: data['phone'],
                    email: data['email'],
                    modifiedOn: new Date(),
                    modifiedBy: this.authService.loggedId
                }
            };
        } else {
            param = {
                responseType: 'json',
                staff: {
                    fname: data['fname'],
                    lname: data['lname'],
                    school: data['school'],
                    password: data['password'],
                    isActive: data['isActive'],
                    phone: data['phone'],
                    email: data['email'],
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
