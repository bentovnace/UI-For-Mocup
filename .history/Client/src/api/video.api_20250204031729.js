export class VideoAPI {
    static async uploadTexture(file) {
        const formData = new FormData();
        formData.append('texture', file);

        const response = await fetch('/api/textures', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');
        return response.json();
    }

    static async generateVideo() {
        const response = await fetch('/api/videos');
        if (!response.ok) throw new Error('Generation failed');
        return response.blob();
    }
}