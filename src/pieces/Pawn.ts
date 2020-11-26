import { CircleGeometry, Group, Mesh, MeshBasicMaterial, Raycaster, Vector2 } from 'three';
import { Board } from '../board/Board';
import PawnModel from '../models/Pawn.obj';
import { UserSide } from '../User/UserSide';
import { loadSomething } from '../utils/ModelLoader';
import { scene } from '../utils/scene';
import { Piece } from './Piece';

export class Pawn extends Piece {
    isFirstMove: boolean;
    isDead: boolean;
    isSelected: boolean;
    raycaster: Raycaster;
    mouse: Vector2;
    object: Group;
    circleIds: Array<string>;

    constructor(xPosition: number, yPosition: number, side: UserSide) {
        super(side);
        this.circleIds = [];
        this.isFirstMove = true;
        this.isSelected = false;
        this.render(xPosition, yPosition);
    }

    get yPosition(): number {
        return this.object.position.y;
    }

    set yPosition(y: number) {
        this.yPosition = y;
    }

    set xPosition(x: number) {
        this.xPosition = x;
    }
    get xPosition(): number {
        return this.object.position.x;
    }

    public async render(xPosition: number, yPosition: number): Promise<void> {
        const object = await loadSomething(PawnModel);
        this.id = object.uuid;
        this.object = object;
        object.scale.set(0.08, 0.08, 0.08);
        object.position.set(xPosition, yPosition, 0.2);
        object.rotateX(Math.PI / 2);
        object.name = 'pawn';

        scene.add(object);
    }

    public move(stepTwo?: boolean): void {
        if (this.isFirstMove && stepTwo) {
            this.object.position.y += 1;
            this.isFirstMove = false;
            return;
        }
        this.yPosition += 1;
    }

    public die(): void {
        this.isDead = true;
    }

    public getAvailableMoves(board: Board): number[][] {
        // returns empty if piece is dead
        if (this.isDead) return [];
        const availableMoves: number[][] = [];
        this.isSelected = true;

        // check if piece can go forward
        const possiblePieceForward = board.getPieceByPosition(this.xPosition, this.yPosition + 1);
        if (typeof possiblePieceForward === 'string') {
            availableMoves.push([this.xPosition, this.yPosition + 1]);
            if (this.isFirstMove) availableMoves.push([this.xPosition, this.yPosition + 2]);
        }
        // Checks and adds possible killable pieces (diagonal left|right)
        const diagonalLeft = [this.xPosition - 1, this.yPosition + 1];
        const diagonalRight = [this.xPosition + 1, this.yPosition + 1];
        if (diagonalLeft[0] >= 0) {
            const possiblePieceLeft = board.getPieceByPosition(diagonalLeft[0], diagonalLeft[1]);

            // check if there is a piece on the next move & if the piece is from the oposite team
            if (typeof possiblePieceLeft !== 'string' && possiblePieceLeft.side !== this.side)
                availableMoves.push(diagonalLeft);
        }
        if (diagonalRight[0] <= 7) {
            const possiblePieceRight = board.getPieceByPosition(diagonalRight[0], diagonalRight[1]);

            // check if there is a piece on the next move & if the piece is from the oposite team
            if (typeof possiblePieceRight !== 'string' && possiblePieceRight.side !== this.side)
                availableMoves.push(diagonalRight);
        }
        for (let i = 0; i < availableMoves.length; i++) {
            this.drawAvailableSlots(availableMoves[i][0], availableMoves[i][1]);
        }

        return availableMoves;
    }
    public deleteAvailableSlots(): void {
        for (let i = 0; i < this.circleIds.length; i++) {
            const teste = scene.getObjectByProperty('uuid', this.circleIds[i]);
            scene.remove(teste);
        }
    }

    public drawAvailableSlots(x: number, y: number): void {
        const circleGeometry = new CircleGeometry(0.5, 32);
        const material = new MeshBasicMaterial({ color: 'green' });
        const circle = new Mesh(circleGeometry, material);
        circle.position.set(x, y, this.object.position.z + 0.4);
        scene.add(circle);
        this.circleIds.push(circle.uuid);
    }
}
