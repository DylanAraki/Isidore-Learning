export class Changes {
    deletions: { [id: number | string]: any } = {};
    creations: { [id: number | string]: any } = {};
    updates: { [id: number | string]: [any, string[]] } = {};
}



//TODO: When back, restructure the classes with aim of pushing data into the template and saving it to the database.
export class Map {
    private id: number;
    private owner: string;
    private title: string = "Untitled Learning Map";
    private publicity: string = 'p';
    private tags: string[] | null = null;
    private description: string | null = null;
    private topic: string | null = null;
    private lastSaved: Date;

    constructor(mapResponse: { [key: string]: any }) {
        this.id = mapResponse['id'];
        this.owner = mapResponse['owner'];
        if ("title" in mapResponse) {
            this.title = mapResponse['title'];
        }
        if ("publicity" in mapResponse) {
            this.publicity = mapResponse['publicity'];
        }
        if ("tags" in mapResponse) {
            this.tags = mapResponse['tags'];
        }
        if ("description" in mapResponse) {
            this.description = mapResponse['description'];
        }
        if ("topic" in mapResponse) {
            this.topic = mapResponse['topic'];
        }
        this.lastSaved = new Date(mapResponse['lastSaved']);
    }
    public getOwner() { return this.owner; }
    public getTitle() { return this.title; }
}
export class Path {
    private id: number;
    private mapId: number;
    private isMainPath: boolean;
    private landmarks: Landmark[] = [];

    constructor(pathResponse: { [key: string]: any }) {
        this.id = pathResponse['id'];
        this.mapId = pathResponse['mapId'];
        this.isMainPath = pathResponse['isMainPath'];

        //Server guarantees the landmarks are passed in the correct order
        for (let landmarkResponse of pathResponse['landmarks']) {
            this.landmarks.push(new Landmark(landmarkResponse));
        }
    }
    public getId() { return this.id; }
    public getFirstLandmark() { return this.landmarks[0]; }
    public getLastLandmark() { return this.landmarks[this.landmarks.length - 1] }
    public getLandmarks() { return this.landmarks; }
    public addToFrontOfLandmarks(landmark: Landmark) {
        this.landmarks.unshift(landmark)
    }
    public addToBackOfLandmarks(landmark: Landmark) {
        this.landmarks.push(landmark);
    }
}
export class Landmark {
    private id: number;
    private numAnimations: number = 1;
    private order: number;
    //private previousLandmarkId: number | null = null;
    //private legend
    //private textContent: {[key:string]: TextBox} = {};
    //private shapeContent: {[key:string]: ShapeBox} = {};
    //public imageContent: {[key:string]: ImageBox} = {};

    //public imageContent: ImageBox[] = [];
    public imageContent: { [id: string]: ImageBox } = {};
    public shapeContent: { [id: string]: ShapeBox } = {};

    constructor(landmarkResponse: { [key: string]: any }) {
        this.id = landmarkResponse['id'];
        this.order = landmarkResponse['order'];
        for (let imageResponse of landmarkResponse['images']) {
            //this.imageContent.push(new ImageBox(imageResponse));
            this.imageContent['i' + imageResponse['id']] = new ImageBox(imageResponse);
        }
        for(let shapeResponse of landmarkResponse['shapes']) {
            this.shapeContent['s' + shapeResponse['id']] = new ShapeBox(shapeResponse);
        }
    }
    public getId(): number { return this.id; }
    public getOrder(): number { return this.order; }
    public setOrder(newOrder: number) { this.order = newOrder; }
    //public addImage(newImage: ImageBox): void { this.imageContent[newImage.getId()] = newImage; }
}
export class ImageBox {
    id: string; //Displayed on CSS
    landmarkId: number;
    x: number;
    y: number;
    width: number;
    height: number;
    transformation: DOMMatrix;
    //saved: boolean;
    image: string;

    constructor(imageResponse: { [key: string]: any }) {
        this.id = 'i' + imageResponse['id'].toString();
        this.landmarkId = imageResponse['landmarkId'];
        this.x = imageResponse['x'];
        this.y = imageResponse['y'];
        this.width = imageResponse['width'];
        this.height = imageResponse['height'];
        this.transformation = new DOMMatrix(imageResponse['transformation']);
        this.image = imageResponse['image'];
    }

    public getId(): string { return this.id; }

