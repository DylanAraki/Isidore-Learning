import { Component, OnInit, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentDisplay } from '../content-display';
import { ContentService } from '../content.service';
import { LineOptionsComponent } from '../line-options/line-options.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent extends ContentDisplay implements OnInit {
  @ViewChild('editOptions', {read: ViewContainerRef})
  editOptions!: ViewContainerRef

  height!: number
  width!: number
  //@ViewChild(selector: 'edit-options', opts:{read: ViewContainerRef}, container: ViewContainerRef)
  


  constructor(private contentManager: ContentService, private route: ActivatedRoute) { 
    super();
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
      this.contentManager.getMap(id)
      .subscribe((map) => {
        this.currentMap = map;
        console.log(this.currentMap);
      });
      
      this.contentManager.getMainPath(id)
      .subscribe((path) => {
        this.currentPath = path;
        console.log(this.currentPath);
        this.currentLandmark = path.getFirstLandmark();
        console.log(this.currentLandmark);
      })
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
