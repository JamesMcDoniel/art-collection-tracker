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

        const worker = new Worker('/js/image-worker.js');

        for (const file of files) {
            try {
                setProgress((prev) => ({ ...prev, file: file.name }));

                const converted = await new Promise((resolve, reject) => {
                    worker.onmessage = (e) =>
                        e.data.status === 'success'
                            ? resolve(e.data)
                            : reject(e.data.error);
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

                setProgress((prev) => ({
                    ...prev,
                    percent: Math.round(
                        ((prev.completed + 1) / files.length) * 100
                    ),
                    completed: prev.completed + 1
                }));
            } catch (error) {
                console.log(`Error ${file.name}: `, error);
            }
        }

        worker.terminate();
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
