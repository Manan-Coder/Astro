const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 1000;


const EARTH_SCALE = 0.5;
const SUN_SCALE = EARTH_SCALE * 20;
const MOON_SCALE = EARTH_SCALE * 0.27;


const MOON_DISTANCE = 100;
const SUN_DISTANCE = 800;

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
    document.getElementById('loading').style.display = 'none';
};

const loader = new THREE.GLTFLoader(loadingManager);
let earth, moon, sun;


loader.load('luna-assets/sun.glb', (gltf) => {
    sun = gltf.scene;
    sun.scale.set(SUN_SCALE, SUN_SCALE, SUN_SCALE);
    // Position sun directly behind Earth for eclipse
    sun.position.set(-SUN_DISTANCE, 0, 0);
    scene.add(sun);
});


loader.load('luna-assets/earth.glb', (gltf) => {
    earth = gltf.scene;
    earth.scale.set(EARTH_SCALE, EARTH_SCALE, EARTH_SCALE);
    earth.position.set(0, 0, 0);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);
});


loader.load('luna-assets/moon.glb', (gltf) => {
    moon = gltf.scene;
    moon.scale.set(MOON_SCALE, MOON_SCALE, MOON_SCALE);
    moon.position.set(MOON_DISTANCE, 0, 0);
    moon.castShadow = true;
    moon.receiveShadow = true;
    scene.add(moon);
});


const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);


const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.position.set(-SUN_DISTANCE, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.camera.left = -150;
sunLight.shadow.camera.right = 150;
sunLight.shadow.camera.top = 150;
sunLight.shadow.camera.bottom = -150;
sunLight.shadow.camera.near = 400;
sunLight.shadow.camera.far = 1200;
sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;
scene.add(sunLight);

camera.position.set(0, 200, 400);
camera.lookAt(0, 0, 0);

function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

render();