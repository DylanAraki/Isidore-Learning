import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService, User } from '../cognito.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: User;
  isConfirm: boolean = false;
  alertMessage: string = "";
  showAlert: boolean = false;

  constructor(private router:Router, private cognitoService: CognitoService) { 
    this.user = {} as User;
    this.user.showPassword = false;
  }

  ngOnInit(): void {
    
  }

  public signUpWithCognito() {
    if(this.user && this.user.email && this.user.password && this.user.username) {
      this.cognitoService.signUp(this.user)
      .then(() => {
        this.isConfirm = true;
      })
      .catch((error:any) => {
        this.displayAlert(error.message);
      })
    }
    else {
      this.displayAlert("Missing email, password, or username");
    }
  }

  public confirmSignup() {
    if(this.user) {
      this.cognitoService.confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/'])
      })
    }
    else {
      this.displayAlert("Missing email, password, or username");
    }
  }


  private displayAlert(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
  }

}
