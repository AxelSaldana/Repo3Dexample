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
            
            camera.position.set(center.x + cameraZ, center.y + cameraZ/2, center.z + cameraZ);
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
function createWater() {
    const waterGeometry = new THREE.PlaneGeometry(6000, 6000);
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: 0x006994,
        transparent: true,
        opacity: 0.7,
        shininess: 100
    });
    
    water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -10;
    scene.add(water);
}

// Crear edificios
function createBuildings() {
    // Hotel principal (amarillo/dorado)
    createMainHotel();
    
    // Edificio alto (azul/verde)
    createTallBuilding();
    
    // Edificios adicionales
    createAdditionalBuildings();
}

function createMainHotel() {
    const hotelGroup = new THREE.Group();
    
    // Estructura principal
    const mainGeometry = new THREE.BoxGeometry(300, 120, 150);
    const mainMaterial = new THREE.MeshLambertMaterial({ color: 0xDAA520 });
    const mainBuilding = new THREE.Mesh(mainGeometry, mainMaterial);
    mainBuilding.position.set(-200, 60, 0);
    mainBuilding.castShadow = true;
    mainBuilding.receiveShadow = true;
    
    // Balcones
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 12; j++) {
            const balconyGeometry = new THREE.BoxGeometry(8, 3, 15);
            const balconyMaterial = new THREE.MeshLambertMaterial({ color: 0xB8860B });
            const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
            balcony.position.set(
                -200 + (j * 25) - 137.5,
                20 + (i * 15),
                80
            );
            balcony.castShadow = true;
            hotelGroup.add(balcony);
        }
    }
    
    hotelGroup.add(mainBuilding);
    scene.add(hotelGroup);
    buildings.push(hotelGroup);
}

function createTallBuilding() {
    const tallGroup = new THREE.Group();
    
    // Torre principal
    const towerGeometry = new THREE.BoxGeometry(80, 300, 80);
    const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x2E8B57 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(200, 150, -100);
    tower.castShadow = true;
    tower.receiveShadow = true;
    
    // Balcones verdes
    for (let i = 0; i < 20; i++) {
        const balconyGeometry = new THREE.BoxGeometry(85, 2, 10);
        const balconyMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
        balcony.position.set(200, 20 + (i * 14), -55);
        balcony.castShadow = true;
        tallGroup.add(balcony);
    }
    
    tallGroup.add(tower);
    scene.add(tallGroup);
    buildings.push(tallGroup);
}

function createAdditionalBuildings() {
    // Edificio de la derecha
    const rightGeometry = new THREE.BoxGeometry(200, 80, 120);
    const rightMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
    const rightBuilding = new THREE.Mesh(rightGeometry, rightMaterial);
    rightBuilding.position.set(400, 40, 200);
    rightBuilding.castShadow = true;
    rightBuilding.receiveShadow = true;
    scene.add(rightBuilding);
    buildings.push(rightBuilding);
    
    // Edificios de fondo
    for (let i = 0; i < 5; i++) {
        const bgGeometry = new THREE.BoxGeometry(
            50 + Math.random() * 100,
            30 + Math.random() * 80,
            50 + Math.random() * 100
        );
        const bgMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(Math.random(), 0.3, 0.6)
        });
        const bgBuilding = new THREE.Mesh(bgGeometry, bgMaterial);
        bgBuilding.position.set(
            -800 + Math.random() * 1600,
            bgGeometry.parameters.height / 2,
            -500 + Math.random() * 300
        );
        bgBuilding.castShadow = true;
        bgBuilding.receiveShadow = true;
        scene.add(bgBuilding);
        buildings.push(bgBuilding);
    }
}

// Crear elementos del entorno
function createEnvironment() {
    // Árboles y vegetación
    for (let i = 0; i < 20; i++) {
        createTree(
            -600 + Math.random() * 1200,
            0,
            -200 + Math.random() * 400
        );
    }
    
    // Barcos en el agua
    createBoats();
}

function createTree(x, y, z) {
    const treeGroup = new THREE.Group();
    
    // Tronco
    const trunkGeometry = new THREE.CylinderGeometry(2, 3, 15);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(0, 7.5, 0);
    
    // Copa
    const foliageGeometry = new THREE.SphereGeometry(8);
    const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(0, 20, 0);
    
    treeGroup.add(trunk);
    treeGroup.add(foliage);
    treeGroup.position.set(x, y, z);
    scene.add(treeGroup);
}

function createBoats() {
    for (let i = 0; i < 3; i++) {
        const boatGeometry = new THREE.BoxGeometry(30, 8, 10);
        const boatMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const boat = new THREE.Mesh(boatGeometry, boatMaterial);
        boat.position.set(
            -1000 + Math.random() * 2000,
            -5,
            800 + Math.random() * 500
        );
        scene.add(boat);
    }
}

// Animación
function animate() {
    requestAnimationFrame(animate);
    
    // Actualizar controles
    controls.update();
    
    // Animación del agua
    if (water) {
        water.material.color.setHSL(0.55, 0.8, 0.3 + Math.sin(Date.now() * 0.001) * 0.1);
    }
    
    // Renderizar
    renderer.render(scene, camera);
}

// Manejo de redimensionamiento
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Event listeners
window.addEventListener('resize', onWindowResize);

// Interactividad de la UI
document.addEventListener('DOMContentLoaded', function() {
    // Menú lateral
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Navegación por puntos
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            navDots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            // Cambiar vista de cámara
            switch(index) {
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
    
    progressBar.addEventListener('click', function(e) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        progressFill.style.width = (percent * 100) + '%';
        progressHandle.style.left = (percent * 100) + '%';
    });
});

// Inicializar cuando se cargue la página
window.addEventListener('load', init);
