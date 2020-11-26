import { Group } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export const loadSomething = async (filePath: string): Promise<Group> => {
    return new Promise((resolve) => {
        const loader = new OBJLoader();

        loader.load(filePath, resolve);
    });
};
