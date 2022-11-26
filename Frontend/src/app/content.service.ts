import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private url = "http://localhost:8000/"; //TODO: Temporary (move to environments)
  constructor(private http: HttpClient) { }

  public createMap(userId: string): Observable<any> {
    return this.http.post(this.url+'create-map/', {
      "owner": userId
    })
  }
}
