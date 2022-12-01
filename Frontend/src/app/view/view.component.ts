import { Component, Input, OnInit } from '@angular/core';
import { ImageBox, Landmark, ShapeBox, TextBox } from '../content';
import { ContentService } from '../content.service';
import { generateSquarePath, DEFAULT_RADIUS, generateTrianglePath, generateCirclePath, generateRightTrianglePath, generateParallelogram } from '../shapes';
import { ChangeDetectorRef } from '@angular/core';


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
  protected draggable: any = null; //TODO: Typecast properly
  protected tempTextBox: TextBox;
  protected textObserver: ResizeObserver;;

  constructor(private contentManager: ContentService, private ref: ChangeDetectorRef) {
    this.tempTextBox = new TextBox({ 'id': 0, 'landmarkId': 0, 'x': 0, 'y': 0, 'width': 50, 'height': 20, 'content': Array.of('') }, false); //TODO: This is just a hack...

    this.textObserver = new ResizeObserver(entries => {
      if (entries[0].contentRect) {
        console.log(this.tempTextBox.height);
        this.tempTextBox.height = this.tempTextBox.height < entries[0].contentRect.height ? entries[0].contentRect.height : this.tempTextBox.height;
        console.log(this.tempTextBox.height);
        //this.ref.markForCheck();

      }
    });
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
  public addShape(shape: string) {
    //Generate the 'd' value to create an SVG path
    let newPath: string | undefined = undefined;
    if (shape === 'square') {
      newPath = generateSquarePath(this.svgPosition[0], this.svgPosition[1]);
    }
    else if (shape === 'circle') {
      newPath = generateCirclePath(this.svgPosition[0], this.svgPosition[1]);
    }
    else if (shape === 'triangle') {
      newPath = generateTrianglePath(this.svgPosition[0], this.svgPosition[1]);
    }
    else if (shape === 'right triangle') {
      newPath = generateRightTrianglePath(this.svgPosition[0], this.svgPosition[1]);
    }
    else if (shape === 'parallelogram') {
      newPath = generateParallelogram(this.svgPosition[0], this.svgPosition[1]);
    }

    //Create a ShapeBox object to push to the DOM
    if (newPath !== undefined) {
      this.contentCount++;
      const shapeObj = new ShapeBox({
        "id": this.contentCount.toString(), "landmarkId": this.currentLandmark.getId().toString(),
        "x": (this.svgPosition[0] - DEFAULT_RADIUS).toString(), "y": (this.svgPosition[1] - DEFAULT_RADIUS).toString(),
        "width": (2 * DEFAULT_RADIUS).toString(), "height": (2 * DEFAULT_RADIUS).toString(),
        'content': newPath
      }, false);
      this.currentLandmark.addContent(shapeObj);
    }
  }


  protected clickSvg(event: any) {
    //TODO: It's a bit buggy right now. Sometimes multiple subjx wrappers will appear. Also, resize and drag will usually cancel the event
    //TODO: Not to mention, this code is rather messy. Should probably do something about it...
    if (event.target === this.svgDom) {
      this.svgPoint.x = event.clientX;
      this.svgPoint.y = event.clientY;
      const clickCoordinates = this.svgPoint.matrixTransform(this.svgDom.getScreenCTM()?.inverse());
      this.svgPosition[0] = clickCoordinates.x;
      this.svgPosition[1] = clickCoordinates.y;

      if (this.draggable !== null) {
        //this.resetDraggable();
      }
      else {

        this.textObserver.observe(document.querySelector(".text-wrapper")!);
        this.tempTextBox = new TextBox({ 'id': 0, 'landmarkId': 0, 'x': this.svgPosition[0], 'y': this.svgPosition[1], 'width': 500, 'height': 55, 'content': Array.of('') }, false); //TODO: This is just a hack...

      }



    }
    else if (event.target.classList.contains('text-content')) {
      if (!this.draggable) {
        this.draggable = subjx("#" + this.tempTextBox.cssId).drag(
          {
            onResize() {
              //this.exeResize({dx: 0, dy: this['model'].height-this.storage.bBox.height})
              this.storage.bBox.height = this['model'].height;
              console.log(this.controls);
              this.controls.setAttribute("height", this.storage.bBox.height.toString());
              //console.log(this.controls);
              console.log(this.storage.bBox);
              console.log(this.storage.bBox.height);
            }
          }
        );
        this.draggable['model'] = this.tempTextBox;
        this.draggable.storage.handles['bc'].remove();
        this.draggable.storage.handles['tc'].remove();
        this.draggable.storage.handles['ml'].remove()
        this.draggable.storage.handles['tl'].remove();
        this.draggable.storage.handles['bl'].remove();
        this.draggable.storage.handles['tr'].remove();
        this.draggable.storage.handles['br'].remove();
      }
      else {
        //console.log(this.draggable.controls);
        console.log(typeof (this.draggable.storage.handles));
        console.log(this.draggable.storage.handles);
        //delete this.draggable.storage['bc'];
        //console.log(this.draggable.storage.handles['bc']);

        
      }


    }
    else if (event.target.classList.contains("image-content") || event.target.classList.contains("shape-content")) {
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
        //proportions: true,
        onDestroy(e1: any) {
          //Update the data to refelct the movement
          if (e1[0].transform['animVal'][0].matrix) {
            this['model'].setTransformation(e1[0].transform['animVal'][0].matrix);
            if (this['type'] === 'image') {
              this['model'].move(e1[0].firstChild.x.animVal.value, e1[0].firstChild.y.animVal.value);
              this['model'].resize(e1[0].firstChild.width.animVal.value, e1[0].firstChild.height.animVal.value)
            }
            else if (this['type'] === 'shape') {
              console.log(typeof (e1[0].firstElementChild.getAttribute('d')));
              console.log(e1[0].firstElementChild.getAttribute('d'));
              this['model'].content[0] = e1[0].firstElementChild.getAttribute('d');
            }

          }
        }
      });
      //Assign the view and model of the draggable
      this.draggable['model'] = this.currentLandmark.getContent()[event.target.parentNode.id];
      if (event.target.classList.contains("image-content")) {
        this.draggable['type'] = 'image';
        //this.draggable['proportions'] = true;
        this.draggable['options'].proportions = true;
      }
      else if (event.target.classList.contains("shape-content")) {
        this.draggable['type'] = 'shape';
        //this.draggable['proportions'] = false;
      }
      else if (event.target.classList.contains("text-content")) {

      }
    }
  }
  private resetDraggable() {
    this.draggable.disable();
    this.draggable = null;
    /*const disabling = new Promise((resolve) => {
      resolve(this.draggable.disable());
    })
    disabling.then(() => {
      this.draggable = null;
    })*/
  }
}
