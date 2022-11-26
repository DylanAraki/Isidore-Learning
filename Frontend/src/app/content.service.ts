import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Map, Path } from './content'

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private maps: {[id: string]: Map} = {};
  private paths: {[id: string]: Path} = {};
  private url = "http://localhost:8000/"; //TODO: Temporary (move to environments)
  constructor(private http: HttpClient) { }

  public createMap(userId: string): Observable<any> {
    return this.http.post(this.url+'create-map/', {
      "owner": userId
    })
  }

  public addMapToDictionary(mapResponse: {[id: string]: string}): void {
    this.maps[mapResponse['id']] = new Map(mapResponse);
  }
  public addPathToDictionary(pathResponse: {[id: string]: any}): void {
    this.paths[pathResponse['id']] = new Path(pathResponse);
  }


  public getMap(id: string): Observable<any> {
    if(id in this.maps) {
      return new Observable((subscriber) => {
        subscriber.next(this.maps[id]);
      })
    }
    else {
      return this.http.get(this.url + 'maps/' + id + '/'); //TODO: Will need some sort of wraper to ensure the return type is set properly
    }
  }
  public getMainPath(mapId: string): Observable<any> {
    if(mapId in this.maps && this.maps[mapId].getMainPath() !== undefined) {
      return new Observable((subscriber) => {
        const pathId: number = this.maps[mapId].getMainPath()!;
        subscriber.next(this.paths[pathId]);
      })
    }
    return this.http.get(this.url + 'main-path/' + mapId + '/'); //TODO: Will need some sort of wraper to ensure the return type is set properly
  }
}
