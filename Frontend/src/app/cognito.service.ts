import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
  username: string;
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<any>;

  constructor() { 
    Amplify.configure({
      Auth: environment.cognito,
    });
    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }
  public signUp(user: User): Promise<any> {
    console.log(user);
    return Auth.signUp({
      username: user.username,
      password: user.password,
      attributes: {
        email: user.email,
      }
    });
  }

  public confirmSignUp(user: User): Promise<any> {
    return Auth.confirmSignUp(user.username, user.code);
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public signInWithUsername(user: User) : Promise<any> {
    return Auth.signIn(user.username, user.password);
  }

  public signInWithEmail(user:User): Promise<any> {
    return Auth.signIn(user.email, user.password);
  }

  public signOut(): Promise<any> {
    return Auth.signOut();
  }
  //TODO: Email option??
  public forgotPassword(user: User) : Promise<any> {
    return Auth.forgotPassword(user.username);
  }

  public forgotPasswordSubmit(user: User, newPassword: string): Promise<any> {
    return Auth.forgotPasswordSubmit(user.username, user.code, newPassword);
  }

  public getCurrentUser(): Promise<any> {
    return Auth.currentUserInfo();
  }
}
