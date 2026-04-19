import { useState, useCallback } from 'react';
import { useReportContext } from './useReportContext';
import { useAuthContext } from './useAuthContext';

export const useFileUpload = ({ mime, ext }) => {
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState({
        percent: 0,
        file: '',
        current: 0,
        total: 0
    });
    const [isUploading, setIsUploading] = useState(false);
    const { uploadReports } = useReportContext();
    const { authFetch } = useAuthContext();

    const validateFiles = useCallback(
        (files) => {
            return files.filter((file) => {
                const ext_dot = file.name.lastIndexOf('.');
                const fileExt = file.name.substring(ext_dot);

                const isValidExt = ext.includes(fileExt);
                const isValidMime =
                    mime.length === 1 && mime[0] === 'image/*'
                        ? file.type.startsWith('image/')
                        : mime.includes(file.type);

                return isValidExt || isValidMime;
            });
        },
        [mime, ext]
    );

    const handleFileChange = useCallback(
        (e) => {
            const selectedFiles = e.target.files;
            if (selectedFiles && selectedFiles.length > 0) {
                const newFiles = Array.from(selectedFiles);
                const validFiles = validateFiles(newFiles);

                setFiles((prev) => [...prev, ...validFiles]);
            }
        },
        [validateFiles]
    );

    const handleFileDrop = useCallback(
        (e) => {
            e.preventDefault();

            const droppedFiles = e.dataTransfer.files;
            if (droppedFiles.length > 0) {
                const newFiles = Array.from(droppedFiles);
                const validFiles = validateFiles(newFiles);

                setFiles((prev) => [...prev, ...validFiles]);
            }
        },
        [validateFiles]
    );

    const handleRemoveFile = useCallback((name) => {
        setFiles((prev) => prev.filter((file) => file.name !== name));
    }, []);

    const resetFiles = useCallback(() => {
        setFiles([]);
    }, []);

    const handleReportUpload = useCallback(
        async (e) => {
            e.preventDefault();

            await uploadReports(files);
            setFiles([]);
        },
        [files, uploadReports]
    );

    const handleBulkImageUpload = useCallback(async () => {
        setProgress({
            percent: 0,
            file: '',
            completed: 0,
            total: files.length
        });
        setIsUploading(true);

        // const CONCURRENCY_LIMIT = Math.min(
        //     files.length,
        //     navigator.hardwareConcurrency || 4
        // );

        // Unleashing 8 cores on the Azure Free Tier will likely
        // make it explode.
        const CONCURRENCY_LIMIT = Math.min(files.length, 2);

        const queue = [...files];
        let completedCount = 0;

        const runner = async () => {
            while (queue.length > 0) {
                const file = queue.shift();
                if (!file) continue;

                const worker = new Worker('/js/image-worker.js');

                try {
                    setProgress((prev) => ({ ...prev, file: file.name }));

                    const converted = await new Promise((resolve, reject) => {
                        worker.onmessage = (e) =>
                            e.data.status === 'success'
                                ? resolve(e.data)
                                : reject(e.data.error);
                        worker.onerror = reject;
                        worker.postMessage({ file, quality: 0.8 });
                    });

                    const webpFile = new File(
                        [converted.blob],
                        file.name.replace(/\.[^/.]+$/, '') + '.webp',
                        { type: 'image/webp' }
                    );

                    const formData = new FormData();
                    formData.append('image', webpFile);

                    await authFetch('/api/image/spreadsheet', {
                        method: 'POST',
                        body: formData
                    });

                    completedCount++;
                    setProgress((prev) => ({
                        ...prev,
                        percent: Math.round(
                            (completedCount / files.length) * 100
                        ),
                        completed: completedCount
                    }));
                } catch (error) {
                    console.log(error);
                } finally {
                    worker.terminate();
                }
            }
        };

        const lanes = [];
        for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
            lanes.push(runner());
        }

        await Promise.all(lanes);

        setIsUploading(false);
        setFiles([]);
    }, [files, authFetch]);

    return {
        files,
        progress,
        isUploading,
        resetFiles,
        handleFileChange,
        handleFileDrop,
        handleRemoveFile,
        handleReportUpload,
        handleBulkImageUpload
    };
};
