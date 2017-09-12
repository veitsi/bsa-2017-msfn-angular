import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { SettingsService } from './metrics.service';
import { ToasterService } from '../../../../services/toastr.service';

@Component({
    selector: 'app-metrics',
    templateUrl: './metrics.component.html',
    styleUrls: ['./metrics.component.scss'],
    providers: [SettingsService]
})
export class MetricsComponent implements OnInit {
    timeZone;
    settings;
    unitTypeData = [
        { category: 'metric', name: 'Metric units' },
        { category: 'imperial', name: 'Imperial units' },
        { category: 'default', name: 'mix units' }
    ];
    userSettingsDefault = {
        weight: 'kg',
        trainingWeight: 'kg',
        distance: 'm',
        temperature: '°C',
        timeFormat: '24-hour clock',
        dateFormat: 'European (day.month.year)',
        startWeek: 'Monday',
        timeZone: '+2'
    };
    userSettings;

    constructor(
        private settingsService: SettingsService,
        private toasterService: ToasterService) {
    }

    ngOnInit() {
        this.timeZone = this.settingsService.getTimeZone();
        this.settingsService.getMeasurements((res) => {
            this.settings = this.settingsService.convertSettings(res);
        });

        this.settingsService.getUserSettings((data) => {
            if (!data.settings) {
                this.userSettings = this.userSettingsDefault;
            } else {
                this.userSettings = data.settings;
            }
            this.userSettings.unitType = 'default';
            this.checkUnitFormat();
        });

    }

    saveSettings() {
        delete this.userSettings.unitType;
        this.settingsService.saveSettings({ 'settings': this.userSettings }, (res) => {
            this.toasterService.showMessage('success', null);
        });
    }

    setUnitFormat() {
        this.userSettings = this.settingsService.setUnitFormat(this.userSettings, this.settings);
    }

    checkUnitFormat() {
        this.userSettings.unitType = this.settingsService.checkUnitFormat(this.userSettings, this.settings);
    }
}
