import {
    BoxGeometry,
    CircleGeometry,
    EdgesGeometry,
    Group,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshBasicMaterial,
    Scene,
} from 'three';
import { Pawn } from '../pieces/Pawn';
import { Piece } from '../pieces/Piece';
import { User } from '../User/User';
import { UserSide } from '../User/UserSide';
import { scene } from '../utils/scene';

export class Board {
    xSize: number;
    ySize: number;
    board: Array<Array<string | Piece>>;
    availableSlots: Array<Array<number>>;
    turn: UserSide;
    selectedPiece: Piece;

    public constructor(scene: Scene) {
        this.xSize = 8;
        this.ySize = 8;
        this.board = this.generateBoard();
        this.turn = UserSide.WHITE;
        this.addBoardToScene(scene);
    }

    public setPieceByPositionBulk(pieces: Pawn[]): void {
        for (let i = 0; i < pieces.length; i++) {
            this.setPieceByPosition(pieces[i]);
        }
    }

    public setPieceByPosition(piece: Pawn): void {
        const { xPosition, yPosition } = piece;
        this.board[xPosition][yPosition] = piece;
    }

    public getPieceByPosition(x: number, y: number): Piece | string {
        return this.board[x][y];
    }

    public drawAvailableSlots(piece: Piece): string {
        this.removeAvailableSlots(piece.id);
        const circleGeometry = new CircleGeometry(0.5, 32);
        const material = new MeshBasicMaterial({ color: 'green' });
        const circle = new Mesh(circleGeometry, material);
        scene.add(circle);
        return circle.uuid;
    }

    public removeAvailableSlots(uuid: string): void {
        const object = scene.getObjectByProperty('uuid', uuid);
        console.log(object);
        scene.remove(object);
    }

    private addBoardToScene(scene: Scene) {
        const group = new Group();
        let flip = true;
        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.board[x].length; y++) {
                let color = 'black';
                if (flip) {
                    color = 'white';
                }
                // Cube mesh creation
                const material = new MeshBasicMaterial({ color });
                const geometry = new BoxGeometry(1, 1, 1);
                const cube = new Mesh(geometry, material);
                cube.position.x = x;
                cube.position.y = y;
                // Edge of each cube
                const edgeGeometry = new EdgesGeometry(cube.geometry);
                const edgeMaterial = new LineBasicMaterial({ color: 'black' });
                const edges = new LineSegments(edgeGeometry, edgeMaterial);
                cube.add(edges);
                group.add(cube);
                flip = !flip;
            }
            flip = !flip;
        }
        scene.add(group);
    }

    private generateBoard() {
        const boardMatrix = [];
        // Foreach line append a column
        for (let i = 0; i < 8; i++) {
            const col = Array(8).join('.').split('.');
            boardMatrix.push(col);
        }
        return boardMatrix;
    }
}
