import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ArtworkContext } from './ArtworkContext';
import { useAuthContext } from '../../hooks/useAuthContext';

export const ArtworkProvider = ({ children }) => {
    const [artworks, setArtworks] = useState([]);
    const [filters, setFilters] = useState([]);
    const [isLoading, setIsLoading] = useState({
        artworks: true,
        artwork: false,
        filters: true,
        upload: false
    });
    const { user, authFetch } = useAuthContext();
    const navigate = useNavigate();

    const fetchArtworks = useCallback(async () => {
        setIsLoading((prev) => ({ ...prev, artworks: true }));
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
            setIsLoading((prev) => ({ ...prev, artworks: false }));
        }
    }, [authFetch]);

    useEffect(() => {
        if (!user) return;

        fetchArtworks();
    }, [user, fetchArtworks]);

    useEffect(() => {
        if (!user || (user.role !== 'Curator' && user.role !== 'Facilities'))
            return;

        const fetchFilters = async () => {
            try {
                const response = await authFetch('/api/artwork/filters', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                });
                const data = await response.json();

                setFilters(data);
            } catch (error) {
                console.log(error);
                setFilters([]);
            } finally {
                setIsLoading((prev) => ({ ...prev, filters: false }));
            }
        };

        fetchFilters();
    }, [authFetch, user, artworks]);

    const fetchArtworkById = useCallback(
        async (id) => {
            setIsLoading((prev) => ({ ...prev, artwork: true }));

            try {
                const response = await authFetch(`/api/artwork/${id}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                });
                const data = await response.json();

                return data;
            } catch (error) {
                console.log(error);
                return null;
            } finally {
                setIsLoading((prev) => ({ ...prev, artwork: false }));
            }
        },
        [authFetch]
    );

    const createArtwork = useCallback(
        async (artwork, images = []) => {
            setIsLoading((prev) => ({ ...prev, artwork: true }));

            try {
                const artworkResponse = await authFetch('/api/artwork', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(artwork)
                });

                if (!artworkResponse.ok) {
                    let errorMessage = 'Something went wrong';

                    try {
                        const errorResponse = await artworkResponse.text();
                        errorMessage = errorResponse || errorMessage;
                    } catch (error) {
                        console.log('nipple', error);
                    }

                    throw new Error(errorMessage);
                }

                if (artworkResponse.ok) {
                    // ArtworkResponse returns its Artwork.Id
                    const id = await artworkResponse.json();

                    if (images.length > 0) {
                        // const CONCURRENCY_LIMIT = Math.min(
                        //     files.length,
                        //     navigator.hardwareConcurrency || 4
                        // );

                        // Unleashing 8 cores on the Azure Free Tier will likely
                        // make it explode.
                        const CONCURRENCY_LIMIT = Math.min(images.length, 2);

                        const queue = [...images];

                        const runner = async () => {
                            while (queue.length > 0) {
                                const file = queue.shift();
                                if (!file) continue;

                                const worker = new Worker(
                                    '/js/image-worker.js'
                                );

                                try {
                                    const converted = await new Promise(
                                        (resolve, reject) => {
                                            worker.onmessage = (e) =>
                                                e.data.status === 'success'
                                                    ? resolve(e.data)
                                                    : reject(e.data.error);
                                            worker.onerror = reject;
                                            worker.postMessage({
                                                file,
                                                quality: 0.8
                                            });
                                        }
                                    );

                                    const webpFile = new File(
                                        [converted.blob],
                                        file.name.replace(/\.[^/.]+$/, '') +
                                            '.webp',
                                        { type: 'image/webp' }
                                    );

                                    const formData = new FormData();
                                    formData.append('image', webpFile);

                                    await authFetch(`/api/image/${id}`, {
                                        method: 'POST',
                                        body: formData
                                    });
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
                    }

                    fetchArtworks();
                    navigate(`/artwork/${id}`);
                }
            } catch (error) {
                throw new Error(error.message);
            } finally {
                setIsLoading((prev) => ({ ...prev, artwork: false }));
            }
        },
        [authFetch, navigate, fetchArtworks]
    );

    const uploadImages = useCallback(
        async (id, images) => {
            setIsLoading((prev) => ({ ...prev, upload: true }));

            // const CONCURRENCY_LIMIT = Math.min(
            //     files.length,
            //     navigator.hardwareConcurrency || 4
            // );

            // Unleashing 8 cores on the Azure Free Tier will likely
            // make it explode.
            const CONCURRENCY_LIMIT = Math.min(images.length, 2);

            const queue = [...images];

            const runner = async () => {
                while (queue.length > 0) {
                    const file = queue.shift();
                    if (!file) continue;

                    const worker = new Worker('/js/image-worker.js');

                    try {
                        const converted = await new Promise(
                            (resolve, reject) => {
                                worker.onmessage = (e) =>
                                    e.data.status === 'success'
                                        ? resolve(e.data)
                                        : reject(e.data.error);
                                worker.onerror = reject;
                                worker.postMessage({
                                    file,
                                    quality: 0.8
                                });
                            }
                        );

                        const webpFile = new File(
                            [converted.blob],
                            file.name.replace(/\.[^/.]+$/, '') + '.webp',
                            { type: 'image/webp' }
                        );

                        const formData = new FormData();
                        formData.append('image', webpFile);

                        await authFetch(`/api/image/${id}`, {
                            method: 'POST',
                            body: formData
                        });
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

            setIsLoading((prev) => ({ ...prev, upload: false }));
        },
        [authFetch]
    );

    const updateArtwork = useCallback(
        async (id, artwork) => {
            setIsLoading((prev) => ({ ...prev, artwork: true }));

            try {
                const response = await authFetch(`/api/artwork/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(artwork)
                });

                if (!response.ok) {
                    let errorMessage = 'Something went wrong';

                    try {
                        const errorResponse = await response.text();
                        errorMessage = errorResponse || errorMessage;
                    } catch (error) {
                        console.log(error);
                    }

                    throw new Error(errorMessage);
                }

                fetchArtworks();
            } catch (error) {
                // Re-throw
                throw new Error(error.message);
            } finally {
                setIsLoading((prev) => ({ ...prev, artwork: false }));
            }
        },
        [authFetch, fetchArtworks]
    );

    const updateLocation = useCallback(
        async (id, location) => {
            setIsLoading((prev) => ({ ...prev, artwork: true }));

            try {
                await authFetch(`/api/artwork/${id}/location`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        location
                    })
                });
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading((prev) => ({ ...prev, artwork: false }));
            }
        },
        [authFetch]
    );

    const deleteArtwork = useCallback(
        async (id) => {
            setIsLoading((prev) => ({ ...prev, artwork: true }));

            try {
                const response = await authFetch(`/api/artwork/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchArtworks();
                    navigate('/artwork', { replace: true });
                    setIsLoading((prev) => ({ ...prev, artwork: false }));
                }
            } catch (error) {
                console.log(error);
            }
        },
        [authFetch, navigate, fetchArtworks]
    );

    const deleteImages = useCallback(
        async (ids) => {
            setIsLoading((prev) => ({ ...prev, upload: true }));

            try {
                await authFetch('/api/image', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ids)
                });
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading((prev) => ({ ...prev, upload: false }));
            }
        },
        [authFetch]
    );

    const uploadSpreadsheetArtwork = useCallback(
        async (file) => {
            setIsLoading((prev) => ({ ...prev, upload: true }));

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await authFetch('/api/artwork/spreadsheet', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || response.status);
                }

                fetchArtworks();
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading((prev) => ({ ...prev, upload: false }));
            }
        },
        [authFetch, fetchArtworks]
    );

    const value = useMemo(
        () => ({
            artworks,
            filters,
            isLoading,
            fetchArtworkById,
            createArtwork,
            uploadImages,
            updateArtwork,
            updateLocation,
            deleteArtwork,
            deleteImages,
            uploadSpreadsheetArtwork
        }),
        [
            artworks,
            filters,
            isLoading,
            fetchArtworkById,
            createArtwork,
            uploadImages,
            updateArtwork,
            updateLocation,
            deleteArtwork,
            deleteImages,
            uploadSpreadsheetArtwork
        ]
    );

    return (
        <ArtworkContext.Provider value={value}>
            {children}
        </ArtworkContext.Provider>
    );
};
