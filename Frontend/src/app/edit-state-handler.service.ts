import { Injectable } from '@angular/core';
import { DISPLAY_MODE, ICON_SELECTED } from './enums';
import { StateHandler } from './state-handler'

@Injectable({
  providedIn: 'root'
})
export class EditStateHandlerService extends StateHandler {
  private icon: ICON_SELECTED;
  private display: DISPLAY_MODE;

  constructor() { 
    super();

    this.icon = ICON_SELECTED.NONE;
    this.display = DISPLAY_MODE.EDIT;
  }
}
