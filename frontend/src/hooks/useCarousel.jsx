import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthContext } from './useAuthContext';

export const useCarousel = () => {
    const [storedImages, setStoredImages] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const { authFetch } = useAuthContext();

    useEffect(() => {
        return () => {
            // Clean-up remaining URLs when component unmounts.
            uploadedFiles.forEach((file) => URL.revokeObjectURL(file.path));
        };
    }, [uploadedFiles]);

    const images = useMemo(() => {
        const current = storedImages.map((image) => ({
            id: image.id,
            path: image.path,
            isNew: false
        }));
        const uploaded = uploadedFiles.map((file) => ({
            file: file.file, // LOL
            path: file.path,
            isNew: true
        }));

        return [...current, ...uploaded];
    }, [storedImages, uploadedFiles]);

    const hasChanges = useMemo(() => {
        return uploadedFiles.length > 0 || deletedImages.length > 0;
    }, [uploadedFiles, deletedImages]);

    const handleUpload = useCallback((e) => {
        e.preventDefault();

        const files = e.type === 'drop' ? e.dataTransfer.files : e.target.files;
        const filesArray = Array.from(files);

        const newFiles = filesArray
            .filter((file) => file.type.startsWith('image/'))
            .map((file) => ({
                file,
                path: URL.createObjectURL(file)
            }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);

        if (e.type === 'change') {
            e.target.value = '';
        }
    }, []);

    const handleDelete = useCallback(
        (image) => {
            if (image.isNew) {
                const toRemove = uploadedFiles.find(
                    (file) => file.path === image.path
                );

                if (toRemove) {
                    // WOW! Memory management in JavaScript!
                    URL.revokeObjectURL(toRemove.path);
                }

                setUploadedFiles((prev) =>
                    prev.filter((file) => file.path !== image.path)
                );

                return;
            }

            const original = storedImages.find((img) => img.id === image.id);

            if (original) {
                setStoredImages((prev) =>
                    prev.filter((img) => img.id !== image.id)
                );
                setDeletedImages((prev) => [...prev, original.id]);
            }
        },
        [storedImages, uploadedFiles]
    );

    const setCarouselState = useCallback((initialState = []) => {
        setStoredImages([...initialState]);
        setUploadedFiles([]);
        setDeletedImages([]);
    }, []);

    const fetchImagesByArtworkId = useCallback(
        async (id) => {
            try {
                const response = await authFetch(`/api/image/${id}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCarouselState([...data]);
                }
            } catch (error) {
                console.log(error);
            }
        },
        [authFetch, setCarouselState]
    );

    return {
        images,
        uploadedFiles: uploadedFiles.map((file) => file.file), // I only want the file to send to DB
        deletedImages,
        hasChanges,
        handleUpload,
        handleDelete,
        fetchImagesByArtworkId,
        setCarouselState
    };
};
