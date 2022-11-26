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
  currentUser: any; //TODO: Assign the type better

  constructor(private authenticator: AuthenticationService, private contentManager: ContentService, private router: Router) {
    //Determine which user (if any) is currently logged in
    authenticator.getCurrentUser()
    .then((user) => {
      this.currentUser = user; //can be null
    });
  }


  protected createMap() {
    if(this.currentUser !== null) {
      //Send a create request to the server
      this.contentManager.createMap("dummy") //TODO: Get real string
      .subscribe((data) => {
        //Save the map in the service
        this.contentManager.addMapToDictionary(data);
        //Save the main path in the service
        const pathResponse = {
          "id": data["mainPath"], 
          "mapId": data["id"], 
          "landmarks": [
            {
              "id": data["firstLandmark"],
              "previousLandmark": null
            }
          ]
        }
        this.contentManager.addPathToDictionary(pathResponse);
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
