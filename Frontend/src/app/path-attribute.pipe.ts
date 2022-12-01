import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pathAttribute'
})
export class PathAttributePipe implements PipeTransform {

  transform(value: any[]): string {
    let formattedPath = "";
    for(let pathCommand of value) {
      formattedPath += pathCommand[0];
      for(let pathDistance of pathCommand[1]) {
        formattedPath += ' ' + pathDistance.toString()
      }
      formattedPath += ' ';
    }
    return formattedPath;
  }

}
