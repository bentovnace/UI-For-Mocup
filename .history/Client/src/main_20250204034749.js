import { SceneManager } from '/Client/src/scene/SceneManager.js';
import { TextureManager } from '/Client/src/scene/TextureManager.js';

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

// Lấy các phần tử từ DOM
const applyTextureBtn = document.getElementById('applyTextureBtn');
const generateVideoBtn = document.getElementById('generateVideoBtn');
const textureInput = document.getElementById('textureInput');
const videoPreview = document.getElementById('video-preview');

let textureFile = null;

// Kiểm tra khi người dùng tải ảnh lên
textureInput.addEventListener('change', (e) => {
    textureFile = e.target.files[0]; // Lưu ảnh tải lên
});

// Logic khi người dùng nhấn nút Apply Texture
applyTextureBtn.addEventListener('click', () => {
    if (!textureFile) {
        alert("Chưa có ảnh tải lên.");
    } else {
        // Ứng dụng texture vào mô hình (giả sử bạn đã có phương thức applyTexture trong TextureManager)
        textureManager.applyTexture(textureFile);
        alert("Ảnh đã được tải lên và áp dụng!");
    }
});

// Logic khi người dùng nhấn nút Generate Video
generateVideoBtn.addEventListener('click', async () => {
    if (!textureFile) {
        alert("Chưa có ảnh tải lên. Vui lòng tải ảnh trước.");
        return;
    }

    // 1. Gửi ảnh lên server để upload
    const formData = new FormData();
    formData.append('texture', textureFile);

    try {
        // Gửi ảnh lên server
        const responseUpload = await fetch('http://127.0.0.1:5000/upload_texture', {
            method: 'POST',
            body: formData,
        });

        if (!responseUpload.ok) {
            throw new Error("Lỗi khi tải ảnh lên");
        }

        // 2. Gọi API lấy video sau khi tải ảnh lên thành công
        const responseVideo = await fetch('http://127.0.0.1:5000/get_video');
        if (!responseVideo.ok) {
            throw new Error("Lỗi khi lấy video");
        }

        // Nhận video từ server và hiển thị
        const videoBlob = await responseVideo.blob();
        const videoUrl = URL.createObjectURL(videoBlob);

        // Hiển thị video preview
        videoPreview.src = videoUrl;
        videoPreview.style.display = 'block';
        videoPreview.play();

    } catch (error) {
        alert(`Đã xảy ra lỗi: ${error.message}`);
    }
});
