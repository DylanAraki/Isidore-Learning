export enum ICON_SELECTED {
    NONE = 0,
    IMAGE = 1,
    SHAPE = 2,
    TEXT = 3,
    APPEARANCE = 4,
    DELETE = 5,
    MATH = 6,
    LEGEND = 7,
}
export enum DISPLAY_MODE {
    DISPLAY = 0, //Display with no user interaction at all
    EDIT = 1, //When a user is editing the state
    VIEW = 2, //When a user is viewing a presentation
    /*Add line*/
    DRAW_POINT = 3,
    DRAW_LINE = 4,
    /*Add arc*/
    DRAW_CENTRE = 5,
    DRAW_RADIUS = 6,
    DRAW_ARC = 7,
    /*To toggle content boxes appearance)*/
    APPEARANCE = 8,
    /*To delete boxes*/
    DELETE = 9,
    /*While amid a subjx event*/
    DRAG_RESIZE_ROTATE = 10,
}



export enum LINE_ADD {
    NONE = 0,
    DRAW_POINT = 1,
    DRAW_LINE = 2
}
export enum ARC_ADD {
    NONE = 0,
    DRAW_CENTRE = 1,
    DRAW_RADIUS = 2,
    DRAW_ARC = 3
}