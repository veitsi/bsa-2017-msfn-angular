import { Component, OnInit, HostListener } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { GoalProgressService } from '../../services/goal-progress.service';
import { WeightControlService } from '../weight-control/weight-control.service';
import { DateService } from '../../../services/date.service';
import { IUser } from '../../../models/user';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [
        DashboardService,
        WeightControlService,
        GoalProgressService,
        DateService
    ]
})
export class DashboardComponent implements OnInit {

    constructor(private dashboardService: DashboardService,
                private weightControlService: WeightControlService,
                private goalProgressService: GoalProgressService,
                private dateService: DateService) { }

    public innerWidth: any;
    dragOptions = {
        animation: 500,
        handle: '.drag-handle',
        disabled: (this.innerWidth < 440)
    };

    goalItems = [];
    weightItems = [];
    user: IUser;

    ngOnInit() {
        this.getGoalItems();
        this.getWeightItems();
        this.getUser();
        this.innerWidth = window.innerWidth;
    }
    @HostListener('window:resize', ['$event'])

    onResize(event) {
        this.innerWidth = window.innerWidth;
    }

    getGoalItems(): void {
        this.dashboardService.getGoalData(res => {
            if (res[0].hasOwnProperty('value')) {
                this.goalItems = res;
            } else {
                this.goalItems = [];
            }
        });
    }

    getWeightItems(): void {
        this.weightControlService.getWeightItems(res => {
            if (res[0].hasOwnProperty('weight')) {
                this.weightItems = res;
            } else {
                this.weightItems = [];
            }
        });
    }

    getUser(): void {
        this.dashboardService.getUser(res => {
            this.user = res;
        });
    }
}
