import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { ContentDisplay } from '../content-display';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent extends ContentDisplay implements OnInit {

  constructor(private contentManager: ContentService, private route: ActivatedRoute) { 
    super();
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
      })
    }
    else {
      //redirect
    }
  }

}
