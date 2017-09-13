import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodPlanService } from './food-plan.service';
import { WeeklyComponent } from './weekly/weekly.component';
import { DailyComponent } from './daily/daily.component';
import { IFoodPlan } from './../../../models/foodPlan';

@Component({
    selector: 'app-food-plan',
    templateUrl: './food-plan.component.html',
    styleUrls: ['./food-plan.component.scss'],
    providers: [FoodPlanService]
})
export class FoodPlanComponent implements OnInit {

    foodplan = {
        title: '',
        type: '',
        days: [],
        meals: [],
        _id: '',
    };
    @ViewChild(WeeklyComponent)
    private weeklyData: WeeklyComponent;

    @ViewChild(DailyComponent)
    private dailyData: DailyComponent;

    constructor(
        public foodPlanService: FoodPlanService,
        public activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        if (this.activatedRoute.snapshot.params.id) {
            const planID = this.activatedRoute.snapshot.params.id;
            this.foodPlanService.getFoodPlanByID(planID, res => {
                console.log(res);
                this.foodplan = res[0];
            });
        }
    }
    currentType(currentType) {
        this.foodplan.type = currentType;
        if (this.dailyData) {
            this.foodplan.meals = this.dailyData.meals;
        }
        if (this.weeklyData) {
            let daysPlan = this.weeklyData.days;
            this.foodplan.days = daysPlan;
        }
        return true;
    }
    savePlan() {
        console.log(this.weeklyData);
        console.log(this.dailyData);
        if (this.weeklyData) {
            let daysPlan = this.weeklyData.days;
            daysPlan.forEach(day => {
                delete day.editMeal;
                delete day.editMealObj;
                delete day.selected;
            });
            this.foodplan.days = daysPlan;
        } else if (this.dailyData) {
            this.foodplan.meals = this.dailyData.meals;
        }
        console.log(this.foodplan);
        if (!this.foodplan._id.length) {
            this.foodPlanService.save(this.foodplan);
        } else {
            this.foodPlanService.update(this.foodplan);
        }

    }
}
