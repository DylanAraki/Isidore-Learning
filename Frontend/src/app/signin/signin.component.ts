import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService, User } from '../cognito.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  user: User;
  alertMessage: string = "";
  showAlert: boolean = false;
  usernameSignIn: boolean = true;
  
  forgotPassword: boolean = false;
  newPassword: string = "";

  constructor(private cognitoService: CognitoService, private router: Router) { 
    this.user = {} as User;
    this.user.showPassword = false;
  }

  ngOnInit(): void {
  }

  signInWithCognito() {
    if(this.user.username && this.user.password) {
      this.cognitoService.signInWithUsername(this.user)
      .then(() => {
        this.router.navigate(['/'])
      })
      .catch((error: any) => {
        this.displayAlert(error.message);
      })
    }
    else if(this.user.email && this.user.password) {
      this.cognitoService.signInWithEmail(this.user);
    }
  }
  /*
  TODO:
  Change everything with login to signin
  Set up HTML component for signin.

  Test the getUser function from the Cognito service.

  Once that is done, begin the process of making a map in the database with a owner id
  */

  private displayAlert(message:string) {
    this.alertMessage = message;
    this.showAlert = true;
  }

}
