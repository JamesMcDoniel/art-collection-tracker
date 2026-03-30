import { useState } from 'react';
import { useArtworkContext } from '../../hooks/useArtworkContext';
import Loading from '../../components/Loading';

const UploadArtwork = () => {
    const [spreadsheet, setSpreadsheet] = useState(null);
    const [images, setImages] = useState([]);
    const { isLoading, uploadArtwork, uploadImages } = useArtworkContext();

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages(files);
    };

    const handleSubmitSpreadsheet = async (e) => {
        e.preventDefault();

        if (spreadsheet) {
            await uploadArtwork(spreadsheet);
        }
    };

    const handleSubmitImages = async (e) => {
        e.preventDefault();

        if (images.length > 0) {
            await uploadImages(images);
        }
    };

    return !isLoading.upload ? (
        <>
            <form onSubmit={handleSubmitSpreadsheet}>
                <div>
                    <label htmlFor="upload-spreadsheet">
                        Upload Spreadsheet
                    </label>
                    <input
                        id="upload-spreadsheet"
                        type="file"
                        accept=".xls, .xlsx"
                        onChange={(e) => setSpreadsheet(e.target.files[0])}
                    />
                </div>
                <button type="submit">Upload</button>
            </form>
            <hr />
            <form onSubmit={handleSubmitImages}>
                <div>
                    <label htmlFor="upload-images">Upload Images</label>
                    <input
                        id="upload-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                    />
                </div>
                <button type="submit">Upload</button>
            </form>
        </>
    ) : (
        <Loading />
    );
};

export default UploadArtwork;
