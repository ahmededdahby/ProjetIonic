import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import User from '../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  email : string = null;
  password : string = null;
  loading : boolean = false;
  toggleForm : string = "login";

  user : User = new User();
  signPasswordCheck : string;
  

  constructor(private dbService : DatabaseService, private route : Router) {}

  formLogin() : void {
    this.loading = true;
    this.dbService.SignInUser(this.email, this.password).then(res => {
      console.log(res);
      this.loading = false;
      this.route.navigate(["/profile"])
    }).catch(err => {
      this.toggleLoginError();
      this.loading = false;
    });

  }

  formSignUp() : void {
    this.loading = true;
    this.dbService.createUser(this.user).then(res =>{
      this.loading = false;
      this.route.navigate(['/profile']);
    }).catch(err => {
      console.log(err)
      this.loading = false;
    });

  }



  toggleLoginError() : void {
    let div = document.querySelector("#login-error") as HTMLElement;
    div.style.opacity = "1";
    setTimeout(()=>{
      div.style.opacity = "0";
    }, 2000);
  }

  toggleFormHandler(selector : HTMLElement, loginBtn : HTMLElement, signupBtn : HTMLElement) : void {
    loginBtn.classList.toggle("selected");
    signupBtn.classList.toggle("selected");
    if (this.toggleForm == "login"){
      selector.style.transform = 'translateX(96%)';
      this.toggleForm = "signup"
    }else {
      selector.style.transform = 'translateX(0)';
      this.toggleForm = "login"
    }
  }

}
