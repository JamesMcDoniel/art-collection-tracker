import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ArtworkContext } from './ArtworkContext';
import { useAuthContext } from '../../hooks/useAuthContext';

export const ArtworkProvider = ({ children }) => {
    const [artwork, setArtwork] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [isLoading, setIsLoading] = useState({
        artwork: true,
        upload: false
    });
    const { user, authFetch } = useAuthContext();
    const navigate = useNavigate();

    const fetchArtworks = useCallback(async () => {
        try {
            const response = await authFetch('/api/artwork', {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            });
            const data = await response.json();

            setArtworks(data);
        } catch (error) {
            console.log(error);
            setArtworks([]);
        } finally {
            setIsLoading((prev) => ({
                ...prev,
                artwork: false
            }));
        }
    }, [authFetch]);

    useEffect(() => {
        if (!user) return;

        fetchArtworks();
    }, [user, fetchArtworks]);

    const fetchArtworkById = useCallback(
        async (id) => {
            try {
                const response = await authFetch(`/api/artwork/${id}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                });
                const data = await response.json();

                setArtwork(data);
            } catch (error) {
                console.log(error);
                setArtwork(null);
            }
        },
        [authFetch]
    );

    const createArtwork = useCallback(
        async (data) => {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== null && key !== 'images') {
                    formData.append(key, value);
                }
            });

            if (data.images && data.images.length > 0) {
                data.images.forEach((file) => {
                    formData.append('images', file);
                });
            }

            const response = await authFetch('/api/artwork', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/artwork/${data}`);
            } else {
                throw new Error('Artwork creation failed');
            }
        },
        [authFetch, navigate]
    );

    const uploadArtwork = useCallback(
        async (file) => {
            setIsLoading((prev) => ({
                ...prev,
                upload: true
            }));

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await authFetch('/api/artwork/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorMessage = await response.json();
                    throw new Error(errorMessage || response.status);
                }

                fetchArtworks();
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading((prev) => ({
                    ...prev,
                    upload: false
                }));
            }
        },
        [authFetch, fetchArtworks]
    );

    const uploadImages = useCallback(
        async (files) => {
            setIsLoading((prev) => ({
                ...prev,
                upload: true
            }));

            const formData = new FormData();

            if (files && files.length > 0) {
                files.forEach((file) => {
                    formData.append('images', file);
                });
            }

            try {
                const response = await authFetch('/api/image/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorMessage = await response.json();
                    throw new Error(errorMessage || response.status);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading((prev) => ({
                    ...prev,
                    upload: false
                }));
            }
        },
        [authFetch]
    );

    const updateArtwork = useCallback(
        async (id, data) => {
            // This doesn't handle images, those are handled separately.
            const response = await authFetch(`/api/artwork/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const data = await response.json();
                setArtwork(data);
            }
        },
        [authFetch]
    );

    const updateLocation = useCallback(
        async (id, location) => {
            const response = await authFetch(`/api/artwork/${id}/location`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    location
                })
            });

            if (response.ok) {
                setArtwork((prev) => ({
                    ...prev,
                    location
                }));
            }
        },
        [authFetch]
    );

    const deleteArtwork = useCallback(
        async (id) => {
            const response = await authFetch(`/api/artwork/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setArtwork(null);
                setArtworks((prev) =>
                    prev.filter((artwork) => artwork.id !== id)
                );
                navigate('/artwork', { replace: true });
            }
        },
        [authFetch, navigate]
    );

    const value = useMemo(
        () => ({
            artwork,
            artworks,
            isLoading,
            fetchArtworkById,
            createArtwork,
            uploadArtwork,
            uploadImages,
            updateArtwork,
            updateLocation,
            deleteArtwork
        }),
        [
            artwork,
            artworks,
            isLoading,
            fetchArtworkById,
            createArtwork,
            uploadArtwork,
            uploadImages,
            updateArtwork,
            updateLocation,
            deleteArtwork
        ]
    );

    return (
        <ArtworkContext.Provider value={value}>
            {children}
        </ArtworkContext.Provider>
    );
};
