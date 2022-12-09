import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Changes, ImageBox, Landmark, Map, Path } from './content'

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private maps: {[id: number]: Map} = {};
  private mainPaths: {[id: number]: Path} = {};
  private url = "http://localhost:8000/"; //TODO: Temporary (move to environments)
  //private changes = [[Object, TYPE][], [Object, TYPE][], [Object, TYPE, Object[][]]]  = [[], [], []];
  //private changes: Changes;


  constructor(private http: HttpClient) { 
    //this.changes = new Changes(); //TODO: Note that to update last saved on map, there will need to be something done about this
  }



  //CHANGES
  /* public saveChanges() {
    console.log("Hello?")
    this.http.put(this.url + 'save/', this.changes)
    .subscribe((data)=> {
      console.log("Hello???");
      console.log(data);
    }) 
  }
  public createObject(createdObject: any) { //TODO: Create an interface here
    this.changes.creations[createdObject.getId()] = createdObject;
  } */
  //CREATING LOCAL TYPESCRIPT OBJECTS
  public addMapToDictionary(mapResponse: {[id: string]: any}): void {
    this.maps[mapResponse['id']] = new Map(mapResponse);
  }
  public addMainPathToDictionary(pathResponse: {[id: string]: any}): void {
    this.mainPaths[pathResponse['mapId']] = new Path(pathResponse);
  }
  //HTTP POST REQUESTS
  public createMap(userId: string): Observable<any> {
    return this.http.post(this.url + 'create-map/', {
      "owner": userId
    })
  }
  public createLandmark(offset: number, pathId: number, adjacentLandmark: Landmark): Observable<any> {
    return this.http.post(this.url + 'landmark/', 
    {
      'pathId': pathId,
      'order': adjacentLandmark.getOrder() + offset
    });
  }
  public createImageBox(landmarkId: number, x: number, y: number, width: number, height: number, transformation: number[], image: File): Observable<any> {
    const uploadData = new FormData();
    uploadData.append("landmarkId", landmarkId.toString());
    uploadData.append("x", x.toString());
    uploadData.append("y", y.toString());
    uploadData.append("width", width.toString());
    uploadData.append("height", height.toString());
    uploadData.append("image", image);
    return this.http.post(this.url + 'create-image/', uploadData);
  }
  //HTTP PUT REQUESTS
  private updateImageBox(imageBox: ImageBox) {
    return this.http.put(this.url + 'image-boxes/' + imageBox.id.slice(1) + '/', imageBox.formatHttp());
  }
  public updateLandmarkOrder(id: number, newOrder: number): Observable<any> {
    return this.http.put(this.url + 'landmark-order/' + id.toString() + '/', {'order': newOrder});
  }

  public updateContent(box: any) {
    if(box.id[0] == 'i') {
      return this.updateImageBox(box);
    }
    return this.updateImageBox(box); //TODO: TEMP
  }

  //HTTP OR LOCAL GET REQUESTS
  public checkMap(id: number): Map | null {
    if(id in this.maps) {
      return this.maps[id];
    }
    else {
      return null;
    }
  }
  public checkMainPath(mapId: number): Path | null {
    if(mapId in this.mainPaths) {
      return this.mainPaths[mapId];
    }
    else {
      return null;
    }
  }
  public getMap(id: number): Observable<any> {
    return this.http.get(this.url + 'map/' + id + '/');
  }
  public getMainPath(mapId: number): Observable<any> {
    return this.http.get(this.url + 'main-path/' + mapId + '/'); 
  }
}
