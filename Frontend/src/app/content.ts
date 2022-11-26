export class Map {
    private id: number;
    private owner: string;
    private title: string;
    private publicity: string;
    private description: string | null;
    private topic: string | null;
    private mainPath: number | undefined;

    constructor(mapResponse: {[id: string]: string}) {
        this.id = +mapResponse['id'];
        this.owner = mapResponse['owner'];
        if("title" in mapResponse) {
            this.title = mapResponse['title'];
        }
        else {
            this.title = "Untitled Map"
        }
        if("publicity" in mapResponse) {
            this.publicity = mapResponse['publicity'];
        }
        else {
            this.publicity = "p";
        }
        if("description" in mapResponse) {
            this.description = mapResponse["description"];
        }
        else {
            this.description = null;
        }
        if("topic" in mapResponse) {
            this.topic = mapResponse["topic"];
        }
        else {
            this.topic = null;
        }
        if("mainPath" in mapResponse) {
            this.mainPath = +mapResponse["mainPath"];
        }
        else {
            this.mainPath = undefined;
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
}

export class Landmark {
    private id: number;
    private previousLandmark!: Landmark | null;
    private numAnimations: number = 1;
    //TODO: Content

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
}