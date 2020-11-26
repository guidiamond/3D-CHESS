// const initCamera = (): PerspectiveCamera => {
//     const camera = new PerspectiveCamera(75, getRatio(), 0.1, 1000);
//     camera.rotateX(0.5);
//     camera.position.x = 0;
//     camera.position.y = -5;
//     camera.position.z = 7;
//     return camera;
// };
//
// const initRenderer = (camera: PerspectiveCamera) => {
//     const renderer = new WebGLRenderer({ antialias: true });
//     renderer.setClearColor('#a0a5b8');
//     renderer.setSize(window.innerWidth, window.innerHeight);
//
//     document.body.appendChild(renderer.domElement);
//     window.addEventListener('resize', function () {
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         camera.aspect = getRatio();
//
//         camera.updateProjectionMatrix();
//     });
//     return renderer;
// };
//
// const init = () => {
//     const camera = initCamera();
//     const renderer = initRenderer(camera);
//     const whiteUser = new User(UserSide.WHITE);
//
//     const raycaster = new Raycaster(); // gets mouse position in the canvas
//     const mouse = new Vector2();
//     const onMouseMove = (event: any) => {
//         event.preventDefault();
//
//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//
//         raycaster.setFromCamera(mouse, camera);
//
//         const intersects = raycaster.intersectObjects(pawn.object.children, true);
//         if (intersects.length > 0) {
//             if (pawn.object.position.x < 7) {
//                 if (!pawn.isSelected) {
//                     const available = pawn.availableGotoSlots();
//                     for (let i = 0; i < available.length; i++) {
//                         const circleGeometry = new CircleGeometry(0.5, 32);
//                         const material = new MeshBasicMaterial({ color: 'green' });
//                         const circle = new Mesh(circleGeometry, material);
//                         circle.position.set(available[i][0], available[i][1], pawn.object.position.z + 0.4);
//                         scene.add(circle);
//                         pawn.isSelected = true;
//                     }
//                 } else {
//                     pawn.object.position.y += 1;
//                     pawn.isSelected = false;
//                 }
//             }
//             // intersects[0].object.position.x += 10;
//         }
//     };
//     // Chess Board Creation
//     const chessBoard = new Board(scene, whiteUser);
//
//     chessBoard.setPieceByPositionBulk(whiteUser.pawns);
//     const pawn = new Pawn(0, 1, UserSide.WHITE);
//     const light = new PointLight(0xffffff, 1, 500);
//     light.position.set(10, 0, 25);
//     scene.add(light);
//     camera.translateX(3);
//     camera.translateY(3);
//     camera.translateZ(3);
//     const controls = new OrbitControls(camera, renderer.domElement);
//     // rotation and zoom speeds
//     controls.rotateSpeed = 0.8;
//     controls.zoomSpeed = 4;
//     // min max distance for zoom
//     controls.maxDistance = 12;
//     controls.minDistance = 6;
//     // polar
//     scene.add(new AxesHelper());
//
//     // controls.minPolarAngle = -Math.PI / 4;
//     controls.update();
//     const render = () => {
//         // optimized loop that redraws the scene every time the screen is refreshed (Monitor avg ~60hz)
//         requestAnimationFrame(render);
//         controls.update();
//         renderer.render(scene, camera);
//     };
//     render();
//     window.addEventListener('click', chessBoard.allowUser());
// };

import { Controller } from './Controller';

// init();
new Controller();
