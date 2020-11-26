/// <reference path="three.d.ts" />

export class OBJLoader extends EventDispatcher {
    constructor();
    load(url: string, callback?: (response: any) => any): void;
    parse(data: any): any; // Not sure if the return value can be typed. Seems to be a group but I can't find a definition for that in three.d.ts?
}
