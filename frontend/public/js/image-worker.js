self.onmessage = async (e) => {
    const { file, quality } = e.data;

    try {
        const bitmap = await createImageBitmap(file);

        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);

        const blob = await canvas.convertToBlob({
            type: 'image/webp',
            quality: quality || 0.8
        });

        self.postMessage({
            status: 'success',
            blob,
            originalName: file.name
        });
    } catch (error) {
        self.postMessage({ status: 'error', error: error.message });
    }
};
