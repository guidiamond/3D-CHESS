import { CircleGeometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Raycaster, Vector2 } from 'three';
import { Board } from '../board/Board';
import RookModel from '../models/Rook.obj';
import { UserSide } from '../User/UserSide';
import { loadSomething } from '../utils/ModelLoader';
import { scene } from '../utils/scene';
import { Piece } from './Piece';

export interface CircleProps {
    id: string;
    xPosition: number;
    yPosition: number;
    mesh: Mesh;
}
export class Rook extends Piece {
    isFirstMove: boolean;
    isDead: boolean;
    isSelected: boolean;
    raycaster: Raycaster;
    mouse: Vector2;
    object: Group;
    circleIds: Array<CircleProps>;

    constructor(xPosition: number, yPosition: number, side: UserSide, camera: PerspectiveCamera) {
        super(side);
        this.circleIds = [];
        this.isFirstMove = true;
        this.isSelected = false;
        this.render(xPosition, yPosition);
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
                const foundCircle = this.getCircleByID(foundId);
                this.move(foundCircle);
            }
        });
    }
    private getCircleByID(id: string): CircleProps {
        for (let i = 0; i < this.circleIds.length; i++) {
            const possibleObj = this.circleIds[i].mesh.getObjectByProperty('uuid', id);
            if (possibleObj) return this.circleIds[i];
        }
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
    private getObjects() {
        const newObj: Mesh[] = [];
        for (let i = 0; i < this.circleIds.length; i++) {
            newObj.push(this.circleIds[i].mesh);
        }
        return newObj;
    }

    public async render(xPosition: number, yPosition: number): Promise<void> {
        const object = await loadSomething(RookModel);
        this.id = object.uuid;
        this.object = object;
        object.scale.set(0.08, 0.08, 0.08);
        object.position.set(xPosition, yPosition, 0.2);
        object.rotateX(Math.PI / 2);
        object.name = 'pawn';

        scene.add(object);
    }

    public move(foundCircle: CircleProps): void {
        if (this.isFirstMove) this.isFirstMove = false;
        this.object.position.y = foundCircle.yPosition;
        this.isSelected = false;
        this.deleteAvailableSlots();
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
            const teste = scene.getObjectByProperty('uuid', this.circleIds[i].id);
            scene.remove(teste);
        }
    }

    public drawAvailableSlots(x: number, y: number): void {
        const circleGeometry = new CircleGeometry(0.5, 32);
        const material = new MeshBasicMaterial({ color: 'green' });
        const circle = new Mesh(circleGeometry, material);
        circle.position.set(x, y, this.object.position.z + 0.4);
        scene.add(circle);
        this.circleIds.push({ id: circle.uuid, xPosition: x, yPosition: y, mesh: circle });
    }
}
