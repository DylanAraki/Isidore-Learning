import { Component, OnInit, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentDisplay } from '../content-display';
import { ContentService } from '../content.service';
import { LineOptionsComponent } from '../line-options/line-options.component';
import { Map, Path, Landmark } from '../content';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @ViewChild('editOptions', {read: ViewContainerRef})
  editOptions!: ViewContainerRef
  

  height!: number
  width!: number
  //@ViewChild(selector: 'edit-options', opts:{read: ViewContainerRef}, container: ViewContainerRef)
  currentPath!: Path
  currentLandmark!: Landmark



  currentMap!: Map
  state: [Path, Landmark][] = [];


  constructor(private contentManager: ContentService, private route: ActivatedRoute) { 
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
   this.height = window.innerHeight - 150; //50px for the site header and 100px for the top bar
   this.width = window.innerWidth - 200; //100px for the legend and vertical trail
   console.log(this.height);
   console.log(this.width);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id !== null) {
      let map = this.contentManager.checkMap(+id);
      if(map !== null) {
        this.currentMap = map;
        console.log(this.currentMap);
      }
      else {
        this.contentManager.getMap(+id)
        .subscribe((mapResponse) => {
          this.contentManager.addMapToDictionary(mapResponse);
          map = this.contentManager.checkMap(+id)!;
          this.currentMap = map;
          console.log(this.currentMap);
        })
      }

      let path = this.contentManager.checkMainPath(+id);
      if(path !== null) {
        this.state.push([path, path.getFirstLandmark()]);
        console.log(this.state);
      }
      else {
        this.contentManager.getMainPath(+id)
        .subscribe((pathResponse) => {
          this.contentManager.addMainPathToDictionary(pathResponse);
          path = this.contentManager.checkMainPath(+id)!;
          this.state.push([path, path.getFirstLandmark()]);
          console.log(this.state)
        })
      }
    }
    else {
      //TODO: redirect
    }
  }


  protected lineOptions() {
    this.editOptions.clear();
    this.editOptions.createComponent(LineOptionsComponent);
  }

}
