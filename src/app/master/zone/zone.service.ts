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
    public getAllZonesWithFilter(str: any) {
        return this.http.get('/api/zones/autocomplete.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllClassroom(str: any) {
        return this.http.get('/api/zones/classroom.json/' + str, {
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
        return this.http.get('/api/zones/delete.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public save(data: any) {
        let url = '/api/zones/add.json';
        let param = {};
        if (data['_id']) {
            url = '/api/zones/update.json';
            param = {
                responseType: 'json',
                zone: {
                    _id: data['_id'],
                    name: data['name'],
                    zoneType: data['zoneType'],
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
                zone: {
                    name: data['name'],
                    zoneType: data['zoneType'],
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
