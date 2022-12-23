import { BehaviorSubject } from 'rxjs';

export abstract class StateHandler {
    private state = new BehaviorSubject<[number, number][]>([]);

    //Append the path and its landmark onto the state.
    public openPath(newPathId: number, newLandmarkId: number): void {
        const currentValue = this.state.getValue();
        this.state.next([...currentValue, [newPathId, newLandmarkId]]);
    }

    //Update the currently displayed landmark (note this doesn't check if such a landmark exists in the current path)
    public changeLandmark(newLandmarkId: number): void {
        const currentValue = this.state.getValue();
        if (currentValue.length > 0) {
            currentValue[currentValue.length - 1][1] = newLandmarkId;
            this.state.next(currentValue);
        }
        else {
            throw Error("No path loaded");
        }
    }

    //Move the current path up
    public closeChildPaths(pathId: number): void {
        const currentValue = this.state.getValue();
        const index = currentValue.findIndex(([path]) => path === pathId);
        if (index === -1) {
            throw new Error('Path not open');
        }
        this.state.next(currentValue.slice(0, index + 1));
    }
}