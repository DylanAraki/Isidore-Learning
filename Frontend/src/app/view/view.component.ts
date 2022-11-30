import { Component, Input, OnInit } from '@angular/core';
import { ImageBox, Landmark } from '../content';
import { ContentService } from '../content.service';

const subjx = require('../../../node_modules/subjx/dist/js/subjx'); //TODO: Try to avoid this

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  @Input() h!: number;
  @Input() w!: number;
  @Input() currentLandmark!: Landmark;

  private svgDom: any; //TODO: Typecast properly
  private svgPoint: any; //TODO: Ditto
  private svgPosition: [number, number] = [0, 0];
  private contentCount!: number;
  private draggable: any; //TODO: Typecast properly

  constructor(private contentManager: ContentService) {
    this.draggable = null;
  }

  ngOnInit(): void {
    this.svgDom = document.getElementsByTagName("svg")[0];
    this.svgPoint = this.svgDom.createSVGPoint();
    this.contentCount = Object.keys(this.currentLandmark.getContent()).length; //TODO: Need a better way of mapping unsaved data
  }

  public addImage(event: any) {
    //Get the uploaded file
    const imgFile = event.target.files[0];

    //Process the file
    const reader = new FileReader();
    reader.onload = (event => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        //Create new image box object
        this.contentCount++;
        const imgObj = new ImageBox({
          "id": this.contentCount.toString(), "landmarkId": this.currentLandmark.getId().toString(),
          "x": this.svgPosition[0].toString(), "y": this.svgPosition[1].toString(),
          "width": img.width.toString(), "height": img.height.toString(),
          "src": img.src
        }, false);
        //Update the local landmark object to include the object
        this.currentLandmark.addContent(imgObj);
        //Upload the image box to the server TODO: Set callback
        this.contentManager.createImageBox(imgFile, imgObj)
          .subscribe(e => {
            console.log(e);
          })
        //Reset the SVG position
        this.svgPosition = [0, 0];
      };
    });
    reader.readAsDataURL(imgFile);
  }
  protected clickSvg(event: any) {
    //TODO: It's a bit buggy right now. Sometimes multiple subjx wrappers will appear. Also, resize and drag will usually cancel the event
    if (event.target === this.svgDom) {
      this.svgPoint.x = event.clientX;
      this.svgPoint.y = event.clientY;
      const clickCoordinates = this.svgPoint.matrixTransform(this.svgDom.getScreenCTM()?.inverse());
      this.svgPosition[0] = clickCoordinates.x;
      this.svgPosition[1] = clickCoordinates.y;

      if (this.draggable !== null) {
        this.resetDraggable();
      }
    }
    else if (event.target.classList.contains("image-content")) {
      //If a new piece of content is clicked, destroy the existing moving box
      if (this.draggable !== null) {
        if (event.target.parentNode.id === this.draggable['model'].cssId) {
          return;
        }
        else {
          this.resetDraggable();
        }
      }
      this.draggable = subjx("#" + event.target.parentNode.id).drag({
        proportions: true,
        onDestroy(e1: any) {
          //Update the data to refelct the movement
          if (e1[0].transform['animVal'][0].matrix) {
            this['model'].setTransformation(e1[0].transform['animVal'][0].matrix);
            this['model'].move(e1[0].firstChild.x.animVal.value, e1[0].firstChild.y.animVal.value);
            this['model'].resize(e1[0].firstChild.width.animVal.value, e1[0].firstChild.height.animVal.value)
          }
        }
      });
      //Assign the view and model of the draggable
      this.draggable['model'] = this.currentLandmark.getContent()[event.target.parentNode.id];
    }
  }
  private resetDraggable() {
    const disabling = new Promise((resolve) => {
      resolve(this.draggable.disable());
    })
    disabling.then(() => {
      this.draggable = null;
    })
  }
}
