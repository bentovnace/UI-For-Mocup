import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.currentMaterial = null;

        this.init();
    }

    init() {
        // Renderer setup
        this.renderer.setSize(this.container.clientWidth, window.innerHeight);
        this.renderer.setClearColor(0xeeeeee);
        this.container.appendChild(this.renderer.domElement);

        // Camera setup
        this.camera.position.set(2, 2, 5);

        // Controls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // Lighting
        this.addLights();
        this.loadModel();
        this.setupResizeHandler();
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    async loadModel() {
        const loader = new THREE.GLTFLoader();
        try {
            const gltf = await loader.loadAsync('model.glb');
            this.model = gltf.scene;
            this.scene.add(this.model);
            this.findMaterial();
        } catch (error) {
            console.error('Error loading model:', error);
        }
    }

    findMaterial() {
        this.model.traverse((child) => {
            if (child.isMesh && child.material) {
                this.currentMaterial = child.material;
            }
        });
    }

    updateTexture(texture) {
        if (!this.currentMaterial) return;
        texture.flipY = false;
        this.currentMaterial.map = texture;
        this.currentMaterial.needsUpdate = true;
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}