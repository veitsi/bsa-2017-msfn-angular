import { Injectable } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { IHttpReq } from '../../../../models/http-req';
import {CropperSettings} from 'ng2-img-cropper';

@Injectable()
export class ProfileService {


    constructor(private httpService: HttpService) { }

    savePhoto(image, userId, fileType, callback) {
        const sendData: IHttpReq = {
            url: '/api/file',
            method: 'POST',
            body: {data: image, fileName: userId, fileType: fileType, folder: 'usersImg'},
        };

        this.httpService.sendRequest(sendData).then(data => {
            callback(data);
        });
    }

    getUser(id, callback) {
        const request: IHttpReq = {
            url: '/api/user/' + id,
            method: 'GET',
            body: ''
        };
        this.httpService.sendRequest(request).then(res => {
            callback(res);
        });
    }


    updateUser(user, id, callback) {
        const request: IHttpReq = {
            url: '/api/user/' + id,
            method: 'PUT',
            body: user,
            failMessage: 'Failed to change profile',
            successMessage: 'Profile changes accepted'
        };
        this.httpService.sendRequest(request).then(res => {
            callback(res);
        });
    }

    addNewEmail(email, id, callback) {
        const request: IHttpReq = {
            url: '/api/user/secondaryEmail/' + id,
            method: 'PUT',
            body: {
                newSecondaryEmail: email
            },
            failMessage: 'Failed to add email',
            successMessage: 'Secondary email added'
        };
        this.httpService.sendRequest(request).then(res => {
            callback(res);
        });
    }

    coachStatusRequest(id, callback) {
        const request: IHttpReq = {
            url: '/api/user/coach-status-request/' + id,
            method: 'GET',
            body: {}
        };
        this.httpService.sendRequest(request)
            .then(res => {
                callback(res);
        });
    }
    getCropperSettings(): CropperSettings {
        const cropperSettings = new CropperSettings();
        cropperSettings.noFileInput = true;
        cropperSettings.width = 150;
        cropperSettings.height = 150;
        cropperSettings.croppedWidth = 150;
        cropperSettings.croppedHeight = 150;
        cropperSettings.canvasWidth = 400;
        cropperSettings.canvasHeight = 300;
        cropperSettings.rounded = true;
        cropperSettings.dynamicSizing = true;
        cropperSettings.touchRadius = 10;
        return cropperSettings;
    }

    getActivityLevelOptions() {
        return [
            {
                name: 'Sitting/lying all day',
                coef: 1.2
            },
            {
                name: 'Seated work, light exercise',
                coef: 1.375
            },
            {
                name: 'Moderately physical work, no exercise',
                coef: 1.4625
            },
            {
                name: 'Moderately physcial work, light exercise',
                coef: 1.550
            },
            {
                name: 'Moderately physcial work, heavy exercise',
                coef: 1.6375
            },
            {
                name: 'Heavy work / heavy exercise',
                coef: 1.725
            },
            {
                name: 'Above average physical work / exercise',
                coef: 1.9
            }
        ];
    }
}
