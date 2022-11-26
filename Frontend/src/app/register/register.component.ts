import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { UserInput } from '../user-input';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  protected userInput: UserInput;
  protected verification: boolean;
  protected verificationCode: string;

  constructor(private authenticator: AuthenticationService) {
    this.userInput = new UserInput("", "", "", false);
    this.verification = false;
    this.verificationCode = "";
  }

  ngOnInit(): void {
  }

  protected register() {
    this.authenticator.signUp(this.userInput.username, this.userInput.email, this.userInput.password)
    .then((response) => {
      if(response != null) {
        this.verification = true;
      }
    });
  }
  protected submitVerification() {
    this.authenticator.confirmSignUp(this.userInput.username, this.verificationCode); //TODO: Add a redirect route
  }

}
