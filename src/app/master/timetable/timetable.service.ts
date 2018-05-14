import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class TimetableService {
    constructor(private http: HttpClient, private authService: AuthService, private route: Router) {
    }
    public getTimetables(p: number, ps: number, sort: any) {
        const obj = this;
        return this.http.get('/api/timetables.json/' + p + '/' + ps + '/' + sort.sortBy + '/' + sort.isSortAscending, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getTimeByClassroom(classroom: any) {
        const obj = this;
        return this.http.get('/api/timetables/getByClassroom.json/' + classroom, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getTimetableByClassSubject(classroom: string, subject: string) {
        const obj = this;
        return this.http.get('/api/timetables/getByClassroomSubject.json/' + classroom + '/' + subject, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllTimetablesWithFilter(str: any) {
        const obj = this;
        return this.http.get('/api/timetables/autocomplete.json/' + str, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public getAllTimetablesWithFilter1(str: any): Observable<any[]> {
        return this.http.get<any>('/api/timetables/autocomplete.json/' + str, {
            responseType: 'json'
        });
    }
    public getTimetable(id: string) {
        const obj = this;
        return this.http.get('/api/timetables/view.json/' + id, {
            responseType: 'json'
        }).pipe(
            map(res =>  res)
        );
    }
    public save(data) {
        const obj = this;
        let url = '/api/timetables/add.json';
        let param = {};
        if (data['_id']) {
            url = '/api/timetables/update.json';
            param = {
                responseType: 'json',
                timetable: {
                    _id: data['_id'],
                    teacher: data['teacher'],
                    school: data['school'],
                    startTime: data['startTime'],
                    endTime: data['endTime'],
                    comment: data['comment'],
                    classroom: data['classroom'],
                    subject: data['subject'],
                    isActive: data['isActive'],
                    modifiedOn: new Date(),
                    modifiedBy: this.authService.loggedId
                }
            };
        } else {
            param = {
                responseType: 'json',
                timetable: {
                    teacher: data['teacher'],
                    school: data['school'],
                    startTime: data['startTime'],
                    endTime: data['endTime'],
                    comment: data['comment'],
                    classroom: data['classroom'],
                    subject: data['subject'],
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
