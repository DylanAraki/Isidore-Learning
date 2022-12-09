import { Component, Input, OnInit } from '@angular/core';
import { Landmark, Path } from '../content';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-horizontal-trail',
  templateUrl: './horizontal-trail.component.html',
  styleUrls: ['./horizontal-trail.component.css']
})
export class HorizontalTrailComponent implements OnInit {

  @Input() curState!: [Path, Landmark];

  constructor(private contentManager: ContentService) { }

  ngOnInit(): void {
  }

  protected addLandmark(start: boolean) {
    this.contentManager.createLandmark(start ? -100 : 100, this.curState[0].getId(), start ? this.curState[0].getFirstLandmark() : this.curState[0].getLastLandmark())
    .subscribe((resp) => {
      if(start) {
        this.curState[0].addToFrontOfLandmarks(new Landmark(resp));
      }
      else {
        this.curState[0].addToBackOfLandmarks(new Landmark(resp));
      }
    })
  }
  protected changeSlide(landmark: Landmark) {
    if(landmark !== this.curState[1]) {
      this.curState[1] = landmark;
    }
  }
}
