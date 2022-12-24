import { Component } from '@angular/core';
import { Landmark } from '../content';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent {
  currentLandmark!: Landmark;
  showId!: boolean;
}
