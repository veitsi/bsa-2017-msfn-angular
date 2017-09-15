import {Component, OnInit, ViewChild} from '@angular/core';
import {EventService} from '../../services/event.service';
import {IEvent} from '../../../models/event';
import {CropperSettings, ImageCropperComponent} from 'ng2-img-cropper';
import {ToasterService} from '../../../services/toastr.service';
import {FormControl, Validators} from '@angular/forms';
import {WindowObj} from '../../../services/window.service';

declare const google: any;

@Component({
    selector: 'app-event-create',
    templateUrl: './event-create.component.html',
    styleUrls: ['./event-create.component.scss'],
    providers: [EventService]
})
export class EventCreateComponent implements OnInit {

    constructor(private eventService: EventService,
                private toasterService: ToasterService,
                private window: WindowObj) {
    }

    userId = (this.window.data._injectedData as any).userId;
    event: IEvent;

    image = new Image();
    type: string;
    cropperSettings: CropperSettings;
    data: any;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    hideCropper = true;
    oldImg;
    datePickerMinMax = new Date();

    titleInputControl = new FormControl('', [
        Validators.required,
        Validators.maxLength(30)
    ]);

    ngOnInit() {
        this.data = {
            image: this.image
        };
        this.cropperSettings = this.eventService.getCropperSettings();

        this.event = {
            title: '',
            creator: this.userId,
            startDate: new Date(),
            endDate: new Date(),
            location: {
                name: '',
                coords: {
                    lat: null,
                    lng: null
                }
            },
            description: '',
            image: ''
        };

        this.initMap();
    }

    createEvent(): void {
        if (this.data.image) {
            const fileType = 'img';
            const fileName = this.event.title.replace(/ /g, '_') + Date.now();

            this.eventService.saveImage(this.data.image, fileName, fileType, result => {
                if (result.err) {
                    this.event.image = this.oldImg;
                    this.toasterService.showMessage('error', result.err);
                } else {
                    this.event.image = './resources/events/' + fileName + '.' + this.type;

                    this.eventService.createEvent(this.event, data => {
                        console.log(data);
                    });
                }
            });
        } else {
            this.eventService.createEvent(this.event, data => {
                console.log(data);
            });
        }
    }

    initMap(): void {
        let centerCoords = {
            lat: 0,
            lng: 0
        };

        this.eventService.getUserLocation(location => {
            centerCoords = location;

            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: centerCoords
            });

            const marker = new google.maps.Marker({
                position: centerCoords,
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
            });

            map.addListener('click', event => {
                centerCoords = event.latLng.toJSON();
                marker.setPosition(event.latLng);
            });

            map.addListener('mouseout', () => {
                map.setOptions({center: centerCoords});
            });

            marker.addListener('dragend', () => {
                centerCoords = marker.getPosition().toJSON();
                this.event.location.coords = centerCoords;
            });
        });
    }

    fileChangeListener($event): void {
        this.hideCropper = false;
        const file: File = $event.target.files[0];

        if ($event.target.files === 0) {
            return;
        }

        if (file.type.split('/')[0] !== 'image') {
            this.toasterService.showMessage('error', 'wrong format');
            this.hideCropper = true;
            return;
        }
        console.log(file);
        const myReader: FileReader = new FileReader();
        this.type = file.type.split('/')[1];

        myReader.onloadend = (loadEvent: any) => {
            this.image.src = loadEvent.target.result;
            if (this.type === 'gif') {
                this.event.image = this.image.src;
                this.data.image = this.image.src;
                this.hideCropper = true;
            } else {
                this.cropper.setImage(this.image);
            }
        };

        myReader.readAsDataURL(file);
    }

    cropperBtn(action): void {
        if (action === 'save') {
            this.event.image = this.data.image;
        }
        this.hideCropper = true;
    }
}