    public updateContent(element: any) {
        this.x = +element.getAttribute('x');
        this.y = +element.getAttribute('y');
        this.width = +element.getAttribute('width');
        this.height = +element.getAttribute('height');
        this.transformation = new DOMMatrix(element.getAttribute('transform'));
    }

    public formatHttp() {
        return {
            'x': this.x,
            'y': this.y,
            'width': this.width,
            'height': this.height,
            'transformation': [this.transformation.a, this.transformation.b, this.transformation.c, this.transformation.d, this.transformation.e, this.transformation.f]
        };
    }
}
export class ShapeBox {
    id: string; //Displayed on CSS
    landmarkId: number;
    transformation: DOMMatrix;
    d: string;
    constructor(shapeResponse: { [key: string]: any }) {
        this.id = 's' + shapeResponse['id'].toString();
        this.landmarkId = shapeResponse['landmarkId'];
        this.transformation = new DOMMatrix(shapeResponse['transformation']);
        this.d = shapeResponse['d'];


        console.log(this);
    }
    public updateContent(element: any) {
        this.d = element.getAttribute('d');
        this.transformation = new DOMMatrix(element.getAttribute('transform'));
    }
    public formatHttp() {
        return {
            'd': this.d,
            'transformation': [this.transformation.a, this.transformation.b, this.transformation.c, this.transformation.d, this.transformation.e, this.transformation.f]
        };
    }
}
export class TextBox {

}










/*
export class Map {
    private id: number;
    private owner: string;
    private title: string = "Untitled Map";
    private publicity: string = "p";
    private description: string | null = null;
    private topic: string | null = null;
    private mainPath: number | undefined;

    constructor(mapResponse: {[id: string]: string}) {
        this.id = +mapResponse['id'];
        this.owner = mapResponse['owner'];
        if("title" in mapResponse) {
            this.title = mapResponse['title'];
        }
        if("publicity" in mapResponse) {
            this.publicity = mapResponse['publicity'];
        }
        if("description" in mapResponse) {
            this.description = mapResponse["description"];
        }
        if("topic" in mapResponse) {
            this.topic = mapResponse["topic"];
        }
        if("mainPath" in mapResponse) {
            this.mainPath = +mapResponse["mainPath"];
        }
    }
    getMainPath() {
        return this.mainPath;
    }
}

export class Path {
    private id: number;
    private mapId: number;
    private firstLandmark!: Landmark;

    constructor(pathResponse: {[id: string]: any}) { //TODO: Cast the type better
        this.id = +pathResponse["id"];
        this.mapId = +pathResponse["mapId"];


        const seenLandmarks: {[id: number]: Landmark} = {};
        const neededPreq: {[id: number]: number} = {};
        for(let landmarkResponse of pathResponse["landmarks"]) {
            //Create a landmark object
            const newLandmark = new Landmark(landmarkResponse);

            //Assign the previous landmark or delay
            if(+landmarkResponse["previousLandmark"] in seenLandmarks) {
                newLandmark.setPreviousLandmark(seenLandmarks[+landmarkResponse["previousLandmark"]]);
            }
            else if(landmarkResponse["previousLandmark"] === null) {
                newLandmark.setPreviousLandmark(null);
                this.firstLandmark = newLandmark;
            }
            else {
                neededPreq[+landmarkResponse["previousLandmark"]] = newLandmark.getId();
            }

            //Set as previous landmark if not alreay assigned
            if(newLandmark.getId() in neededPreq) {
                seenLandmarks[neededPreq[newLandmark.getId()]].setPreviousLandmark(newLandmark);
            }
        }
    }
    public getFirstLandmark() {
        return this.firstLandmark;
    }
}

export class Landmark {
    private id: number;
    private previousLandmark!: Landmark | null;
    private numAnimations: number = 1;
    //private imageContent: ImageBox[] = [];
    private content: {[cssId: string]: ContentBox} = {};

    constructor(landmarkResponse: {[id: string]: any}) { //TODO: Cast the type better
        this.id = +landmarkResponse["id"];
        if("numAnimations" in landmarkResponse) {
            this.numAnimations = landmarkResponse["numAnimations"];
        }
    }

    public setPreviousLandmark(previousLandmark: Landmark | null) {
        this.previousLandmark = previousLandmark;
    }
    public getId() {
        return this.id;
    }
    /*public getImageContent() {
        return this.imageContent;
    }
    public addImageContent(box: ImageBox) {
        this.imageContent.push(box);
    }*/
