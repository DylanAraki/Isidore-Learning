import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ARC_ADD, DISPLAY_MODE, ICON_SELECTED, LINE_ADD } from './enums';
import { StateHandler } from './state-handler';




/* interface SubDisplay {
  ///Subject
  //notify(): void      Pass the new Subject to subscribe to and the callback function (the callback function will be what responds to this notify method)
  destroy(): void;
}

class EditSubDisplay implements SubDisplay {
  private selectedId = new Subject<string | null>();

  selectBox(id: string): void {
    this.selectedId.next(id);
  }
  
  destroy(): void {
    this.selectedId.next(null);
  }
}
class ViewSubDisplay implements SubDisplay {
  private appearanceState = new Subject<number | null>();

  //New animation state
  newAppearanceState(newAppearanceState: number) {
    this.appearanceState.next(newAppearanceState);
  }

  //Everything automatically appears
  destroy(): void {
    this.appearanceState.next(null);
  }
} */

interface ContentBox { id: string }

//To be used on the Display Template
interface DisplayInfo {
  readonly displayState: DISPLAY_MODE;
  displayData: {[dataType: string]: any}
}


class ShowDisplayInfo implements DisplayInfo {
  public displayState = DISPLAY_MODE.SHOW;
  public displayData = {};
}
class EditDisplayInfo implements DisplayInfo {
  public displayState = DISPLAY_MODE.EDIT;
  public displayData = {'selectedId': null};

}
class ViewDisplayInfo implements DisplayInfo {
  public displayState = DISPLAY_MODE.VIEW;
  public displayData = {'appearanceState': 1};
}
class DrawArcInfo implements DisplayInfo {
  public displayState = DISPLAY_MODE.DRAW_ARC;
  public displayData = {'arcState': ARC_ADD.DRAW_CENTRE};
}
class DrawLineInfo implements DisplayInfo {
  public displayState = DISPLAY_MODE.DRAW_LINE;
  public displayData = {'lineState': LINE_ADD.DRAW_POINT};
}
class ApperanceInfo implements DisplayInfo {
  public displayState = DISPLAY_MODE.APPEARANCE;
  public displayData = {'appearanceState': 1};
}
class DeleteInfo implements DisplayInfo {
  public displayState = DISPLAY_MODE.DELETE;
  public displayData = {};
}



@Injectable({
  providedIn: 'root'
})
export class EditStateHandlerService extends StateHandler {
  private icon: ICON_SELECTED = ICON_SELECTED.NONE;
  private display: DisplayInfo = new EditDisplayInfo();


  constructor() { 
    super();

  }
}
