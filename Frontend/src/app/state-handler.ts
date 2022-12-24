import { BehaviorSubject } from 'rxjs';

export abstract class StateHandler {
    private state = new BehaviorSubject<[number, number][]>([]);

    //Append the path and its landmark onto the state.
    public openPath(newPathId: number, newLandmarkId: number): void {
        const curState = this.state.getValue();
        curState.push([newPathId, newLandmarkId]);
        this.state.next(curState);
    }

    //Update the currently displayed landmark (note this doesn't check if such a landmark exists in the current path)
    public changeLandmark(newLandmarkId: number): void {
        const curState = this.state.getValue();
        if (curState.length > 0) {
            curState[curState.length - 1][1] = newLandmarkId;
            this.state.next(curState);
        }
        else {
            throw Error("No path loaded");
        }
    }

    //Move the current path up
    public closeChildPaths(pathId: number): void {
        const curState = this.state.getValue();
        const index = curState.findIndex(([path]) => path === pathId);
        if (index === -1) {
            throw new Error('Path not open');
        }
        this.state.next(curState.slice(0, index + 1));
    }
}