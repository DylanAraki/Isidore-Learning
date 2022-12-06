import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ImageBox, Map, Path } from './content'

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private maps: {[id: number]: Map} = {};
  private mainPaths: {[id: number]: Path} = {};
  private url = "http://localhost:8000/"; //TODO: Temporary (move to environments)
  constructor(private http: HttpClient) { }



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
  /*public createImageBox(imageFile: File, imageInfo: ImageBox): Observable<any> {
    const uploadData = new FormData();
    uploadData.append("landmarkId", imageInfo.landmarkId.toString());
    uploadData.append("x", imageInfo.x.toString());
    uploadData.append("y", imageInfo.y.toString());
    uploadData.append("width", imageInfo.width.toString());
    uploadData.append("height", imageInfo.height.toString());
    uploadData.append("image", imageFile);
    return this.http.post(this.url + 'create-image/', uploadData);
  }*/
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
