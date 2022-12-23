import { Component } from '@angular/core';
import { faImage, faShapes, faFont, faEye, faTrash, faSquareRootAlt, faCompass } from '@fortawesome/free-solid-svg-icons';
import { ICON_SELECTED } from '../enums';


@Component({
  selector: 'app-edit-options',
  templateUrl: './edit-options.component.html',
  styleUrls: ['./edit-options.component.css']
})
export class EditOptionsComponent {
  ICON_SELECTED = ICON_SELECTED;


  protected faImage = faImage;
  protected faShapes = faShapes;
  protected faFont = faFont;
  protected faEye = faEye;
  protected faTrash = faTrash;
  protected faSquareRootAlt = faSquareRootAlt;
  protected faCompass = faCompass;


}
