export const DEFAULT_RADIUS = 100;


export function generateSquarePath(x: number, y: number) {
    return 'M ' + (x-DEFAULT_RADIUS).toString() + ' ' + (y-DEFAULT_RADIUS).toString() 
    + ' h ' + (2*DEFAULT_RADIUS).toString() 
    + ' v ' + (2*DEFAULT_RADIUS).toString() 
    + ' h ' + (-2*DEFAULT_RADIUS).toString() 
    + ' z'
}
export function generateCirclePath(x: number, y: number) {
    return 'M ' + (x-DEFAULT_RADIUS).toString() + ' ' + y.toString()
    + ' a ' + DEFAULT_RADIUS.toString() + ' ' + DEFAULT_RADIUS.toString() + ' 0 1 0 ' + (2*DEFAULT_RADIUS).toString() + ' 0'
    + ' a ' + DEFAULT_RADIUS.toString() + ' ' + DEFAULT_RADIUS.toString() + ' 0 1 0 ' + (-2*DEFAULT_RADIUS).toString() + ' 0';
}
export function generateTrianglePath(x: number, y: number) {
    return 'M ' + (x-DEFAULT_RADIUS).toString() + ' ' + (y+DEFAULT_RADIUS).toString() 
    + ' l ' + DEFAULT_RADIUS.toString() + ' ' + (-2*DEFAULT_RADIUS).toString()
    + ' l ' + DEFAULT_RADIUS.toString() + ' ' + (2*DEFAULT_RADIUS).toString()
    + ' z'
}
export function generateRightTrianglePath(x: number, y: number) {
    return 'M ' + (x-DEFAULT_RADIUS).toString() + ' ' + (y-DEFAULT_RADIUS).toString()
    + ' v ' + (2*DEFAULT_RADIUS).toString()
    + ' h ' + (2*DEFAULT_RADIUS).toString()
    + ' z';
}
export function generateParallelogram(x: number, y: number) {
    return 'M' + (x-DEFAULT_RADIUS).toString() + ' ' + (y+DEFAULT_RADIUS).toString()
    + ' l ' + (DEFAULT_RADIUS/2).toString() + ' ' + (-2*DEFAULT_RADIUS).toString()
    + ' h ' + (3*DEFAULT_RADIUS/2).toString()
    + ' l ' + (-DEFAULT_RADIUS/2).toString() + ' ' + (2*DEFAULT_RADIUS).toString()
    + ' z';   
}
export function createLine(x1: number, y1: number, x2: number, y2: number) {
    return 'M' + x1.toString() + ' ' + y1.toString() + ' L ' + x2.toString() + ' ' + y2.toString();
}