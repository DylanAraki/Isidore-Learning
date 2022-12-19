import { Component, OnInit, HostListener, ViewChild, ViewContainerRef, ApplicationRef, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentDisplay } from '../content-display';
import { ContentService } from '../content.service';
import { LineOptionsComponent } from '../line-options/line-options.component';
import { Map, Path, Landmark } from '../content';
import { AuthenticationService } from '../authentication.service';
import { faImage, faShapes } from '@fortawesome/free-solid-svg-icons';
import { ICON_SELECTED, LINE_ADD, ARC_ADD } from '../enums';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  /* @ViewChild('editOptions', { read: ViewContainerRef })
  editOptions!: ViewContainerRef */


  //height!: number
  //width!: number
  //@ViewChild(selector: 'edit-options', opts:{read: ViewContainerRef}, container: ViewContainerRef)
  //currentPath!: Path
  //currentLandmark!: Landmark
  /* private landmarkElement!: Element;
  public height!: number;
  public width!: number; */

  
  
  
  ICON_SELECTED = ICON_SELECTED;
  LINE_ADD = LINE_ADD;
  ARC_ADD = ARC_ADD;

  protected selectedIcon: ICON_SELECTED = ICON_SELECTED.NONE;
  protected faImage = faImage;
  protected faShapes = faShapes;
  protected lineAdd: LINE_ADD = LINE_ADD.NONE;
  protected arcAdd: ARC_ADD = ARC_ADD.NONE;

  protected currentMap!: Map
  protected state!: [Path, Landmark][];

  constructor(private contentManager: ContentService, private route: ActivatedRoute, private router: Router, private authenticator: AuthenticationService) {
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    //Get the editable objects (while making sure the user has access to the route)
    if (id !== null && this.authenticator.getCurrentUser() !== null) {

      //Get the map
      let map = this.contentManager.checkMap(+id);
      if (map !== null) {
        this.authenticator.getCurrentUserSession()
          .then((userSession) => {
            if (userSession.idToken.payload.sub === map!.getOwner()) {
              this.currentMap = map!;
            }
            else {
              this.router.navigate(['../../'], { relativeTo: this.route });
            }
          })
      }
      else {
        this.contentManager.getMap(+id)
          .subscribe((mapResponse) => {
            this.contentManager.addMapToDictionary(mapResponse);
            map = this.contentManager.checkMap(+id)!;

            this.authenticator.getCurrentUserSession()
            .then((userSession) => {
              if (userSession.idToken.payload.sub === map!.getOwner()) {
                this.currentMap = map!;
              }
              else {
                this.router.navigate(['../../'], { relativeTo: this.route });
              }
            })
          })
      }

      //Get the path
      let path = this.contentManager.checkMainPath(+id);
      if (path !== null) {
        //this.state.push([path, path.getFirstLandmark()]);
        this.state = Array.of([path, path.getFirstLandmark()]);
      }
      else {
        this.contentManager.getMainPath(+id)
          .subscribe((pathResponse) => {
            this.contentManager.addMainPathToDictionary(pathResponse);
            path = this.contentManager.checkMainPath(+id)!;
            //this.state.push([path, path.getFirstLandmark()]);
            this.state = Array.of([path, path.getFirstLandmark()]);
          })
      }
    }
    else {
      //TODO: Fix this
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
  
  get title(): string {
    return this.currentMap.getTitle();
  }
  set title(newTitle: string) {
    this.currentMap.setTitle(newTitle);
  }
  



  public lineAdded() {
    this.lineAdd = LINE_ADD.NONE;
  }
  public arcAdded() {
    this.arcAdd = ARC_ADD.NONE;
  }


/*   protected lineOptions() {
    this.editOptions.clear();
    this.editOptions.createComponent(LineOptionsComponent);
  } */
/*
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    //this.appRef.tick();
    //this.width = this.landmarkElement.clientWidth;
    //this.height = this.landmarkElement.clientHeight;
    console.log(window.innerHeight);
    console.log(window.innerWidth);

    /*this.height = window.innerHeight - 150; //50px for the site header and 100px for the top bar
    this.width = window.innerWidth - 200; //100px for the legend and vertical trail
    console.log(this.height);
    console.log(this.width);


    this.landmarkElement = document.getElementsByTagName('app-view')[0];
    this.width = this.landmarkElement.clientWidth;
    this.height = this.landmarkElement.clientHeight;
    
  }*/
}
