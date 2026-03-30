import { useState } from 'react';
import { useArtworkContext } from '../../hooks/useArtworkContext';

const NewArtwork = () => {
    const [formData, setFormData] = useState({
        asset_num: '',
        title: '',
        description: '',
        dimensions: '',
        retail_low_estimate: '',
        retail_high_estimate: '',
        collection: '',
        category: '',
        artist: '',
        medium: '',
        location: '',
        loan_status: '',
        donor: '',
        images: []
    });
    const { createArtwork } = useArtworkContext();

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        // If input.type is number, parseFloat. Otherwise, pass the value
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'number' && value !== '' ? parseFloat(value) : value
        }));
    };

    const handleFileChange = (e) => {
        // Convert the FileList to Array, and store that
        const files = Array.from(e.target.files);

        setFormData((prev) => ({
            ...prev,
            images: files
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert empty strings in the state object to null
        const data = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
                key,
                typeof value === 'string' && value.trim() === '' ? null : value
            ])
        );

        await createArtwork(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="images">Images</label>
                <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            <div>
                <label htmlFor="asset_num">Asset Number</label>
                <input
                    id="asset_num"
                    name="asset_num"
                    type="text"
                    value={formData.asset_num}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input
                    id="description"
                    name="description"
                    type="text"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="dimensions">Dimensions</label>
                <input
                    id="dimensions"
                    name="dimensions"
                    type="text"
                    value={formData.dimensions}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="retail_low_estimate">Retail Low Estimate</label>
                <input
                    id="retail_low_estimate"
                    name="retail_low_estimate"
                    type="number"
                    value={formData.retail_low_estimate}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="retail_high_estimate">
                    Retail High Estimate
                </label>
                <input
                    id="retail_high_estimate"
                    name="retail_high_estimate"
                    type="number"
                    value={formData.retail_high_estimate}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="collection">Collection</label>
                <input
                    id="collection"
                    name="collection"
                    type="text"
                    value={formData.collection}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="category">Category</label>
                <input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="artist">Artist</label>
                <input
                    id="artist"
                    name="artist"
                    type="text"
                    value={formData.artist}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="medium">Medium</label>
                <input
                    id="medium"
                    name="medium"
                    type="text"
                    value={formData.medium}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="location">Location</label>
                <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="loan_status">Loan Status</label>
                <input
                    id="loan_status"
                    name="loan_status"
                    type="text"
                    value={formData.loan_status}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="donor">Donor</label>
                <input
                    id="donor"
                    name="donor"
                    type="text"
                    value={formData.donor}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default NewArtwork;
