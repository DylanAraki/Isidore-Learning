import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentDisplay } from '../content-display';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent extends ContentDisplay implements OnInit {
  height!: number
  width!: number

  constructor(private contentManager: ContentService, private route: ActivatedRoute) { 
    super();
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
   this.height = 0.7*window.innerHeight;
   this.width = 0.7*window.innerWidth;
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

}
