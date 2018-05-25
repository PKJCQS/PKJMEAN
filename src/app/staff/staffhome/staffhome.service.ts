import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class StaffhomeService {
    private url = 'http://localhost:8080/';
    private socket;
    sendMessage(schoolId: any){
        this.socket.emit('add-message', schoolId);
    }
    public getCurrentException() {
        let observable = new Observable(observer => {
            this.socket = io(this.url);
            this.socket.on('message', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
}
