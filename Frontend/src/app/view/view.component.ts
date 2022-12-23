import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ImageBox, Landmark, ShapeBox, TextBox } from '../content';
import { ContentService } from '../content.service';
import { generateSquarePath, DEFAULT_RADIUS, generateTrianglePath, generateCirclePath, generateRightTrianglePath, generateParallelogram, createLine } from '../shapes';
import { ChangeDetectorRef } from '@angular/core';
import { ARC_ADD, LINE_ADD } from '../enums';
import { outputAst } from '@angular/compiler';
import { FormControl, FormGroup } from '@angular/forms';
import { HostListener } from '@angular/core';
import Quill, { Delta } from 'quill';
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
  protected draggable: any = null;
  protected tempLine: [number, number, number, number] | null = null;
  protected tempTextBox: TextBox | null = null;
  private singleClickTimeout: any;
  private tempId: number = 1; //TODO: Delete
  protected editedTextId: string | null = null;
  //test!: any; //{'ops': [{'insert': 'hello'}]};
  test = { 'ops': [{ 'attributes': { 'link': "https://www.google.com" }, 'insert': 'dfklajd;sflkaj' }] }
  toolbarOptions = {
    container: [],
    handlers: {}
  }
  testFun(textBox: string) {
    console.log("Heyyy")
    console.log(textBox);
  }



  focusOnEditor(arg: any) {
    console.log(arg);
    console.log(typeof (arg));
    console.log(arg.editor);
    console.log(typeof (arg.editor));

  }
  bold(arg: any) {
    console.log("Bold")
    console.log(arg)
  }

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
    ]
  };
  public onEditorCreated(quill: Quill) {
    this.enableMathLive(quill);  // Insert MathLive field when the formula button is clicked.
  }

  // Sets a handler for the formula button in quill toolbar to insert a mathlive blot.
  private enableMathLive(quill: Quill) {
    quill.getModule('toolbar').addHandler('formula', () => {
      const range = quill.getSelection() || { index: quill.getLength() - 1 };
      let cursorPos = range.index;  // Get cursor position.

      console.log('insert MathLive Blot into quill.');
      quill.insertEmbed(cursorPos, 'mathlive', 'INSERT', 'user');
    });
  }

  protected options: any = { 'toolbar': document.getElementById('toolbar') };

  @HostListener('click', ['$event', 'editable-landmark'])
  protected clickLandmark(event: any) {
    console.log("registered");
    if (this.editMode) {
      clearTimeout(this.singleClickTimeout);
      //Wait 150 ms before handling this in case of a double click
      this.singleClickTimeout = setTimeout(() => {
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

        }
      }, 150);
    }
    else {

    }
  }
  @HostListener('dblclick', ['$event', 'editable-landmark'])
  protected doubleClickLandmark(event: any) {
    if (this.editMode) {
      clearTimeout(this.singleClickTimeout);
      this.landmarkPosition.x = event.clientX;
      this.landmarkPosition.y = event.clientY;
      this.landmarkPosition = this.landmarkPosition.matrixTransform(this.landmarkDom.getScreenCTM()?.inverse());

      this.destroyDraggable();

      /* this.tempTextBox = new TextBox({
        'landmarkId': this.currentLandmark.getId(), 'x': this.landmarkPosition.x, 'y': this.landmarkPosition.y, 'width': 200, 'height': 25, 'transformation': [1, 0, 0, 1, 0, 0]
      }); */
      const textObj = new TextBox({
        'id': this.tempId, 'landmarkId': this.currentLandmark.getId(), 'x': this.landmarkPosition.x, 'y': this.landmarkPosition.y, 'width': 200, 'height': 25, 'transformation': [1, 0, 0, 1, 0, 0]
      });
      this.currentLandmark.textContent[textObj.id] = textObj;
      this.newId = textObj.id;

      this.editedTextId = this.newId;
      this.tempId++;
    }
  }
  /* export class MyComponent {
    editorContent: any;
  
    // retrieve the delta value from the database or other source
    delta = {
      "ops": [
        { "insert": "Hello, world!" }
      ]
    };
  
    constructor() {}
  
    ngOnInit() {
      this.editorContent.setValue(this.delta);
    }
  }
  
   */
  @ViewChildren('editor') editors: QueryList<any>;


  protected updateContent(event: any, textBox: TextBox) {
    textBox.content = event.content;
  }

  constructor(private contentManager: ContentService) { this.editors = new QueryList<any>(); }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    if (this.editMode) {
      //Maintain a reference to the landmark display's DOM element
      this.landmarkDom = document.getElementById("editable-landmark")!;
      this.landmarkPosition = this.landmarkDom.createSVGPoint();
      this.landmarkPosition.x = 960;
      this.landmarkPosition.y = 540;
    }

    this.editors.forEach((editor: any) => {
      console.log(editor)
      editor.instance.setContents(editor);
    });
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
          //console.log(entries);
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


        this.draggable = subjx('#' + this.newId).drag();
        this.draggable['model'] = this.tempTextBox;
        this.draggable['typing'] = true;

        this.draggable.on('resizeStart', () => { this.draggable['typing'] = false; });
        this.draggable.on('resizeEnd', () => { this.draggable['typing'] = true; });

        this.draggable.storage.handles['bc'].remove();
        this.draggable.storage.handles['tc'].remove();
        this.draggable.storage.handles['ml'].remove()
        this.draggable.storage.handles['tl'].remove();
        this.draggable.storage.handles['bl'].remove();
        this.draggable.storage.handles['tr'].remove();
        this.draggable.storage.handles['br'].remove();
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
  public addText(event: any) {
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

  private destroyDraggable() {
    if (this.draggable !== null) {
      this.draggable['model'].updateContent(this.draggable.elements[0]);
      /* this.contentManager.updateContent(this.draggable['model'])
        .subscribe((resp) => {
          console.log(resp);
        }) */
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
}
