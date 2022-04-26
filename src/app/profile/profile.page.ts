import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import Training from '../models/training.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user : any = this.dbService.loadUserLocally();
  enrolledTrainings : Training[];
  trainings : Training[];
  selectedCategory : string = null;

  constructor(private dbService : DatabaseService) {
    
    this.dbService.getEnrolledTrainings(this.user.id).valueChanges().subscribe(res => {
      this.enrolledTrainings = res;
      this.dbService.getTrainings().valueChanges().subscribe(res => this.trainings = res);
    })
  }

  ngOnInit() {
  }

  filterCategories(training : Training) : boolean {
    if (this.selectedCategory == null) return true
    else return this.selectedCategory==training.category?true:false;
  }

  selectCategory(event : Event,category : string) : void {
      if(category==this.selectedCategory) this.selectedCategory = null;
      else{
        this.selectedCategory = category;
      }
      
  }

  enrollTraining(training : Training) : void{
      this.dbService.enrollTraining(this.user.id, training);
  }

  isEnrolled(training : Training) : boolean{
    return this.enrolledTrainings.find(t => t.id == training.id)==null?false:true
  }

  calculateLeft(trainingDate : string) : string {
    let [day, month, year] = trainingDate.split("/").map(e => Number(e));
    let date = new Date(year, month, day);
    let currentDate = new Date();
    let diff = (date.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
    return diff.toFixed(0);
  }
}
