import { useArtworkContext } from '../../hooks/useArtworkContext';
import { useFileUpload } from '../../hooks/useFileUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/Loading';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';
import styles from './UploadArtwork.module.css';
import ProgressBar from '../../components/ProgressBar';

const SPREADSHEET_MIME = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];
const SPREADSHEET_EXT = ['.xlsx'];
const IMAGE_MIME = ['image/*'];

const UploadArtwork = () => {
    const { isLoading, uploadSpreadsheetArtwork } = useArtworkContext();
    const spreadsheet = useFileUpload({
        mime: SPREADSHEET_MIME,
        ext: SPREADSHEET_EXT
    });
    const images = useFileUpload({ mime: IMAGE_MIME, ext: [] });

    const handleSubmitSpreadsheet = async (e) => {
        e.preventDefault();

        if (spreadsheet.files.length === 1) {
            await uploadSpreadsheetArtwork(spreadsheet.files[0]);
            spreadsheet.resetFiles();
        }
    };

    const handleSubmitImages = async (e) => {
        e.preventDefault();

        if (images.files.length > 0) {
            await images.handleBulkImageUpload();
        }
    };

    return !isLoading.artwork ? (
        <section className={styles.container}>
            <div className={styles.instructions}>
                <h2>Upload Exported Spreadsheet</h2>
                <p>
                    The spreadsheet uploaded must have been exported from
                    Microsoft Access without any type of formatting or
                    structural changes made to it.
                </p>
            </div>
            <div className={styles.uploads}>
                <section
                    className={styles.spreadsheet}
                    {...(images.isUploading && { 'data-loading': true })}
                >
                    <h3>1.) Upload Spreadsheet</h3>
                    {!isLoading.upload ? (
                        <form onSubmit={handleSubmitSpreadsheet}>
                            <FileUpload
                                files={spreadsheet.files}
                                onChange={spreadsheet.handleFileChange}
                                onDrop={spreadsheet.handleFileDrop}
                                disabled={images.isUploading}
                                accept=".xlsx"
                            />
                            <FileList
                                files={spreadsheet.files}
                                onDelete={spreadsheet.handleRemoveFile}
                            />
                            <button
                                type="submit"
                                className={styles.submit}
                                disabled={images.isUploading}
                            >
                                Upload Spreadsheet
                            </button>
                        </form>
                    ) : (
                        <div className={styles.loading_container}>
                            <Loading />
                        </div>
                    )}
                </section>
                <div className={styles.arrow}>
                    <FontAwesomeIcon icon={faArrowRightLong} />
                </div>
                <section className={styles.images}>
                    <h3>2.) Upload Images</h3>
                    <ProgressBar
                        progress={images.progress}
                        isUploading={images.isUploading}
                    />
                    {!images.isUploading ? (
                        <form onSubmit={handleSubmitImages}>
                            <FileUpload
                                files={images.files}
                                onChange={images.handleFileChange}
                                onDrop={images.handleFileDrop}
                                disabled={isLoading.upload}
                                accept="image/*"
                                multiple
                            />
                            <FileList
                                files={images.files}
                                onDelete={images.handleRemoveFile}
                            />
                            <button
                                type="submit"
                                className={styles.submit}
                                disabled={isLoading.upload}
                            >
                                Upload Images
                            </button>
                        </form>
                    ) : (
                        <div className={styles.loading_container}>
                            <Loading />
                        </div>
                    )}
                </section>
            </div>
        </section>
    ) : (
        <Loading />
    );
};

export default UploadArtwork;
