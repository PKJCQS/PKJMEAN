import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
@Injectable()
export class ZoneService {
    constructor(private http: HttpClient, private authService: AuthService, private route: Router) {
    }
    public getZones(p: number, ps: number, sort: any) {
        return this.http.get('/api/zones.json/' + p + '/' + ps + '/' + sort.sortBy + '/' + sort.isSortAscending, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllIdCardsWithFilter(str: any) {
        const obj = this;
        return this.http.get('/api/zones/autocomplete.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllZonesNotInClassrrom(str: any) {
        return this.http.get('/api/zones/autocomplete-not-in-teacher-student.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getZone(id: string) {
        const obj = this;
        return this.http.get('/api/zones/view.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public delete(id: string) {
        const obj = this;
        return this.http.get('/api/zones/delete.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public save(data: any) {
        // console.log(data);
        const obj = this;
        let url = '/api/zones/add.json';
        let param = {};
        if (data['_id']) {
            url = '/api/zones/update.json';
            param = {
                responseType: 'json',
                zone: {
                    _id: data['_id'],
                    mac: data['mac'],
                    uuid: data['uuid'],
                    school: data['school'],
                    password: data['password'],
                    isActive: data['isActive'],
                    major: data['major'],
                    minor: data['minor'],
                    modifiedOn: new Date(),
                    modifiedBy: this.authService.loggedId
                }
            };
        } else {
            param = {
                responseType: 'json',
                zone: {
                    mac: data['mac'],
                    school: data['school'],
                    uuid: data['uuid'],
                    major: data['major'],
                    password: data['password'],
                    isActive: data['isActive'],
                    minor: data['minor'],
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
