import { Component, Input, OnInit } from '@angular/core';
import { Path } from '../content';

@Component({
  selector: 'app-horizontal-trail',
  templateUrl: './horizontal-trail.component.html',
  styleUrls: ['./horizontal-trail.component.css']
})
export class HorizontalTrailComponent implements OnInit {

  @Input() currentPath!: Path;

  constructor() { }

  ngOnInit(): void {
  }

  protected addLandmark(start: boolean) {
    console.log(start);
  }

}
