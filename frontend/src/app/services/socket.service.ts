import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {ToasterService} from './toastr.service';

@Injectable()
export class SocketService {

    private _socket = io.connect('http://localhost:3060');
    private rooms: any[] = [];

    constructor(private toast: ToasterService) {
        this._socket.on('connect', () => {
            this.toast.showMessage('success', 'connected to server');
        });
        this._socket.on('disconnect', () => {
            this.toast.showMessage('error', 'server is DOWN');
        });
    }

    public send(event: string, message: string) {
        this._socket.emit(event, message);
    }

    public addListener(event: string, callback: any) {
        this._socket.on(event, (data) => {
            callback(data);
        });
    }

    public joinRoom(roomName: string) {
        if (this.rooms.indexOf(roomName) !== -1) { return; }
        this.send('join_room', JSON.stringify({'room': roomName}));
        this.rooms.push(roomName);
    }
}
