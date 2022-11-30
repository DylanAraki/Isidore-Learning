import { Landmark, Map, Path } from "./content";
import { ContentService } from "./content.service";


export abstract class ContentDisplay {
    currentMap!: Map
    currentPath!: Path
    currentLandmark!: Landmark
    

    constructor() {
    }
}