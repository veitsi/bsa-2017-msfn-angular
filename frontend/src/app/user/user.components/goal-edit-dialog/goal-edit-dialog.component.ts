import { GoalEditDialogService } from './goal-edit-dialog.service';
import { MD_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-goal-edit-dialog',
  templateUrl: './goal-edit-dialog.component.html',
  styleUrls: ['./goal-edit-dialog.component.scss'],
  providers: [GoalEditDialogService]
})
export class GoalEditDialogComponent implements OnInit {
  minDate: Date;
  types = [];
  goal: any;
  id: string;
  selectedType: string;
  deadline: Date;
  value: number;
  amountFormControl: any;
  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    private goalEditDialogService: GoalEditDialogService
  ) { }

  ngOnInit() {
    this.id = this.data.item._id;
    this.minDate = new Date();

    this.goalEditDialogService.getGoals((response) => {
      this.types = response;
      console.log(this.id);
      if (this.id === '-1') {
        this.deadline = new Date();
        this.deadline.setFullYear(this.deadline.getFullYear() + 1);
        this.selectedType = this.types[0].name;
        this.value = 0;
      } else {
            this.deadline = new Date(this.data.item.deadline);
            this.selectedType = this.data.item.type;
            this.value = this.data.item.value;
      }
    });
  }

  addUserGoal(data) {
    this.goalEditDialogService.addUserGoal(data, (response) => {
    });
  }


  updateUserGoal(data) {
    this.goalEditDialogService.updateUserGoal(data, (response) => {
    });
  }

  addUpdateUserGoal (data) {
    if (this.id === '-1') {
      this.addUserGoal(data);
    } else {
      console.log(this.id);
      this.updateUserGoal(data);
    }
  }

}
