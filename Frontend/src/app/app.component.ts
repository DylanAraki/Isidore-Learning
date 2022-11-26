import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { ContentService } from './content.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: any;

  constructor(private authenticator: AuthenticationService, private contentManager: ContentService, private router: Router) {
    //Determine which user (if any) is currently logged in
    authenticator.getCurrentUser()
    .then((user) => {
      this.currentUser = user;
    });
  }


  protected createMap() {
    if(this.currentUser !== null) {
      //Send a create request to the server
      this.contentManager.createMap("dummy") //TODO: Get real string
      .subscribe((data) => {
        //Redirect route to edit 
        this.router.navigate(['edit/' + data["id"]]); 
      });
    }
    //If the user is not signed in, redirect him (only users can create content)
    else {
      this.router.navigate(['sign-in']);
    }
  }
}
