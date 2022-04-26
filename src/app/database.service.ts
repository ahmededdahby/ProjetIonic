import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Subject } from 'rxjs';
import Training from './models/training.model';
import User from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  loggedUser : Subject<any> = new Subject();
  userLogEvent$ = this.loggedUser.asObservable();


  constructor(private auth : AngularFireAuth, private db : AngularFireDatabase, private storage : AngularFireStorage) { }

  async SignInUser(email : string, password : string) : Promise<any> {
    let result = null;
    let error = null;
    try{
      result = await this.auth.signInWithEmailAndPassword(email, password);
      let user = await this.auth.currentUser;
      this.db.object("/Users/" + user.uid).valueChanges().subscribe(user => {
        this.saveUserLocally(user as User);
        this.loggedUser.next(user);
      })
    }catch(err){
      error = err;
    }
    return new Promise((res, rej) => {
      if (result != null) res(result);
      else rej(error);
    })
  }

  async createUser(user : User) : Promise<any>{
    let response = null;
    let error = null;
    try{
      response = await this.auth.createUserWithEmailAndPassword(user.email, user.password);
      user.id = response.user.uid;
      this.db.object("/Users/" + user.id).set(user);
      this.saveUserLocally(user as User);
      this.loggedUser.next(user);
    }catch(err){
      error = err;
    }

    return new Promise((res, rej) => {
      if(response != null){
        res(response);
      }else{
        rej(error);
      }
    })
    
  }

  saveUserLocally(user : User) : void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  loadUserLocally() : User {
    return JSON.parse(localStorage.getItem('user'));
  }

  getTrainings() : AngularFireList<any> {
    return this.db.list('/Trainings');
  }

  enrollTraining(userId:string, training: Training){
    this.db.list('/Users/' + userId + '/formations').push(training)
  }

  getEnrolledTrainings(userId:string) : AngularFireList<any> {
    return this.db.list('/Users/' + userId + '/formations');
  }

}
