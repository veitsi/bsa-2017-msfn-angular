import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { IHttpReq } from '../../../models/http-req';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';

@Injectable()
export class ArticleAddService {

    constructor(private httpService: HttpService) {
    }

    send(exerciseForm, id, callback) {
        const request: IHttpReq = {
            url: '/api/articles/',
            method: 'POST',
            body: exerciseForm,
            successMessage: 'Added'
        };
        if (id) {
            request.method = 'PUT';
            request.url += id;
            request.successMessage = 'Updated';
        }
        this.httpService.sendRequest(request)
            .then(data => {
                callback(null, data);
            });
    }

    getById(id, callback) {
        const request: IHttpReq = {
            url: '/api/articles/' + id,
            method: 'GET',
            body: {}
        };

        this.httpService.sendRequest(request)
            .then(data => {
                callback(null, data);
            });
    }

    saveImg(image, fileName, fileType, folder, callback) {
        const sendData: IHttpReq = {
            url: '/api/file',
            method: 'POST',
            body: { data: image, fileName: fileName, fileType: fileType, folder: folder },
        };

        this.httpService.sendRequest(sendData).then(data => {
            callback(data);
        });
    }

    getCropperSettings(): CropperSettings {
        const cropperSettings = new CropperSettings();
        cropperSettings.noFileInput = true;
        cropperSettings.width = 225;
        cropperSettings.height = 150;
        cropperSettings.croppedWidth = 300;
        cropperSettings.croppedHeight = 200;
        cropperSettings.canvasWidth = 225;
        cropperSettings.canvasHeight = 175;
        cropperSettings.dynamicSizing = true;
        cropperSettings.preserveSize = true;
        cropperSettings.touchRadius = 10;
        return cropperSettings;
    }
}
