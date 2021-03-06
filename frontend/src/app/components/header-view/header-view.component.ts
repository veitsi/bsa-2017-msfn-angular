import { LogoutDialogComponent } from './../logout-dialog/logout-dialog.component';
import {Component, OnInit, AfterContentChecked, Input, Output, EventEmitter} from '@angular/core';
import {MdDialog} from '@angular/material';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { IHttpReq } from '../../models/http-req';
import { WindowObj } from '../../services/window.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
    selector: 'app-header-view',
    templateUrl: './header-view.component.html',
    styleUrls: ['./header-view.component.scss']
})
export class HeaderViewComponent implements OnInit, AfterContentChecked  {
    @Input() chats: any;
    @Output() toggleringChat = new EventEmitter;
    public userId: string;
    public thereIsLoggedInUser: boolean;
    public displayName: string;
    public notificationCount = 1;
    private notificationsDialogConfig = {
        'min-width': '200px',
        data: 'you have ' + this.notificationCount + ' notifications',
        position: {
            top: '45px',
        }
    };
    public userPhotoUrl = (this.window.data._injectedData as any).userPhoto || './resources/default.png';

    constructor(public dialog: MdDialog,
                private httpHandler: HttpService,
                private router: Router,
                public window: WindowObj) {
    }

    ngOnInit() {
        const userData = this.window.data._injectedData;
        this.thereIsLoggedInUser = userData.isLoggedIn;
    }

    ngAfterContentChecked() {
        this.userPhotoUrl = (this.window.data._injectedData as any).userPhoto || './resources/default.png';
        this.displayName = `${this.window.data._injectedData.userFirstName} ${this.window.data._injectedData.userLastName}`;
        this.userId = this.window.data._injectedData.userId;
    }

    logout() {
        this.dialog.open(LogoutDialogComponent, {});
    }

}
