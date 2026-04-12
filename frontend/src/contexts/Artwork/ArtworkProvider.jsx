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
    }, [authFetch, user]);

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

                if (artworkResponse.ok) {
                    // ArtworkResponse returns it's Artwork.Id
                    const id = await artworkResponse.json();

                    if (images.length > 0) {
                        const formData = new FormData();
                        images.forEach((file) => {
                            formData.append('images', file);
                        });

                        // Only send this request if the first was successful
                        await authFetch(`/api/image/${id}`, {
                            method: 'POST',
                            body: formData
                        });
                    }

                    navigate(`/artwork/${id}`);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading((prev) => ({ ...prev, artwork: false }));
            }
        },
        [authFetch, navigate]
    );

    const uploadImages = useCallback(
        async (id, images) => {
            setIsLoading((prev) => ({ ...prev, upload: true }));

            try {
                const formData = new FormData();
                images.forEach((file) => {
                    formData.append('images', file);
                });

                await authFetch(`/api/image/${id}`, {
                    method: 'POST',
                    body: formData
                });
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading((prev) => ({ ...prev, upload: false }));
            }
        },
        [authFetch]
    );

    const updateArtwork = useCallback(
        async (id, artwork) => {
            setIsLoading((prev) => ({ ...prev, artwork: true }));

            try {
                await authFetch(`/api/artwork/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(artwork)
                });
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading((prev) => ({ ...prev, artwork: false }));
            }
        },
        [authFetch]
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
                    setArtworks((prev) =>
                        prev.filter((artwork) => artwork.id !== id)
                    );

                    navigate('/artwork', { replace: true });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading((prev) => ({ ...prev, artwork: false }));
            }
        },
        [authFetch, navigate]
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
                    const errorMessage = await response.json();
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
