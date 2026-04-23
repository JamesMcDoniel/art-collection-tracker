import { useState, useCallback, useReducer } from 'react';
import { useArtworkContext } from '../../hooks/useArtworkContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCarousel } from '../../hooks/useCarousel';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import ComboBox from '../../components/Combobox';
import TextInput from '../../components/TextInput';
import TextArea from '../../components/TextArea';
import styles from './NewArtwork.module.css';

const artworkReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.field]: action.value === '' ? null : action.value
            };

        default:
            return state;
    }
};

const NewArtwork = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [state, dispatch] = useReducer(artworkReducer, {
        asset_Num: null,
        title: null,
        description: null,
        dimensions: null,
        collection: null,
        category: null,
        artist: null,
        medium: null,
        location: null,
        loan_Status: null,
        donor: null,
        retail_Low_Estimate: null,
        retail_High_Estimate: null
    });
    const { filters, isLoading, createArtwork } = useArtworkContext();
    const {
        images,
        uploadedFiles,
        handleUpload,
        handleDelete,
        hasChanges: hasImagesChanged
    } = useCarousel();
    const { user } = useAuthContext();

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

        try {
            await createArtwork(state, uploadedFiles);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <section className={styles.container}>
            {!isLoading.filter && !isLoading.artwork && !isLoading.artworks ? (
                <>
                    <div className={styles.button_row}>
                        <div>
                            <button
                                className={styles.update}
                                type="submit"
                                form="artwork-form"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    <form
                        id="artwork-form"
                        className={
                            errorMessage &&
                            (errorMessage.includes('Asset_Num')
                                ? styles.error_an
                                : styles.error_t)
                        }
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.flex_container}>
                            <div className={styles.flex_child}>
                                <Carousel
                                    authRole={user.role}
                                    title={state?.title ?? ''}
                                    images={images}
                                    onUpload={handleUpload}
                                    onDelete={handleDelete}
                                    hasChanged={hasImagesChanged}
                                />
                                <TextInput
                                    label="Asset #"
                                    field="asset_Num"
                                    type="text"
                                    value={state.asset_Num ?? ''}
                                    onChange={handleChange}
                                    trackNew
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
                                    value={state.title ?? ''}
                                    onChange={handleChange}
                                    trackNew
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
                                    value={state.dimensions ?? ''}
                                    onChange={handleChange}
                                    trackNew
                                />
                                <TextArea
                                    label="Description"
                                    field="description"
                                    value={state.description ?? ''}
                                    onChange={handleChange}
                                    trackNew
                                />
                            </div>
                            <div className={styles.flex_child}>
                                <ComboBox
                                    label="Collection"
                                    field="collection"
                                    list={filters.collections}
                                    value={state.collection}
                                    onChange={handleChange}
                                    trackNew
                                />
                                <ComboBox
                                    label="Category"
                                    field="category"
                                    list={filters.categories}
                                    value={state.category}
                                    onChange={handleChange}
                                    trackNew
                                />
                                <ComboBox
                                    label="Artist"
                                    field="artist"
                                    list={filters.artists}
                                    value={state.artist}
                                    onChange={handleChange}
                                    trackNew
                                />
                                <ComboBox
                                    label="Medium"
                                    field="medium"
                                    list={filters.mediums}
                                    value={state.medium}
                                    onChange={handleChange}
                                    trackNew
                                />
                                <ComboBox
                                    label="Location"
                                    field="location"
                                    list={filters.locations}
                                    value={state.location}
                                    onChange={handleChange}
                                    trackNew
                                />
                                <ComboBox
                                    label="Loan Status"
                                    field="loan_Status"
                                    list={filters.loan_Statuses}
                                    value={state.loan_Status}
                                    onChange={handleChange}
                                    trackNew
                                />
                                <ComboBox
                                    label="Donor"
                                    field="donor"
                                    list={filters.donors}
                                    value={state.donor}
                                    onChange={handleChange}
                                    trackNew
                                />
                                {user.role === 'Curator' ? (
                                    <>
                                        <TextInput
                                            label="Retail Low Estimate"
                                            field="retail_Low_Estimate"
                                            type="number"
                                            icon={faDollarSign}
                                            value={
                                                state.retail_Low_Estimate ?? ''
                                            }
                                            onChange={handleChange}
                                            trackNew
                                        />
                                        <TextInput
                                            label="Retail High Estimate"
                                            field="retail_High_Estimate"
                                            type="number"
                                            icon={faDollarSign}
                                            value={
                                                state.retail_High_Estimate ?? ''
                                            }
                                            onChange={handleChange}
                                            trackNew
                                        />
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </form>
                </>
            ) : (
                <Loading />
            )}
        </section>
    );
};

export default NewArtwork;
