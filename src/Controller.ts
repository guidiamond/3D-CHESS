import { PerspectiveCamera, PointLight, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Board } from './board/Board';
import { User } from './User/User';
import { UserSide } from './User/UserSide';
import { getRatio } from './utils/getRatio';
import { scene } from './utils/scene';

export class Controller {
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    whiteUser: User;
    blackUser: User;
    controls: OrbitControls;
    board: Board;
    raycaster: Raycaster;
    mouse: Vector2;
    public constructor() {
        this.camera = this.initCamera();
        this.renderer = this.initRenderer(this.camera);

        this.board = new Board(scene);

        this.whiteUser = new User(UserSide.WHITE, this.board, this.camera);
        this.startCameraController();
        this.addLight();

        // Render loop
        this.render();
    }

    private addLight() {
        const light = new PointLight(0xffffff, 1, 500);
        light.position.set(10, 0, 25);
        scene.add(light);
    }

    private render() {
        const renderScreen = () => {
            // optimized loop that redraws the scene every time the screen is refreshed (Monitor avg ~60hz)
            requestAnimationFrame(renderScreen);
            this.controls.update();
            this.renderer.render(scene, this.camera);
        };
        renderScreen();
    }

    private startCameraController() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        // rotation and zoom speeds
        controls.rotateSpeed = 0.8;
        controls.zoomSpeed = 4;
        // min max distance for zoom
        controls.maxDistance = 12;
        controls.minDistance = 6;
        this.controls = controls;
        return controls;
    }

    private initCamera(): PerspectiveCamera {
        const camera = new PerspectiveCamera(75, getRatio(), 0.1, 1000);
        camera.rotateX(0.5);
        camera.position.x = 0;
        camera.position.y = -5;
        camera.position.z = 7;
        // translate
        camera.translateX(3);
        camera.translateY(3);
        camera.translateZ(3);
        return camera;
    }

    private initRenderer(camera: PerspectiveCamera): WebGLRenderer {
        const renderer = new WebGLRenderer({ antialias: true });
        renderer.setClearColor('#a0a5b8');
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
        window.addEventListener('resize', function () {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = getRatio();

            camera.updateProjectionMatrix();
        });
        return renderer;
    }
}
