import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.currentMaterial = null;
        
        this.initScene();
    }

    initScene() {
        // Basic setup
        this.scene.background = new THREE.Color(0xeeeeee);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        // Camera setup
        this.camera.position.set(2, 2, 5);
        
        // Controls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
    }

    async loadModel(url) {
        try {
            const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
            const loader = new GLTFLoader();
            
            const gltf = await loader.loadAsync(url);
            this.model = gltf.scene;
            this.scene.add(this.model);
            this.centerModel();
            
            // Find first available material
            this.model.traverse((child) => {
                if (child.isMesh && child.material) {
                    this.currentMaterial = child.material;
                }
            });
            
            return true;
        } catch (error) {
            console.error('Model loading failed:', error);
            return false;
        }
    }

    centerModel() {
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);
    }

    updateTexture(texture) {
        if (!this.currentMaterial) return;
        
        texture.flipY = false;
        this.currentMaterial.map = texture;
        this.currentMaterial.needsUpdate = true;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}