
import * as THREE from 'three';

export class TextureManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.textureLoader = new THREE.TextureLoader();
        this.initFileInput();
    }

    initFileInput() {
        const fileInput = document.getElementById('textureInput');
        const applyBtn = document.getElementById('applyTextureBtn');

        applyBtn.addEventListener('click', async () => {
            if (!fileInput.files.length) {
                alert('Please select a texture file first!');
                return;
            }

            const file = fileInput.files[0];
            const texture = await this.loadTexture(file);
            
            if (texture) {
                this.sceneManager.updateTexture(texture);
            }
        });
    }

    loadTexture(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                this.textureLoader.load(
                    e.target.result,
                    texture => resolve(texture),
                    undefined,
                    error => reject(error)
                );
            };
            
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }
}