/*
public getContent() {
    return this.content;
}
public addContent(newContent: ContentBox) {
    this.content[newContent.cssId] = newContent;
}
}


//TODO: These implementations are a mess. 
export interface ContentBox {
readonly id: number;
readonly landmarkId: number;
x: number;
y: number;
width: number;
height: number;
transformation: DOMMatrix;
saved: boolean;
cssId: string;
content: any[];

move(newX: number, newY: number): void;
resize(newWidth: number, newHeight: number): void;
setTransformation(newTransformation: SVGMatrix): void;
}

export class ImageBox implements ContentBox {
id: number;
landmarkId: number;
x: number;
y: number;
saved: boolean;
width: number;
height: number;
transformation: DOMMatrix;
cssId: string
src: string; //The source of the image. Will either be locally saved or from the server
content: any[] = [];
 
constructor(imageResponse: {[id: string]: string}, saved: boolean) {
    this.id = +imageResponse['id'];
    this.landmarkId = +imageResponse['landmarkId'];
    this.x = +imageResponse['x'];
    this.y = +imageResponse['y'];
    this.width = +imageResponse['width'];
    this.height = +imageResponse['height'];
    this.src = imageResponse['src'];
    this.content.push(imageResponse['src']); //TODO: Temp
    this.cssId = "img" + imageResponse['id'];
    this.saved = saved;

    this.transformation = new DOMMatrix([1,0,0,1,0,0]);
}

public move(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
}
public resize(newWidth: number, newHeight: number) {
    this.width = newWidth;
    this.height = newHeight;
}
public setTransformation(newTransformation: SVGMatrix) {
    this.transformation = new DOMMatrix([newTransformation.a, newTransformation.b, newTransformation.c, newTransformation.d, newTransformation.e, newTransformation.f]);
}
}

export class ShapeBox implements ContentBox {
id: number;
landmarkId: number;
x: number;
y: number;
width: number;
height: number;
transformation: DOMMatrix;
saved: boolean;
cssId: string;
content: any[] = [];
constructor(shapeResponse: {[id: string]: any}, saved: boolean) {
    this.id = +shapeResponse['id'];
    this.landmarkId = +shapeResponse['landmarkId'];
    this.x = +shapeResponse['x'];
    this.y = +shapeResponse['y'];
    this.width = +shapeResponse['width'];
    this.height = +shapeResponse['height'];

    this.transformation = new DOMMatrix([1,0,0,1,0,0]);

    this.saved = saved;
    this.cssId = "shape" + shapeResponse['id'];
    this.content.push(shapeResponse['content']);

}
public move(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
}
public resize(newWidth: number, newHeight: number) {
    this.width = newWidth;
    this.height = newHeight;
}
public setTransformation(newTransformation: SVGMatrix) {
    this.transformation = new DOMMatrix([newTransformation.a, newTransformation.b, newTransformation.c, newTransformation.d, newTransformation.e, newTransformation.f]);
}   
}
export class TextBox implements ContentBox {
id: number;
landmarkId: number;
x: number;
y: number;
width: number;
height: number;
transformation: DOMMatrix;
saved: boolean;
cssId: string;
content: any[] = [];
constructor(textResponse: {[id: string]: any}, saved: boolean) {
    this.id = +textResponse['id'];
    this.landmarkId = +textResponse['landmarkId'];
    this.x = +textResponse['x'];
    this.y = +textResponse['y'];
    this.width = +textResponse['width'];
    this.height = +textResponse['height'];
    this.content = textResponse['content'];
    this.cssId = "txt" + textResponse['id'];
    this.saved = saved;

    this.transformation = new DOMMatrix([1,0,0,1,0,0]);
}

public move(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
}
public resize(newWidth: number, newHeight: number) {
    this.width = newWidth;
    this.height = newHeight;
}
public setTransformation(newTransformation: SVGMatrix) {
    this.transformation = new DOMMatrix([newTransformation.a, newTransformation.b, newTransformation.c, newTransformation.d, newTransformation.e, newTransformation.f]);
} 
public getTextSpans(): string[] {
    return this.content;
}
public getHeight(): number {
    return this.height;
}
}
*/