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
    
    /*authenticator.getCurrentUser()
      .then((user) => {
        this.currentUser = user; //can be null
      });*/
  }


  protected createMap() {
    //if (this.currentUser !== null) {
    if(this.authenticator.getCurrentUser != null) {
      this.authenticator.getCurrentUserSession()
        .then((userSession) => {
          //Send a create request to the server
          this.contentManager.createMap(userSession.idToken.payload.sub)
            .subscribe((data) => {
              //Save the map in the service
              this.contentManager.addMapToDictionary(data);
              //Save the main path in the service
              const pathResponse = {
                "id": data["mainPath"],
                "mapId": data["id"],
                "isMainPath": true,
                "landmarks": [
                  {
                    "id": data["firstLandmark"],
                    "previousLandmark": null
                  }
                ]
              }
              this.contentManager.addMainPathToDictionary(pathResponse);
              //Redirect route to edit 
              this.router.navigate(['edit/' + data["id"]]);
            })
        })
    }

    /*
    //Send a create request to the server
    console.log(this.currentUser);
    this.authenticator.getCurrentUserSession().then((userSession) => { console.log(userSession) });
    this.contentManager.createMap("dummy") //TODO: Get real string
      .subscribe((data) => {
        //Save the map in the service
        this.contentManager.addMapToDictionary(data);
        //Save the main path in the service
        const pathResponse = {
          "id": data["mainPath"],
          "mapId": data["id"],
          "isMainPath": true,
          "landmarks": [
            {
              "id": data["firstLandmark"],
              "previousLandmark": null
            }
          ]
        }
        this.contentManager.addMainPathToDictionary(pathResponse);
        //Redirect route to edit 
        this.router.navigate(['edit/' + data["id"]]);
      });
  }
  */
    //If the user is not signed in, redirect him (only users can create content)
    else {
      this.router.navigate(['sign-in']);
    }
  }
}
