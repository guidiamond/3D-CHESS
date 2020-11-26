import { v4 as uuidv4 } from 'uuid';
import { UserSide } from '../User/UserSide';
import { CircleProps } from './Pawn';

export abstract class Piece {
    id: string;
    side: UserSide;
    constructor(side: UserSide) {
        this.id = uuidv4();
        this.side = side;
    }

    abstract move(circle: CircleProps): void;
    abstract die(): void;
    // abstract availableGotoSlots(): number[][];
}
