import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Amplify, Auth } from 'aws-amplify';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUser: any;


  checkUsernameTaken(username: string): boolean { return true; }
  checkEmailTaken(email: string): boolean { return true; }  
  checkVerificationCode(code: number): boolean { return true; }
  signUp(signUpForm: FormGroup): Observable<string> { return new Observable() }
  /* constructor() { 
    Amplify.configure({
      Auth: environment.cognito
    });

    Auth.currentUserInfo()
    .then((user) => {
      this.currentUser = user; //can be null
    })
    .catch(() => {
      this.currentUser = null;
    })
  }

  //USER INFO TODO: Check if change?
  //public getCurrentUser(): Promise<any> {
  public getCurrentUser(): any {
    return this.currentUser;
    //return Auth.currentUserInfo()
  }
  public getCurrentUserSession(): Promise<any> {
    return Auth.currentSession();
  }

  //SIGN IN
  public signInWithUsername(username: string, password: string): Promise<any> {
    return Auth.signIn(username, password);
  }
  public signInWithEmail(email: string, password: string): Promise<any> {
    return Auth.signIn(email, password);
  }

  //SIGN OUT
  public signOut() {
    return Auth.signOut();
  }

  //SIGN UP
  public signUp(username: string, email: string, password: string): Promise<any> {
    return Auth.signUp({
      username: username,                 //Will need something better at some point. Note that unverified accounts should be deleted after 10 minutes or so.
      password: password,
      attributes: {
        //preferred_username: username,
        email: email
      }
    }); 
  }
  public confirmSignUp(uuid: string, verificationCode: string): Promise<any> {
    return Auth.confirmSignUp(uuid, verificationCode);
  }

  //FORGOT PASSWORD
  public forgotPassword(uuid: string): Promise<any> {
    return Auth.forgotPassword(uuid);
  }
  public updatePassword(uuid: string, verificationCode: string, newPassword: string): Promise<any> {
    return Auth.forgotPasswordSubmit(uuid, verificationCode, newPassword)
  } */

  


  //TODO: Add update and delete functionality.
}
