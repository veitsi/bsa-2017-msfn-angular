import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-header-view',
  templateUrl: './header-view.component.html',
  styleUrls: ['./header-view.component.scss']
})
export class HeaderViewComponent implements OnInit {

  private thereIsLoggedInUser = false;
  private dialogConfig = {
      height: '300px',
      width: '200px',
      data: 'you have N notifications',
      position: {
        top: '45px',
      }
  };

  constructor(public dialog: MdDialog, private loginService: LoginService) { }

  ngOnInit() {
    // this.thereIsLoggedInUser = true;

    this.loginService.userStateUpdate.subscribe((value) => {
      console.log('ggg');
      this.thereIsLoggedInUser = value;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(NotificationDialogComponent, this.dialogConfig);
  }

}
