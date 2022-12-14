import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageBox, Landmark, ShapeBox, TextBox } from '../content';
import { ContentService } from '../content.service';
import { generateSquarePath, DEFAULT_RADIUS, generateTrianglePath, generateCirclePath, generateRightTrianglePath, generateParallelogram, createLine } from '../shapes';
import { ChangeDetectorRef } from '@angular/core';
import { ARC_ADD, LINE_ADD } from '../enums';
import { outputAst } from '@angular/compiler';
import { FormControl, FormGroup } from '@angular/forms';
//import subjx from '../../../node_modules/subjx/types';
//import { Observable } from 'rxjs';


const subjx = require('../../../node_modules/subjx/dist/js/subjx'); //TODO: Try to avoid this

//TODO: This thing is getting so long that I may want to make some abstract classes


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  LINE_ADD = LINE_ADD;
  ARC_ADD = ARC_ADD;
  @Input() editMode: boolean = false;
  @Input() currentLandmark!: Landmark;
  @Input() lineAdd: LINE_ADD = LINE_ADD.NONE;
  @Input() arcAdd: ARC_ADD = ARC_ADD.NONE;
  @Output() lineAdded = new EventEmitter<LINE_ADD>();
  @Output() arcAdded = new EventEmitter<ARC_ADD>();

  private landmarkDom: any; //Typecast better
  private landmarkPosition: any;
  private newId: string | null = null;
  private textSizeObserver: ResizeObserver | null = null;
  private textWrapperObserver: MutationObserver | null = null;
  protected draggable: any = null;
  protected tempLine: [number, number, number, number] | null = null;
  protected tempTextBox: TextBox | null = null;


  editorForm!: FormGroup

  onSubmit() {
    console.log(this.editorForm.get('editor')!.value);
  }


  constructor(private contentManager: ContentService) { }
  ngOnInit(): void {
    this.editorForm = new FormGroup({
      'editor': new FormControl()
    })
  }
  ngAfterViewInit(): void {
    if (this.editMode) {
      //Maintain a reference to the landmark display's DOM element
      this.landmarkDom = document.getElementById("editable-landmark")!;
      this.landmarkPosition = this.landmarkDom.createSVGPoint();
      this.landmarkPosition.x = 960;
      this.landmarkPosition.y = 540;
    }
  }
  ngAfterViewChecked(): void {
    //If waiting for a DOM element to be created to add a drag/rotate/resize box. Perhaps not the ideal approach, but it should be fine for now
    if (this.newId !== null) {
      this.destroyDraggable();
      //this.draggable = subjx('#' + this.newId).drag();
      if (this.newId[0] === 'i') {
        //this.draggable['model'] = this.currentLandmark.imageContent[this.newId];
        this.createImageOrShapeDraggable(this.newId, this.currentLandmark.imageContent[this.newId]);
      }
      else if (this.newId[0] === 's') {
        this.createImageOrShapeDraggable(this.newId, this.currentLandmark.shapeContent[this.newId]);
      }
      //TODO: This whole setup is quite bush league. It works for now, but, wow...
      else if (this.newId[0] === '_') {
        //Get the div element wrapping the text in the foreign object
        const textWrapElement: Element = document.getElementById(this.newId)!//.firstElementChild!
        //Put the cursor in the text editable portion
        //textWrapElement.querySelector("span")!.focus();

        //Track the div wrapper's size changes so that the foreign object can have its height dynamically updated
        this.textSizeObserver = new ResizeObserver((entries: any, observer: any) => {
          console.log(entries);
          //entries[0].target.parentElement.setAttribute('height', entries[0].target.offsetHeight);

          
          if (this.draggable['typing']) {
            this.draggable.exeResize({
              dx: 0, dy: entries[0].target.offsetHeight - this.tempTextBox!.height
            });

            this.tempTextBox!.height = entries[0].target.offsetHeight;
          }
          this.draggable.fitControlsToSize();
        });
        this.textSizeObserver.observe(textWrapElement.firstElementChild!);
        /* 

        this.textWrapperObserver = new MutationObserver((mutationList) => {
          if(mutationList[0].attributeName === 'height') {
            this.tempTextBox!.height = +(<Element>mutationList[0].target).getAttribute('height')!;
          }
        })
        this.textWrapperObserver.observe(textWrapElement.parentElement!, {attributes: true}); */


        this.draggable = subjx('#' + this.newId).drag();
        this.draggable['model'] = this.tempTextBox;
        this.draggable['typing'] = true;

        /* this.draggable.onResizeStart(() => { this.draggable['typing'] = false });
        this.draggable.onResizeEnd(() => { this.draggable['typing'] = true }) */
        this.draggable.on('resizeStart', ()=>{this.draggable['typing'] = false;});
        this.draggable.on('resizeEnd', ()=>{this.draggable['typing'] = true;});
      }
      this.newId = null;
    }
  }
  ngOnChanges(): void {
    //Called during a change in the current landmark
    if (this.draggable !== null) {
      this.destroyDraggable();
    }
  }
  /* private updateTextHeight(entries: any, observer: any) {
    console.log(entries);
    entries[0].target.parentElement.setAttribute('height', entries[0].target.offsetHeight);
    //console.log(this.tempTextBox);
    //this.tempTextBox!.height = entries[0].target.offsetHeight;
    //console.log(this.tempTextBox);
  } */

  protected addText(event: any) {
    console.log(event);
  }

  public addShape(shape: string) {
    //Generate the 'd' value to create an SVG path
    let newPath: string;
    if (shape === 'square') {
      newPath = generateSquarePath(this.landmarkPosition.x, this.landmarkPosition.y);
    }
    else if (shape === 'circle') {
      newPath = generateCirclePath(this.landmarkPosition.x, this.landmarkPosition.y);
    }
    else if (shape === 'triangle') {
      newPath = generateTrianglePath(this.landmarkPosition.x, this.landmarkPosition.y);
    }
    else {
      return;
    }

    //Create a ShapeBox object to push to the DOM
    this.contentManager.createShape(this.currentLandmark.getId(), newPath)
      .subscribe((resp: any) => {
        const shapeObj = new ShapeBox({ 'id': resp.id, 'landmarkId': resp.landmarkId, 'd': resp.d, 'transformation': [1, 0, 0, 1, 0, 0] })
        this.currentLandmark.shapeContent[shapeObj.id] = shapeObj;
        this.newId = shapeObj.id;
      });
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
        //Save the file
        this.contentManager.createImageBox(this.currentLandmark.getId(), Math.floor(this.landmarkPosition.x - img.width / 2), Math.floor(this.landmarkPosition.y - img.height / 2), img.width, img.height, [1, 0, 0, 1, 0, 0], imgFile)
          .subscribe((resp) => {
            const imgObj = new ImageBox({
              'id': resp.id, 'landmarkId': resp.landmarkId,
              'x': resp.x, 'y': resp.y, 'width': resp.width, 'height': resp.height,
              'image': resp.image, 'transformation': [1, 0, 0, 1, 0, 0]
            });
            //this.currentLandmark.imageContent.push(imgObj);
            this.currentLandmark.imageContent[imgObj.id] = imgObj;
            this.newId = imgObj.id;
          })
      };
    });
    reader.readAsDataURL(imgFile);
  }
  protected clickLandmark(event: any) {
    console.log("registered");
    if (this.editMode) {
      //This is slightly sketchy, I may admit. It may be better to create a temporary SVG point with the client values.
      if (event.target !== this.landmarkDom) {
        if (event.target.classList.contains('image-content')) {
          if (this.draggable === null) {
            //Make new draggable
            this.createImageOrShapeDraggable(event.target.id, this.currentLandmark.imageContent[event.target.id]);
          }
          else if (event.target.id !== this.draggable['model'].id) {
            //Destroy existing draggable
            this.destroyDraggable();
            //Make new draggable
            this.createImageOrShapeDraggable(event.target.id, this.currentLandmark.imageContent[event.target.id]);
          }
        }
        else if (event.target.classList.contains('shape-content')) {
          if (this.draggable === null) {
            //Make new draggable
            this.createImageOrShapeDraggable(event.target.id, this.currentLandmark.shapeContent[event.target.id]);
          }
          else if (event.target.id !== this.draggable['model'].id) {
            //Destroy existing draggable
            this.destroyDraggable();
            //Make new draggable
            this.createImageOrShapeDraggable(event.target.id, this.currentLandmark.shapeContent[event.target.id]);
          }
        }
      }
      else {
        this.landmarkPosition.x = event.clientX;
        this.landmarkPosition.y = event.clientY;
        this.landmarkPosition = this.landmarkPosition.matrixTransform(this.landmarkDom.getScreenCTM()?.inverse());

        this.destroyDraggable();

        this.tempTextBox = new TextBox({
          'landmarkId': this.currentLandmark.getId(), 'x': this.landmarkPosition.x, 'y': this.landmarkPosition.y, 'width': 200, 'height': 25, 'transformation': [1, 0, 0, 1, 0, 0]
        });
        this.newId = this.tempTextBox.id;
      }
    }
    else {

    }
  }
  private destroyDraggable() {
    if (this.draggable !== null) {
      /* this.draggable['model'].updateContent(this.draggable.elements[0]);
      this.contentManager.updateContent(this.draggable['model'])
        .subscribe((resp) => {
          console.log(resp);
        })*/
      this.draggable.disable();
      this.draggable = null; 
    }
  }
  private createImageOrShapeDraggable(id: string, model: any) {
    //Create the subjx instance
    this.draggable = subjx('#' + id).drag();

    //TODO: Repeat this for all of them
    this.draggable.storage.handles['bc'].setAttribute('r', '8');
    //Maintain a reference to the model
    this.draggable['model'] = model;

    if (id[0] == 'i') {
      this.draggable['options']['scalable'] = true; //Image will fit to the box (default is not to, which is desired for shapes)
    }


    //Check if the resize is from one of the corners (in which case the aspect ratio is preserved) or one of the edges (in which case it is not)
    this.draggable.on('resizeStart', (event: any) => {
      const source = document.elementFromPoint(event.clientX, event.clientY);
      if (source === this.draggable.storage.handles['bc'] || source === this.draggable.storage.handles['tc'] || source === this.draggable.storage.handles['ml'] || source === this.draggable.storage.handles['mr']) {
        this.draggable['options']['proportions'] = false;
      }
      else {
        this.draggable['options']['proportions'] = true;
      }
      console.log(source);
    });
  }
  //DRAW LINE FUNCTIONS
  protected startLine(event: any) {
    event.stopPropagation();
    this.landmarkPosition.x = event.clientX;
    this.landmarkPosition.y = event.clientY;
    this.landmarkPosition = this.landmarkPosition.matrixTransform(this.landmarkDom.getScreenCTM()?.inverse());
    this.tempLine = [this.landmarkPosition.x, this.landmarkPosition.y, this.landmarkPosition.x, this.landmarkPosition.y];

    this.lineAdd = LINE_ADD.DRAW_LINE;
  }
  protected drawLine(event: any) {
    event.stopPropagation();

    this.landmarkPosition.x = event.clientX;
    this.landmarkPosition.y = event.clientY;
    this.landmarkPosition = this.landmarkPosition.matrixTransform(this.landmarkDom.getScreenCTM()?.inverse());
    this.tempLine![2] = this.landmarkPosition.x;
    this.tempLine![3] = this.landmarkPosition.y;
  }
  protected endLine(event: any) {
    event.stopPropagation();

    this.landmarkPosition.x = event.clientX;
    this.landmarkPosition.y = event.clientY;
    this.landmarkPosition = this.landmarkPosition.matrixTransform(this.landmarkDom.getScreenCTM()?.inverse());

    const path = createLine(this.tempLine![0], this.tempLine![1], this.landmarkPosition.x, this.landmarkPosition.y);

    //Add line
    this.lineAdd = LINE_ADD.NONE;
    this.tempLine = null;
    this.lineAdded.emit();


    //Create a ShapeBox object to push to the DOM
    this.contentManager.createShape(this.currentLandmark.getId(), path)
      .subscribe((resp: any) => {
        const shapeObj = new ShapeBox({ 'id': resp.id, 'landmarkId': resp.landmarkId, 'd': resp.d, 'transformation': [1, 0, 0, 1, 0, 0] })
        this.currentLandmark.shapeContent[shapeObj.id] = shapeObj;
        this.newId = shapeObj.id;
      });


  }
  //TODO: DRAW ARC FUNCTIONS
  protected selectCentre(event: any) {

  }
  protected drawRadius(event: any) {

  }
  protected selectArcStart(event: any) {

  }
  protected drawAngle(event: any) {

  }
  protected endArc(event: any) {

  }



  //constructor(private contentManager: ContentService, private ref: ChangeDetectorRef) {

  //this.tempTextBox = new TextBox({ 'id': 0, 'landmarkId': 0, 'x': 0, 'y': 0, 'width': 50, 'height': 20, 'content': Array.of('') }, false); //TODO: This is just a hack...

  /*this.textObserver = new ResizeObserver(entries => {
    if (entries[0].contentRect) {
      //console.log(this.tempTextBox.height);
      //this.tempTextBox.height = this.tempTextBox.height < entries[0].contentRect.height ? entries[0].contentRect.height : this.tempTextBox.height;
      //console.log(this.tempTextBox.height);
      //this.ref.markForCheck();

    }
  });*/
  //}

  /* ngOnInit(): void {
    //this.svgDom = document.getElementsByTagName("svg")[0];
    //this.svgPoint = this.svgDom.createSVGPoint();
    //this.contentCount = Object.keys(this.currentLandmark.getContent()).length; //TODO: Need a better way of mapping unsaved data


  } */

  /*
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
    const disabling = new Promise((resolve) => {
      resolve(this.draggable.disable());
    })
    disabling.then(() => {
      this.draggable = null;
    })
  }
  */
}
