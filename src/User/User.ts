import { Group, PerspectiveCamera, Raycaster, Vector2 } from 'three';
import { Board } from '../board/Board';
import { Pawn } from '../pieces/Pawn';
import { UserSide } from './UserSide';

export class User {
    pawns: Pawn[];
    side: UserSide;
    availableSlots: number[][];
    raycaster: Raycaster;
    mouse: Vector2;

    public constructor(side: UserSide, board: Board, camera: PerspectiveCamera) {
        // x,y,side
        this.pawns = this.generateBishops(side);
        this.mouse = new Vector2();
        this.raycaster = new Raycaster();
        window.addEventListener('click', (event: any) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, camera);
            const intersects = this.raycaster.intersectObjects(this.getObjects(), true);
            if (intersects.length > 0) {
                const foundId = intersects[0].object.uuid;
                const foundPawn = this.getObjByID(foundId);
                if (foundPawn) {
                    foundPawn.getAvailableMoves(board);
                }
                for (let i = 0; i < this.pawns.length; i++) {
                    if (this.pawns[i].id !== foundPawn.id) {
                        console.log('pim');
                        this.pawns[i].deleteAvailableSlots();
                    }
                }
            }
        });
    }

    private getObjByID(id: string): Pawn {
        for (let i = 0; i < this.pawns.length; i++) {
            const possibleObj = this.pawns[i].object.getObjectByProperty('uuid', id);
            if (possibleObj) return this.pawns[i];
        }
    }

    private getObjects() {
        const newObj: Group[] = [];
        for (let i = 0; i < this.pawns.length; i++) {
            newObj.push(this.pawns[i].object);
        }
        return newObj;
    }

    private generateBishops(side: UserSide): Array<Pawn> {
        const bishops = [];
        for (let i = 0; i < 8; i++) {
            bishops.push(new Pawn(i, 1, side));
        }
        return bishops;
    }

    get allPieces(): Pawn[] {
        return this.pawns;
    }
}
