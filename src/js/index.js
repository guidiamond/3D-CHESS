function getRatio() {
    return window.innerWidth / window.innerHeight;
}

function init() {
    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(75, getRatio(), 0.1, 1000);
    camera.position.z = 5;

    let renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setClearColor('#e5e5e5');
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(
        renderer.domElement,
        window.addEventListener('resize', function () {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = getRatio();

            camera.updateProjectionMatrix();
        }),
    );

    let raycaster = new THREE.Raycaster(); // gets mouse position in the canvas
    let mouse = new THREE.Vector2();

    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
    let mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    let light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(10, 0, 25);

    scene.add(light);

    let render = function () {
        // optimized loop that redraws the scene every time the screen is refreshed (Monitor avg ~60hz)
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    function onMouseMove(event) {
        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObjects(scene.children, true);
        for (let i = 0; i < intersects.length; i++) {
            tl = new TimelineMax();
            tl.to(intersects[i].object.scale, 1, { x: 2, ease: Expo.easeOut });
            tl.to(intersects[i].object.scale, 0.5, { x: 0.5, ease: Expo.easeOut });
            tl.to(intersects[i].object.position, 0.5, { x: 2.0, ease: Expo.easeOut });
            tl.to(intersects[i].object.position, 0.5, { y: Math.PI * 0.5, ease: Expo.easeOut }, '=-1.5');
        }
    }

    render();

    window.addEventListener('click', onMouseMove);
}
