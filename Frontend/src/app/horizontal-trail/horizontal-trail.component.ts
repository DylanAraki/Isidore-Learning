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


  protected changeLandmarkOrder(event: any) {
    if(event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.curState[0].getLandmarks(), event.previousIndex, event.currentIndex);
      const landmarkList = this.curState[0].getLandmarks();

      if(event.currentIndex === 0) {
        landmarkList[0].setOrder(landmarkList[1].getOrder() - 100);
      }
      else if(event.currentIndex === landmarkList.length-1) {
        landmarkList[landmarkList.length-1].setOrder(landmarkList[landmarkList.length-2].getOrder() + 100);
      }
      else {
        landmarkList[event.currentIndex].setOrder(Math.floor((landmarkList[event.currentIndex-1].getOrder() + landmarkList[event.currentIndex+1].getOrder())/2));
      }

      this.contentManager.updateLandmarkOrder(landmarkList[event.currentIndex].getId(), landmarkList[event.currentIndex].getOrder())
      .subscribe((e) => {
        console.log(e);
      })
    }
  }
}
