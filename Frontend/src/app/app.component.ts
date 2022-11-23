import { Component } from '@angular/core';
import { CognitoService } from './cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //title = 'Frontend';  
  currentUser: string | undefined;
  constructor(private cognitoService: CognitoService) {
    this.currentUser = undefined;
    this.userData();
  }

  async userData() {
      this.cognitoService.getCurrentUser()
        .then((userInfo) => {
          this.currentUser = userInfo.username;
        });
  }

  signOut() {
    this.cognitoService.signOut()
    .then((user: any) => {
      console.log(user);
    });
  }
}
