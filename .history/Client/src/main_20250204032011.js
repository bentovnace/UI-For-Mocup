import { SceneManager } from 'Client\\src\\scene\\SceneManager.js';
import { TextureManager } from '.Client\src\scene\TextureManager.js';

// Khởi tạo ứng dụng
const sceneManager = new SceneManager('canvas-container');
const textureManager = new TextureManager(sceneManager);

// Tải model và khởi động animation
sceneManager.loadModel('Animated Walking Tshirt.glb')
    .then(success => {
        if (success) {
            sceneManager.animate();
            console.log('Model loaded successfully!');
        } else {
            console.error('Failed to load model');
        }
    })
    .catch(error => {
        console.error('Critical error:', error);
    });