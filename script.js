// Variables globales
let scene, camera, renderer, controls;
let buildings = [];
let water, ground;
let loader;
let bedroomModel;

// Inicialización
function init() {
    // Crear escena
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87CEEB, 1000, 5000);

    // Configurar cámara con vista aérea
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );
    camera.position.set(200, 300, 400);
    camera.lookAt(0, 0, 0);

    // Crear renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Añadir al DOM
    document.getElementById('three-container').appendChild(renderer.domElement);

    // Controles de órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.2; // Limitar rotación vertical
    controls.minDistance = 200;
    controls.maxDistance = 2000;

    // Inicializar loader
    loader = new THREE.GLTFLoader();

    // Crear elementos de la escena
    createLighting();
    createGround();
    createWater();
    loadBedroomModel();
    createBuildings();
    createEnvironment();

    // Iniciar animación
    animate();
}

// Iluminación
function createLighting() {
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Luz direccional (sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1000, 1000, 500);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 3000;
    directionalLight.shadow.camera.left = -1000;
    directionalLight.shadow.camera.right = 1000;
    directionalLight.shadow.camera.top = 1000;
    directionalLight.shadow.camera.bottom = -1000;
    scene.add(directionalLight);
}

// Cargar modelo GLB del dormitorio
function loadBedroomModel() {
    loader.load(
        'modern_bedroom.glb',
        function (gltf) {
            bedroomModel = gltf.scene;

            // Configurar el modelo
            bedroomModel.scale.set(50, 50, 50); // Escalar para que sea visible
            bedroomModel.position.set(0, 0, 0); // Posición central

            // Habilitar sombras para todos los meshes del modelo
            bedroomModel.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(bedroomModel);

            // Centrar cámara en el modelo
            const box = new THREE.Box3().setFromObject(bedroomModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Ajustar posición de cámara basada en el tamaño del modelo
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

            camera.position.set(center.x + cameraZ, center.y + cameraZ / 2, center.z + cameraZ);
            camera.lookAt(center);
            controls.target.copy(center);

            console.log('Modelo del dormitorio cargado exitosamente');
        },
        function (progress) {
            console.log('Progreso de carga: ', (progress.loaded / progress.total * 100) + '%');
        },
        function (error) {
            console.error('Error al cargar el modelo:', error);
        }
    );
}

// Crear suelo
function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(4000, 4000);
    const groundMaterial = new THREE.MeshLambertMaterial({
        color: 0x8B7355,
        transparent: true,
        opacity: 0.8
    });

    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    scene.add(ground);
}

// Crear agua/océano


// Manejo de redimensionamiento
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Event listeners
window.addEventListener('resize', onWindowResize);

// Interactividad de la UI
document.addEventListener('DOMContentLoaded', function () {
    // Menú lateral
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navegación por puntos
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            navDots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');

            // Cambiar vista de cámara
            switch (index) {
                case 0:
                    camera.position.set(0, 800, 1200);
                    break;
                case 1:
                    camera.position.set(-500, 600, 800);
                    break;
                case 2:
                    camera.position.set(500, 600, 800);
                    break;
            }
            controls.update();
        });
    });

    // Barra de progreso
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');

    progressBar.addEventListener('click', function (e) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        progressFill.style.width = (percent * 100) + '%';
        progressHandle.style.left = (percent * 100) + '%';
    });
});

// Inicializar cuando se cargue la página
window.addEventListener('load', init);
