import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { 
    Amplify.configure({
      Auth: environment.cognito
    });
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
  }

  //USER INFO TODO: Check if change?
  public getCurrentUser(): Promise<any> {
    return Auth.currentUserInfo()
  }
  public getCurrentUserSession(): Promise<any> {
    return Auth.currentSession();
  }


  //TODO: Add update and delete functionality.
}
