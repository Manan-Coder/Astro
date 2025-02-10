let scene, camera, renderer, controls;
        

let solarS = {
    earth: null,
    moon: null,
    sun: null
};

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    
    setRenderer();
    setCamera();
    setLighting();
    setControls();
    loadSS();
    

    requestAnimationFrame(render);

    window.addEventListener('resize', handleResize);
}

function setRenderer() {
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
}

function setCamera() {
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
    camera.position.set(0, 5, 10);
}

function setLighting() {
    const sunLight = new THREE.PointLight('#ffffff', 2, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048; 
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight('#404040', 0.2);
    scene.add(ambientLight);
}

function setControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
}

function loadSS() {
    const loader = new THREE.GLTFLoader();
    
    loader.load('https://cloud-h1ctb28fu-hack-club-bot.vercel.app/0solar_eclipse.glb', 

        (gltf) => {
            const model = gltf.scene;
            scene.add(model);
            

            model.traverse((node) => {
                if (!node.isMesh) return;
                
           
                node.castShadow = true;
                node.receiveShadow = true;
              
                if (node.name.toLowerCase().includes('sun')) {
                    setupSun(node);
                } else if (node.name.toLowerCase().includes('earth')) {
                    solarS.earth = node;
                } else if (node.name.toLowerCase().includes('moon')) {
                    solarS.moon = node;
                }
            });

            centerModel(model);
        },

        (progress) => {
            const percent = (progress.loaded / progress.total * 100);
            console.log(`Loading: ${percent.toFixed(1)}%`);
        },

        (error) => console.error('Failed to load model:', error)
    );
}

function setupSun(sunMesh) {
    solarS.sun = sunMesh;
    

    sunMesh.material = new THREE.MeshStandardMaterial({
        color: '#ffff00',
        emissive: '#ffff00',
        emissiveIntensity: 1
    });
}

function centerModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);


    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim * 2;
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


let time = 0;
function render() {
    requestAnimationFrame(render);
    

    if (solarS.sun) {
        const pulseIntensity = 1 + Math.sin(time * 0.005) * 0.2;
        solarS.sun.material.emissiveIntensity = pulseIntensity;
    }

    time++;
    controls.update();
    renderer.render(scene, camera);
}


init();