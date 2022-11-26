import { Map, Path } from "./content";
import { ContentService } from "./content.service";


export abstract class ContentDisplay {
    currentMap!: Map
    currentPath!: Path

    constructor() {

    }
}