import { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import { useParams } from 'react-router';
import { useArtworkContext } from '../../hooks/useArtworkContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCarousel } from '../../hooks/useCarousel';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import NotFound from '../NotFound';
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import ComboBox from '../../components/Combobox';
import TextInput from '../../components/TextInput';
import TextArea from '../../components/TextArea';
import styles from './ArtworkDetail.module.css';

const artworkReducer = (state, action) => {
    switch (action.type) {
        case 'SET_INITIAL':
            return { initial: action.payload, current: action.payload };
        case 'UPDATE_FIELD':
            return {
                ...state,
                current: {
                    ...state.current,
                    [action.field]: action.value === '' ? null : action.value
                }
            };
        case 'RESET':
            return { ...state, current: state.initial };
        default:
            return state;
    }
};

const ArtworkDetail = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [state, dispatch] = useReducer(artworkReducer, {
        initial: null,
        current: null
    });
    const {
        filters,
        isLoading,
        fetchArtworkById,
        updateArtwork,
        updateLocation,
        deleteArtwork,
        uploadImages,
        deleteImages
    } = useArtworkContext();
    const {
        images,
        uploadedFiles,
        deletedImages,
        hasChanges: hasImagesChanged,
        handleUpload,
        handleDelete,
        fetchImagesByArtworkId,
        setCarouselState
    } = useCarousel();
    const { user } = useAuthContext();
    const { id } = useParams();

    useEffect(() => {
        const fetchArtwork = async () => {
            const response = await fetchArtworkById(id);

            if (response === null) {
                return;
            }

            const { images: storedImages, ...rest } = response;

            dispatch({ type: 'SET_INITIAL', payload: { ...rest } });
            setCarouselState(storedImages);
        };

        fetchArtwork();
    }, [id, fetchArtworkById, setCarouselState]);

    const isEditorRole = user.role === 'Curator' || user.role === 'Facilities';

    const compareState = (initial, current) => {
        if (initial === current) return false;

        const keys = Object.keys(current);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (current[key] !== initial[key]) {
                return true;
            }
        }

        return false;
    };

    const hasChanges = useMemo(
        () => compareState(state.initial, state.current),
        [state]
    );

    useEffect(() => {
        const clearError = () => {
            if (!hasChanges) {
                setErrorMessage(null);
            }
        };

        clearError();
    }, [hasChanges]);

    const handleChange = useCallback((value, field) => {
        const isNumeric =
            field === 'retail_Low_Estimate' || field === 'retail_High_Estimate';

        const processValue =
            isNumeric && value !== ''
                ? Number(value)
                : value === ''
                  ? null
                  : value;

        dispatch({ type: 'UPDATE_FIELD', field, value: processValue });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.role === 'Curator') {
            setErrorMessage(null);

            // If there are Images to be deleted, delete them.
            if (deletedImages.length > 0) {
                await deleteImages(deletedImages);
            }

            // Upload any Images if there are new ones.
            if (uploadedFiles.length > 0) {
                await uploadImages(id, uploadedFiles);
            }

            if (deletedImages.length > 0 || uploadedFiles.length > 0) {
                // Reset StoredImages
                await fetchImagesByArtworkId(id);
            }

            // Update Artwork Table
            if (hasChanges) {
                try {
                    await updateArtwork(id, state.current);
                    dispatch({ type: 'SET_INITIAL', payload: state.current });
                } catch (error) {
                    setErrorMessage(error.message);
                }
            }
        } else if (user.role === 'Facilities') {
            await updateLocation(id, state.current.location);
            dispatch({ type: 'SET_INITIAL', payload: state.current });
        }
    };

    const handleCancel = async () => {
        if (deletedImages.length > 0 || uploadedFiles.length > 0) {
            // Reset StoredImages
            await fetchImagesByArtworkId(id);
        }

        setErrorMessage(null);
        dispatch({ type: 'RESET' });
    };

    const handleDeleteArtwork = async () => {
        await deleteArtwork(id);
    };

    return (
        <section className={styles.container}>
            {!isLoading.filter && !isLoading.artwork && !isLoading.artworks ? (
                state.current && state.initial ? (
                    <>
                        {isEditorRole ? (
                            <div className={styles.button_row}>
                                {hasChanges || hasImagesChanged ? (
                                    <div className={styles.submit_buttons}>
                                        <button
                                            className={styles.update}
                                            type="submit"
                                            form="artwork-form"
                                        >
                                            Save
                                        </button>
                                        <button
                                            className={styles.update}
                                            type="button"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : null}
                                {user.role === 'Curator' ? (
                                    <div>
                                        <button
                                            className={styles.delete}
                                            type="button"
                                            onClick={handleDeleteArtwork}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                        <form
                            id="artwork-form"
                            className={
                                errorMessage &&
                                (errorMessage.includes('Asset_Num')
                                    ? styles.error_an
                                    : styles.error_t)
                            }
                            onSubmit={
                                user.role === 'Curator' ||
                                user.role === 'Facilities'
                                    ? handleSubmit
                                    : null
                            }
                        >
                            <div className={styles.flex_container}>
                                <div className={styles.flex_child}>
                                    <Carousel
                                        authRole={user.role}
                                        title={state.initial.title}
                                        images={images}
                                        onUpload={handleUpload}
                                        onDelete={handleDelete}
                                        hasChanged={hasImagesChanged}
                                    />
                                    <TextInput
                                        label="Asset #"
                                        field="asset_Num"
                                        type="text"
                                        value={state.current.asset_Num}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.asset_Num !==
                                            state.current.asset_Num
                                        }
                                        disabled={user.role !== 'Curator'}
                                    />
                                    {errorMessage &&
                                    errorMessage.includes('Asset_Num') ? (
                                        <span className={styles.error_message}>
                                            {errorMessage}
                                        </span>
                                    ) : null}
                                    <TextInput
                                        label="Title"
                                        field="title"
                                        type="text"
                                        value={state.current.title}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.title !==
                                            state.current.title
                                        }
                                        disabled={user.role !== 'Curator'}
                                        required
                                    />
                                    {errorMessage &&
                                    errorMessage.includes('Title') ? (
                                        <span className={styles.error_message}>
                                            {errorMessage}
                                        </span>
                                    ) : null}
                                    <TextInput
                                        label="Dimensions"
                                        field="dimensions"
                                        type="text"
                                        value={state.current.dimensions}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.dimensions !==
                                            state.current.dimensions
                                        }
                                        disabled={user.role !== 'Curator'}
                                    />
                                    <TextArea
                                        label="Description"
                                        field="description"
                                        value={state.current.description}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.description !==
                                            state.current.description
                                        }
                                        disabled={user.role !== 'Curator'}
                                    />
                                </div>
                                <div className={styles.flex_child}>
                                    <ComboBox
                                        label="Collection"
                                        field="collection"
                                        list={filters.collections}
                                        value={state.current.collection}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.collection !==
                                            state.current.collection
                                        }
                                        disabled={user.role !== 'Curator'}
                                    />
                                    <ComboBox
                                        label="Category"
                                        field="category"
                                        list={filters.categories}
                                        value={state.current.category}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.category !==
                                            state.current.category
                                        }
                                        disabled={user.role !== 'Curator'}
                                    />
                                    <ComboBox
                                        label="Artist"
                                        field="artist"
                                        list={filters.artists}
                                        value={state.current.artist}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.artist !==
                                            state.current.artist
                                        }
                                        disabled={user.role !== 'Curator'}
                                    />
                                    <ComboBox
                                        label="Medium"
                                        field="medium"
                                        list={filters.mediums}
                                        value={state.current.medium}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.medium !==
                                            state.current.medium
                                        }
                                        disabled={user.role !== 'Curator'}
                                    />
                                    <ComboBox
                                        label="Location"
                                        field="location"
                                        list={filters.locations}
                                        value={state.current.location}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.location !==
                                            state.current.location
                                        }
                                        disabled={
                                            user.role !== 'Curator' &&
                                            user.role !== 'Facilities'
                                        }
                                    />
                                    <ComboBox
                                        label="Loan Status"
                                        field="loan_Status"
                                        list={filters.loan_Statuses}
                                        value={state.current.loan_Status}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.loan_Status !==
                                            state.current.loan_Status
                                        }
                                        disabled={user.role !== 'Curator'}
                                    />
                                    <ComboBox
                                        label="Donor"
                                        field="donor"
                                        list={filters.donors}
                                        value={state.current.donor}
                                        onChange={handleChange}
                                        hasChanged={
                                            state.initial.donor !==
                                            state.current.donor
                                        }
                                        disabled={user.role !== 'Curator'}
                                    />
                                    {user.role === 'Curator' ? (
                                        <>
                                            <TextInput
                                                label="Retail Low Estimate"
                                                field="retail_Low_Estimate"
                                                type="number"
                                                icon={faDollarSign}
                                                value={
                                                    state.current
                                                        .retail_Low_Estimate
                                                }
                                                onChange={handleChange}
                                                hasChanged={
                                                    state.initial
                                                        .retail_Low_Estimate !==
                                                    state.current
                                                        .retail_Low_Estimate
                                                }
                                            />
                                            <TextInput
                                                label="Retail High Estimate"
                                                field="retail_High_Estimate"
                                                type="number"
                                                icon={faDollarSign}
                                                value={
                                                    state.current
                                                        .retail_High_Estimate
                                                }
                                                onChange={handleChange}
                                                hasChanged={
                                                    state.initial
                                                        .retail_High_Estimate !==
                                                    state.current
                                                        .retail_High_Estimate
                                                }
                                            />
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </form>
                    </>
                ) : (
                    <NotFound />
                )
            ) : (
                <Loading />
            )}
        </section>
    );
};

export default ArtworkDetail;
