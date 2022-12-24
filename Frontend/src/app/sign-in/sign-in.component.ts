import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { UserInput } from '../user-input';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  protected userInput: UserInput;

  constructor(private authenticator: AuthenticationService) {
    this.userInput = new UserInput("", "", "", false);
  }
  
  ngOnInit(): void {  
  }

  protected signIn() {
    //this.authenticator.signInWithUsername(this.userInput.username, this.userInput.password);
  }

}
